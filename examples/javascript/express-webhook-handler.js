/**
 * Salla/Zid Webhook Handler for Express.js
 * معالج أحداث Webhook لـ Salla و Zid باستخدام Express.js
 *
 * This module handles incoming webhooks from both Salla and Zid platforms
 * يتعامل هذا الوحدة مع الويب هوك القادمة من كل من Salla و Zid
 */

const express = require('express');
const {
  verifySignatureAutoDetect,
  signatureVerificationMiddleware
} = require('./signature-verification');

const router = express.Router();

// Configure raw body parsing for signature verification
// تكوين تحليل الجسم الخام للتحقق من التوقيع
router.use(express.json({
  verify: (req, res, buf) => {
    // Store raw body for signature verification
    // تخزين الجسم الخام للتحقق من التوقيع
    req.rawBody = buf;
  }
}));

/**
 * Main webhook handler endpoint
 * نقطة نهاية معالج الويب هوك الرئيسية
 *
 * POST /webhooks
 */
router.post('/webhooks', async (req, res) => {
  try {
    // Log incoming webhook
    // تسجيل الويب هوك القادم
    console.log('Webhook received:', {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });

    // Verify signature
    // التحقق من التوقيع
    const sallaSecret = process.env.SALLA_WEBHOOK_SECRET || '';
    const zidSecret = process.env.ZID_WEBHOOK_SECRET || '';

    const verification = verifySignatureAutoDetect(
      req.rawBody || JSON.stringify(req.body),
      req.headers,
      sallaSecret,
      zidSecret
    );

    if (!verification.valid) {
      console.warn('Invalid webhook signature:', {
        platform: verification.platform,
        ip: req.ip
      });

      return res.status(401).json({
        error: 'Invalid signature',
        message: 'التوقيع غير صالح'
      });
    }

    // Get webhook data
    // الحصول على بيانات الويب هوك
    const data = req.body;
    const event = data.event || data.event_name || 'unknown';

    console.log('Processing webhook:', {
      platform: verification.platform,
      event: event
    });

    // Process webhook based on event type
    // معالجة الويب هوك بناءً على نوع الحدث
    await processWebhook(verification.platform, event, data, req);

    // Return success response
    // إرجاع استجابة النجاح
    return res.status(200).json({
      success: true,
      message: 'Webhook received successfully',
      message_ar: 'تم استلام الويب هوك بنجاح'
    });

  } catch (error) {
    // Log error
    // تسجيل الخطأ
    console.error('Webhook processing error:', {
      error: error.message,
      stack: error.stack,
      ip: req.ip
    });

    // Return error response
    // إرجاع استجابة الخطأ
    return res.status(500).json({
      error: 'Internal server error',
      message: 'خطأ في الخادم الداخلي'
    });
  }
});

/**
 * Dedicated Salla webhook endpoint
 * نقطة نهاية مخصصة لـ Salla
 *
 * POST /webhooks/salla
 */
router.post('/webhooks/salla', async (req, res) => {
  try {
    const sallaSecret = process.env.SALLA_WEBHOOK_SECRET;
    if (!sallaSecret) {
      throw new Error('SALLA_WEBHOOK_SECRET not configured');
    }

    const signature = req.headers['x-salla-signature'];
    if (!signature) {
      return res.status(401).json({
        error: 'Missing signature',
        message: 'التوقيع مفقود'
      });
    }

    // Process webhook...
    // معالجة الويب هوك...
    const event = req.body.event || req.body.event_name || 'unknown';
    await processWebhook('salla', event, req.body, req);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Salla webhook error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
});

/**
 * Dedicated Zid webhook endpoint
 * نقطة نهاية مخصصة لـ Zid
 *
 * POST /webhooks/zid
 */
router.post('/webhooks/zid', async (req, res) => {
  try {
    const zidSecret = process.env.ZID_WEBHOOK_SECRET;
    if (!zidSecret) {
      throw new Error('ZID_WEBHOOK_SECRET not configured');
    }

    const signature = req.headers['x-zid-signature'];
    if (!signature) {
      return res.status(401).json({
        error: 'Missing signature',
        message: 'التوقيع مفقود'
      });
    }

    // Process webhook...
    // معالجة الويب هوك...
    const event = req.body.event || req.body.event_name || 'unknown';
    await processWebhook('zid', event, req.body, req);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Zid webhook error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
});

/**
 * Health check endpoint
 * نقطة نهاية الفحص الصحي
 *
 * GET /webhooks/health
 */
router.get('/webhooks/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Webhook service is running',
    message_ar: 'خدمة الويب هوك تعمل',
    timestamp: new Date().toISOString()
  });
});

