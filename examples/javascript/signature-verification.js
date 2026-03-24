/**
 * Salla/Zid Webhook Signature Verification
 * التحقق من توقيع Webhook لـ Salla و Zid
 *
 * This utility provides signature verification for both Salla and Zid webhooks
 * توفر هذه الأداة التحقق من التوقيع لكل من Salla و Zid
 */

const crypto = require('crypto');

/**
 * Verify Salla webhook signature
 * التحقق من توقيع webhook لـ Salla
 *
 * Salla uses HMAC-SHA256 with the webhook secret
 * تستخدم Salla تشفير HMAC-SHA256 مع مفتاح السر
 *
 * @param {string|string} payload - The raw webhook payload JSON
 * @param {string} signature - The signature from header (X-Salla-Signature)
 * @param {string} secret - Your webhook secret key
 * @returns {boolean} True if signature is valid
 */
function verifySallaSignature(payload, signature, secret) {
  // Handle buffer or string payload
  if (Buffer.isBuffer(payload)) {
    payload = payload.toString('utf8');
  }

  // Remove 'sha256=' prefix if present
  // إزالة بادئة 'sha256=' إذا كانت موجودة
  signature = signature.replace(/^sha256=/i, '');

  // Calculate expected signature
  // حساب التوقيع المتوقع
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const expectedSignature = hmac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  // مقارنة ثابتة الزمن لمنع هجمات التوقيت
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  );
}

/**
 * Verify Zid webhook signature
 * التحقق من توقيع webhook لـ Zid
 *
 * Zid uses HMAC-SHA256 with the webhook secret
 * تستخدم Zid تشفير HMAC-SHA256 مع مفتاح السر
 *
 * @param {string|Buffer} payload - The raw webhook payload JSON
 * @param {string} signature - The signature from header (X-Zid-Signature)
 * @param {string} secret - Your webhook secret key
 * @returns {boolean} True if signature is valid
 */
function verifyZidSignature(payload, signature, secret) {
  // Handle buffer or string payload
  if (Buffer.isBuffer(payload)) {
    payload = payload.toString('utf8');
  }

  // Remove any prefix if present
  // إزالة أي بادئة إذا كانت موجودة
  signature = signature.replace(/^(sha256=|hmac_sha256=)/i, '');

  // Calculate expected signature
  // حساب التوقيع المتوقع
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const expectedSignature = hmac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  // مقارنة ثابتة الزمن لمنع هجمات التوقيت
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf8'),
    Buffer.from(expectedSignature, 'utf8')
  );
}

/**
 * Auto-detect platform and verify signature
 * الكشف التلقائي عن المنصة والتحقق من التوقيع
 *
 * @param {string|Buffer} payload - The raw webhook payload
 * @param {Object} headers - All request headers
 * @param {string} sallaSecret - Salla webhook secret
 * @param {string} zidSecret - Zid webhook secret
 * @returns {{valid: boolean, platform: string|null}}
 */
function verifySignatureAutoDetect(payload, headers, sallaSecret, zidSecret) {
  // Get header values (case-insensitive)
  // الحصول على قيم الرأس (غير حساسة لحالة الأحرف)
  const sallaSignature = getHeaderValue(headers, 'x-salla-signature');
  const zidSignature = getHeaderValue(headers, 'x-zid-signature');

  // Check for Salla signature
  // التحقق من توقيع Salla
  if (sallaSignature) {
    return {
      valid: verifySallaSignature(payload, sallaSignature, sallaSecret),
      platform: 'salla'
    };
  }

  // Check for Zid signature
  // التحقق من توقيع Zid
  if (zidSignature) {
    return {
      valid: verifyZidSignature(payload, zidSignature, zidSecret),
      platform: 'zid'
    };
  }

  return {
    valid: false,
    platform: null
  };
}

/**
 * Get header value (case-insensitive)
 * الحصول على قيمة الرأس (غير حساسة لحالة الأحرف)
 *
 * @param {Object} headers - Request headers object
 * @param {string} targetHeader - Header name to find
 * @returns {string|null} Header value or null
 */
function getHeaderValue(headers, targetHeader) {
  const targetLower = targetHeader.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() === targetLower) {
      return Array.isArray(value) ? value[0] : value;
    }
  }

  return null;
}

/**
 * Extract signatures from headers
 * استخراج التوقيعات من الرؤوس
 *
 * @param {Object} headers - Request headers
 * @returns {{salla: string|null, zid: string|null}}
 */
function extractSignatures(headers) {
  return {
    salla: getHeaderValue(headers, 'x-salla-signature'),
    zid: getHeaderValue(headers, 'x-zid-signature')
  };
}

/**
 * Express middleware for signature verification
 * برمجية Express للتحقق من التوقيع
 *
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware function
 */
function signatureVerificationMiddleware(options = {}) {
  const {
    sallaSecret = process.env.SALLA_WEBHOOK_SECRET || '',
    zidSecret = process.env.ZID_WEBHOOK_SECRET || '',
    onError = null
  } = options;

  return (req, res, next) => {
    // Get raw body
    const rawBody = req.rawBody || req.body;

    // Verify signature
    const result = verifySignatureAutoDetect(
      rawBody,
      req.headers,
      sallaSecret,
      zidSecret
    );

    // Attach verification result to request
    req.webhook = {
      platform: result.platform,
      signatureValid: result.valid
    };

    // Check if signature is valid
    if (!result.valid) {
      const error = {
        error: 'Invalid signature',
        message: 'التوقيع غير صالح',
        platform: result.platform
      };

      if (onError) {
        return onError(error, req, res, next);
      }

      return res.status(401).json(error);
    }

    next();
  };
}

module.exports = {
  verifySallaSignature,
  verifyZidSignature,
  verifySignatureAutoDetect,
  extractSignatures,
  getHeaderValue,
  signatureVerificationMiddleware
};
