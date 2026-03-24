# Webhook Security Guide

---

## English

## Overview

Webhook security is critical for protecting your application from malicious attacks and ensuring data integrity. This guide covers best practices for securing your webhook endpoints.

## Key Security Concepts

### 1. Signature Verification

Always verify that incoming webhooks are genuinely from Salla or Zid by checking their cryptographic signatures.

#### Salla Signature Verification

```javascript
const crypto = require('crypto');

function verifySallaSignature(payload, signature, secret) {
  // Salla uses HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Middleware example
function sallaWebhookAuth(req, res, next) {
  const signature = req.headers['x-salla-signature'];
  const payload = req.body;

  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const isValid = verifySallaSignature(
    payload,
    signature,
    process.env.SALLA_WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}
```

#### Zid Signature Verification

```javascript
function verifyZidSignature(payload, signature, secret) {
  // Zid uses similar HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Middleware example
function zidWebhookAuth(req, res, next) {
  const signature = req.headers['x-zid-signature'];
  const payload = req.body;

  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const isValid = verifyZidSignature(
    payload,
    signature,
    process.env.ZID_WEBHOOK_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}
```

### 2. Use HTTPS

Always use HTTPS for your webhook endpoints to encrypt data in transit.

```nginx
# Nginx configuration example
server {
    listen 443 ssl http2;
    server_name webhook.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location /webhook {
        proxy_pass http://localhost:3000;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name webhook.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. Request Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many webhook requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  // Allow webhooks from Salla/Zid IPs
  skip: (req) => {
    const clientIP = req.ip;
    return isTrustedIP(clientIP);
  }
});

app.post('/webhook', webhookLimiter, handleWebhook);
```

### 4. IP Whitelisting

Only accept webhooks from official Salla and Zid IP addresses:

```javascript
const TRUSTED_IPS = {
  salla: [
    // Add official Salla IPs here
    // Check: https://docs.salla.sa
  ],
  zid: [
    // Add official Zid IPs here
    // Check: https://docs.zid.sa
  ]
};

function isTrustedIP(ip) {
  return [...TRUSTED_IPS.salla, ...TRUSTED_IPS.zid]
    .some(trustedIP => ip.startsWith(trustedIP));
}

function ipWhitelistMiddleware(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress;

  if (!isTrustedIP(clientIP)) {
    console.warn(`Untrusted IP attempted webhook: ${clientIP}`);
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}
```

### 5. Idempotency

Make your webhook handlers idempotent to safely handle duplicate deliveries:

```javascript
// Using a unique ID to prevent duplicate processing
const processedEvents = new Set();

async function processWebhookEvent(event) {
  const eventId = event.id || generateEventId(event);

  // Check if already processed
  if (processedEvents.has(eventId)) {
    console.log(`Event ${eventId} already processed, skipping`);
    return;
  }

  // Process the event
  await handleEvent(event);

  // Mark as processed
  processedEvents.add(eventId);

  // Clean up old entries (optional)
  if (processedEvents.size > 10000) {
    const firstEntry = processedEvents.values().next().value;
    processedEvents.delete(firstEntry);
  }
}

// Better: Use Redis for distributed systems
const Redis = require('ioredis');
const redis = new Redis();

async function processWebhookEventRedis(event) {
  const eventId = event.id || generateEventId(event);
  const key = `webhook:processed:${eventId}`;

  // Check if already processed using Redis SETNX
  const isNew = await redis.set(key, '1', 'NX', 'EX', 86400); // 24 hours

  if (!isNew) {
    console.log(`Event ${eventId} already processed`);
    return;
  }

  await handleEvent(event);
}
```

### 6. Input Validation

Validate all incoming webhook payloads:

```javascript
const Joi = require('joi');

// Define schema for expected webhook payload
const webhookSchema = Joi.object({
  id: Joi.string().required(),
  event: Joi.string().required(),
  data: Joi.object().required(),
  created_at: Joi.string().isoDate().required()
});

async function handleWebhook(req, res) {
  // Validate payload structure
  const { error, value } = webhookSchema.validate(req.body);

  if (error) {
    console.error('Invalid webhook payload:', error.details);
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // Sanitize input
  const sanitized = sanitizeInput(value);
  await processWebhookEvent(sanitized);

  res.status(200).send('OK');
}

function sanitizeInput(data) {
  // Remove or escape potentially dangerous content
  // Implementation depends on your use case
  return data;
}
```