/**
 * Process webhook based on platform and event type
 * معالجة الويب هوك بناءً على المنصة ونوع الحدث
 *
 * @param {string} platform - 'salla' or 'zid'
 * @param {string} event - Event name/type
 * @param {Object} data - Webhook payload data
 * @param {Object} req - Express request object
 */
async function processWebhook(platform, event, data, req) {
  console.log(`[${platform.toUpperCase()}] Processing event: ${event}`);

  // Route to appropriate handler based on event
  // التوجيه إلى المعالج المناسب بناءً على الحدث
  switch (event) {
    // Order events / أحداث الطلبات
    case 'order.created':
    case 'order.updated':
    case 'order.status.changed':
    case 'order.cancelled':
      await handleOrderEvent(platform, event, data);
      break;

    // Product events / أحداث المنتجات
    case 'product.created':
    case 'product.updated':
    case 'product.deleted':
      await handleProductEvent(platform, event, data);
      break;

    // Customer events / أحداث العملاء
    case 'customer.created':
    case 'customer.updated':
    case 'customer.deleted':
      await handleCustomerEvent(platform, event, data);
      break;

    // Payment events / أحداث الدفع
    case 'payment.captured':
    case 'payment.failed':
    case 'payment.refunded':
      await handlePaymentEvent(platform, event, data);
      break;

    // Subscription events / أحداث الاشتراكات
    case 'subscription.created':
    case 'subscription.renewed':
    case 'subscription.cancelled':
      await handleSubscriptionEvent(platform, event, data);
      break;

    default:
      console.log(`Unhandled webhook event: ${event}`);
      // You might want to store unhandled events for review
      // قد ترغب في تخزين الأحداث غير المعالجة للمراجعة
      break;
  }
}

/**
 * Handle order-related events
 * معالجة أحداث الطلبات
 *
 * @param {string} platform
 * @param {string} event
 * @param {Object} data
 */
async function handleOrderEvent(platform, event, data) {
  const orderId = data.id || data.order_id;

  console.log(`Order event received:`, {
    platform,
    event,
    orderId
  });

  // Add your custom logic here
  // أضف منطقك المخصص هنا
  // Examples:
  // - Sync to database / مزامنة مع قاعدة البيانات
  // - Send notifications / إرسال إشعارات
  // - Update inventory / تحديث المخزون
  // - Update CRM / تحديث نظام إدارة علاقات العملاء
}

/**
 * Handle product-related events
 * معالجة أحداث المنتجات
 *
 * @param {string} platform
 * @param {string} event
 * @param {Object} data
 */
async function handleProductEvent(platform, event, data) {
  const productId = data.id || data.product_id;

  console.log(`Product event received:`, {
    platform,
    event,
    productId
  });

  // Add your custom logic here
  // أضف منطقك المخصص هنا
}

/**
 * Handle customer-related events
 * معالجة أحداث العملاء
 *
 * @param {string} platform
 * @param {string} event
 * @param {Object} data
 */
async function handleCustomerEvent(platform, event, data) {
  const customerId = data.id || data.customer_id;

  console.log(`Customer event received:`, {
    platform,
    event,
    customerId
  });

  // Add your custom logic here
  // أضف منطقك المخصص هنا
}

/**
 * Handle payment-related events
 * معالجة أحداث الدفع
 *
 * @param {string} platform
 * @param {string} event
 * @param {Object} data
 */
async function handlePaymentEvent(platform, event, data) {
  const paymentId = data.id || data.payment_id;

  console.log(`Payment event received:`, {
    platform,
    event,
    paymentId
  });

  // Add your custom logic here
  // أضف منطقك المخصص هنا
}

/**
 * Handle subscription-related events
 * معالجة أحداث الاشتراكات
 *
 * @param {string} platform
 * @param {string} event
 * @param {Object} data
 */
async function handleSubscriptionEvent(platform, event, data) {
  const subscriptionId = data.id || data.subscription_id;

  console.log(`Subscription event received:`, {
    platform,
    event,
    subscriptionId
  });

  // Add your custom logic here
  // أضف منطقك المخصص هنا
}

module.exports = router;