### 7. Secure Secret Management

Never hardcode webhook secrets:

```javascript
// .env file (NEVER commit this)
SALLA_WEBHOOK_SECRET=your_secret_here
ZID_WEBHOOK_SECRET=your_secret_here

// Load environment variables
require('dotenv').config();

const sallaSecret = process.env.SALLA_WEBHOOK_SECRET;
const zidSecret = process.env.ZID_WEBHOOK_SECRET;

// Use in production
if (!sallaSecret || !zidSecret) {
  throw new Error('Webhook secrets not configured');
}
```

For production, use a secrets manager:

```javascript
// AWS Secrets Manager example
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function getSecret(secretName) {
  const data = await secretsManager.getSecretValue({
    SecretId: secretName
  }).promise();

  if ('SecretString' in data) {
    return JSON.parse(data.SecretString);
  }

  throw new Error('Secret not found');
}

// Usage
const sallaSecret = await getSecret('salla/webhook/secret');
```

### 8. Logging and Monitoring

Log all webhook activities for security auditing:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'webhook.log' }),
    new winston.transports.CloudWatch({
      logGroupName: '/webhooks/production'
    })
  ]
});

function logWebhook(req, status, error = null) {
  logger.info({
    timestamp: new Date().toISOString(),
    ip: req.ip,
    event: req.body.event,
    status: status,
    error: error ? error.message : null,
    signature: req.headers['x-salla-signature'] || req.headers['x-zid-signature']
  });
}

// Alert on suspicious activity
function alertOnSuspiciousActivity(req, reason) {
  logger.error({
    alert: 'SUSPICIOUS_WEBHOOK',
    reason: reason,
    ip: req.ip,
    body: req.body,
    headers: req.headers
  });

  // Send alert to your monitoring service
  sendAlert(`Suspicious webhook: ${reason}`);
}
```

## Security Checklist

- [ ] Verify webhook signatures for every request
- [ ] Use HTTPS for all endpoints
- [ ] Implement rate limiting
- [ ] Whitelist official Salla/Zid IPs
- [ ] Make handlers idempotent
- [ ] Validate all input payloads
- [ ] Use secure secret management
- [ ] Log all webhook activities
- [ ] Set up monitoring and alerts
- [ ] Regularly rotate webhook secrets
- [ ] Keep dependencies updated
- [ ] Conduct security audits

## Common Security Pitfalls

1. **Skipping signature verification** - Always verify!
2. **Hardcoding secrets** - Use environment variables or secrets managers
3. **Not handling duplicates** - Implement idempotency
4. **Logging sensitive data** - Never log full card details or tokens
5. **Ignoring rate limits** - Protect against abuse

---

## العربية

## نظرة عامة

أمان الـ Webhooks أمر بالغ الأهمية لحماية تطبيقك من الهجمات الخبيثة وضمان سلامة البيانات. يغطي هذا الدليل أفضل الممارسات لتأمين نقاط نهاية الـ webhook الخاصة بك.

## مفاهيم الأمان الرئيسية

### 1. التحقق من التوقيع

تحقق دائماً من أن webhooks الواردة تأتي فعلاً من سلة أو زد من خلال التحقق من تواقيعها المشفرة.

#### التحقق من توقيع سلة

```javascript
const crypto = require('crypto');

function verifySallaSignature(payload, signature, secret) {
  // سلة تستخدم HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  // استخدم مقارنة آمنة من حيث التوقيت لمنع هجمات التوقيت
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

#### التحقق من توقيع زد

```javascript
function verifyZidSignature(payload, signature, secret) {
  // زد تستخدم HMAC-SHA256 مشابه
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### 2. استخدام HTTPS

استخدم دائماً HTTPS لنقاط نهاية webhook لتشفير البيانات أثناء النقل.

### 3. تقييد معدل الطلبات

نفذ تقييد المعدل لمنع الإساءة:

```javascript
const rateLimit = require('express-rate-limit');

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 1000, // حد كل IP بـ 1000 طلب
  message: 'طلبات webhook كثيرة جداً من هذا IP'
});

app.post('/webhook', webhookLimiter, handleWebhook);
```

### 4. القائمة البيضاء للـ IPs

اقبل webhooks فقط من عناوين IP الرسمية لسلة وزد:

```javascript
const TRUSTED_IPS = {
  salla: [
    // أضف عناوين IP الرسمية لسلة هنا
  ],
  zid: [
    // أضف عناوين IP الرسمية لزد هنا
  ]
};

function isTrustedIP(ip) {
  return [...TRUSTED_IPS.salla, ...TRUSTED_IPS.zid]
    .some(trustedIP => ip.startsWith(trustedIP));
}
```

### 5. خاصية Idempotency

اجعل معالجات webhook idempotent للتعامل بأمان مع التسليمات المكررة:

```javascript
// استخدام معرف فريد لمنع المعالجة المكررة
const processedEvents = new Set();

async function processWebhookEvent(event) {
  const eventId = event.id || generateEventId(event);

  // تحقق مما إذا كان تمت معالجته بالفعل
  if (processedEvents.has(eventId)) {
    console.log(`الحدث ${eventId} تمت معالجته بالفعل، جاري التجاوز`);
    return;
  }

  // معالجة الحدث
  await handleEvent(event);

  // تحديد كـ تمت معالجته
  processedEvents.add(eventId);
}

// الأفضل: استخدم Redis للأنظمة الموزعة
const Redis = require('ioredis');
const redis = new Redis();

async function processWebhookEventRedis(event) {
  const eventId = event.id || generateEventId(event);
  const key = `webhook:processed:${eventId}`;

  // تحقق مما إذا كان قد تمت معالجته بالفعل
  const isNew = await redis.set(key, '1', 'NX', 'EX', 86400); // 24 ساعة

  if (!isNew) {
    return;
  }

  await handleEvent(event);
}
```

### 6. التحقق من صحة المدخلات

تحقق من صحة جميع payloads webhook الواردة:

```javascript
const Joi = require('joi');

const webhookSchema = Joi.object({
  id: Joi.string().required(),
  event: Joi.string().required(),
  data: Joi.object().required(),
  created_at: Joi.string().isoDate().required()
});

async function handleWebhook(req, res) {
  const { error, value } = webhookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: 'Payload غير صالح' });
  }

  await processWebhookEvent(value);
  res.status(200).send('OK');
}
```

### 7. إدارة الأسرار بأمان

لا تقم أبداً بتضمين أسرار webhook في الكود:

```javascript
// ملف .env (لا ترسل هذا أبداً إلى Git)
SALLA_WEBHOOK_SECRET=your_secret_here
ZID_WEBHOOK_SECRET=your_secret_here

// تحميل متغيرات البيئة
require('dotenv').config();
```

### 8. التسجيل والمراقبة

سجل جميع أنشطة webhook لتدقيق الأمان:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'webhook.log' })
  ]
});

function logWebhook(req, status, error = null) {
  logger.info({
    timestamp: new Date().toISOString(),
    ip: req.ip,
    event: req.body.event,
    status: status,
    error: error ? error.message : null
  });
}
```

## قائمة التحقق من الأمان

- [ ] تحقق من تواقيع webhook لكل طلب
- [ ] استخدم HTTPS لجميع نقاط النهاية
- [ ] نفذ تقييد المعدل
- [ ] ضع عناوين IP الرسمية لسلة/زد في القائمة البيضاء
- [ ] اجعل المعالجات idempotent
- [ ] تحقق من صحة جميع payloads
- [ ] استخدم إدارة أسرار آمنة
- [ ] سجل جميع أنشطة webhook
- [ ] قم بإعداد المراقبة والتنبيهات
- [ ] قم بتدوير أسرار webhook بانتظام
- [ ] حافظ على تحديث المكتبات
- [ ] أجرِ تدقيقات أمنية

## أخطاء الأمان الشائعة

1. **تخطي التحقق من التوقيع** - تحقق دائماً!
2. **تشفير الأسرار** - استخدم متغيرات البيئة أو مديري الأسرار
3. **عدم معالجة التكرارات** - نفذ idempotency
4. **تسجيل البيانات الحساسة** - لا تسجل أبداً تفاصيل البطاقات أو الرموز
5. **تجاهل حدود المعدل** - احم من الإساءة

---

<div align="center">

**Need security audit? Contact [Grovlix.com](https://grovlix.com)**

**تحتاج تدقيق أمني؟ تواصل مع [Grovlix.com](https://grovlix.com)**

</div>
