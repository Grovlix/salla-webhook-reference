# Webhook Troubleshooting Guide

---

## English

## Common Issues and Solutions

This guide helps you diagnose and resolve common webhook integration issues with Salla and Zid platforms.

## Issue 1: Webhooks Not Being Received

### Symptoms

- Your endpoint is not receiving any webhook calls
- No logs show incoming requests

### Possible Causes & Solutions

#### 1.1 Endpoint Not Publicly Accessible

```bash
# Test if your endpoint is accessible
curl -X POST https://your-domain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Expected response: 200 OK
```

**Solution**: Use ngrok for local development:

```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com

# Start ngrok
ngrok http 3000

# Use the HTTPS URL provided by ngrok in your webhook configuration
```

#### 1.2 Firewall Blocking Requests

**Solution**: Configure your firewall to allow incoming POST requests:

```bash
# UFW (Ubuntu)
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp

# iptables
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
```

#### 1.3 SSL Certificate Issues

```bash
# Test SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check certificate validity
curl -v https://your-domain.com/webhook 2>&1 | grep -i ssl
```

**Solution**: Use valid SSL certificates from Let's Encrypt:

```bash
# Using certbot
sudo certbot --nginx -d your-domain.com
```

## Issue 2: Signature Verification Failing

### Symptoms

- All webhooks return 401 Unauthorized
- Signature mismatch errors in logs

### Possible Causes & Solutions

#### 2.1 Incorrect Secret Key

```javascript
// Debug: Print expected vs received signature
const crypto = require('crypto');

function debugSignature(payload, receivedSignature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  console.log('Expected:', expectedSignature);
  console.log('Received:', receivedSignature);
  console.log('Match:', expectedSignature === receivedSignature);
}
```

**Solution**:
1. Double-check your webhook secret in the dashboard
2. Ensure no extra whitespace in the secret
3. Verify environment variables are loaded correctly:

```javascript
console.log('Secret length:', process.env.SALLA_WEBHOOK_SECRET?.length);
console.log('Secret starts with:', process.env.SALLA_WEBHOOK_SECRET?.substring(0, 5));
```

#### 2.2 Payload Encoding Issue

```javascript
// Salla and Zid send raw JSON body
// Make sure your body parser is configured correctly

// Correct configuration
app.use(express.json({
  verify: (req, res, buf) => {
    // Store raw body for signature verification
    req.rawBody = buf.toString('utf8');
  }
}));
```

#### 2.3 Timestamp Mismatch

Some webhooks include a timestamp. Ensure your server's clock is synchronized:

```bash
# Check system time
date

# Sync with NTP
sudo ntpdate pool.ntp.org  # Linux/macOS
# or
sudo timedatectl set-ntp true  # Modern Linux
```

## Issue 3: Webhook Timeout or Slow Processing

### Symptoms

- Webhooks take too long to respond
- Platform shows timeout errors

### Solutions

#### 3.1 Respond Immediately

```javascript
// Bad: Processing takes too long
app.post('/webhook', async (req, res) => {
  await heavyProcessing(req.body);  // This might take 30+ seconds
  res.status(200).send('OK');
});

// Good: Respond immediately, process asynchronously
app.post('/webhook', async (req, res) => {
  // Verify signature first
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid');
  }

  // Queue for processing
  webhookQueue.add(req.body);

  // Respond immediately
  res.status(200).send('OK');
});
```

#### 3.2 Use a Job Queue

```javascript
// Using Bull (Redis-based queue)
const Queue = require('bull');
const webhookQueue = new Queue('webhooks', 'redis://localhost:6379');

webhookQueue.process(async (job) => {
  const event = job.data;
  await processEvent(event);
});

// Error handling and retry
webhookQueue.process(async (job) => {
  try {
    await processEvent(job.data);
  } catch (error) {
    console.error('Processing failed:', error);
    throw error; // Will trigger retry
  }
}, {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
});
```

## Issue 4: Duplicate Webhook Events

### Symptoms

- Same event processed multiple times
- Database duplicate key errors

### Solutions

#### 4.1 Implement Idempotency

```javascript
const processedEvents = new Map();

async function processWebhookEvent(event) {
  // Generate unique ID from event data
  const eventId = `${event.event}:${event.id}:${event.updated_at}`;

  // Check if already processed
  if (processedEvents.has(eventId)) {
    console.log('Duplicate event, skipping');
    return;
  }

  // Mark as processing (prevent race conditions)
  processedEvents.set(eventId, 'processing');

  try {
    await handleEvent(event);
    processedEvents.set(eventId, 'done');
  } catch (error) {
    processedEvents.delete(eventId); // Allow retry on failure
    throw error;
  }
}
```

#### 4.2 Use Database Constraints

```javascript
// Using MongoDB with unique index
await Order.updateOne(
  { id: event.data.id },
  { $set: event.data },
  { upsert: true }
);

// Using SQL with ON CONFLICT
await db.query(`
  INSERT INTO orders (id, data)
  VALUES ($1, $2)
  ON CONFLICT (id) DO UPDATE SET data = $2
`, [event.data.id, event.data]);
```

## Issue 5: Missing Event Data Fields

### Symptoms

- Expected fields are undefined
- TypeError accessing nested properties

### Solutions

#### 5.1 Check Platform Documentation

```javascript
// Always check if fields exist before accessing
function safeGet(obj, path, defaultValue = null) {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : defaultValue;
  }, obj);
}

// Usage
const customerEmail = safeGet(event, 'data.customer.email');
const customerPhone = safeGet(event, 'data.customer.phone', 'N/A');
```

#### 5.2 Validate Against Schema

```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

const schema = {
  type: 'object',
  required: ['event', 'data', 'id'],
  properties: {
    event: { type: 'string' },
    data: { type: 'object' },
    id: { type: 'string' }
  }
};

const validate = ajv.compile(schema);

function handleWebhook(payload) {
  if (!validate(payload)) {
    console.error('Invalid payload:', validate.errors);
    throw new Error('Invalid webhook payload');
  }

  // Safe to process
  processEvent(payload);
}
```

## Issue 6: Webhook Delivered in Wrong Order

### Symptoms

- Order updated before order created
- Events appear out of sequence

### Solutions

#### 6.1 Process Events by Timestamp

```javascript
// Use event timestamp for ordering
const eventQueue = [];

function addEventToQueue(event) {
  eventQueue.push({
    ...event,
    timestamp: new Date(event.created_at)
  });

  // Sort by timestamp
  eventQueue.sort((a, b) => a.timestamp - b.timestamp);
}
```

#### 6.2 Use Event Sequencing

```javascript
// Some platforms include sequence numbers
let lastProcessedSequence = 0;

async function processEvent(event) {
  const sequence = event.sequence || 0;

  if (sequence < lastProcessedSequence) {
    console.log('Old event, skipping');
    return;
  }

  await handleEvent(event);
  lastProcessedSequence = sequence;
}
```

## Debugging Tools

### Webhook Inspection Services

- **webhook.site** - Inspect webhook requests in real-time
- **RequestBin** - Collect and debug webhooks
- **ngrok** - Tunnel local server to internet

### Logging Best Practices

```javascript
// Structured logging
const pino = require('pino');
const logger = pino({
  level: 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
});

logger.info({
  event: 'webhook.received',
  eventType: req.body.event,
  eventId: req.body.id,
  ip: req.ip,
  userAgent: req.get('user-agent')
});

logger.error({
  event: 'webhook.error',
  error: error.message,
  stack: error.stack,
  webhook: req.body
});
```

### Health Check Endpoint

```javascript
// Add a health check for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Webhook-specific health check
app.get('/webhook/health', async (req, res) => {
  const queueSize = await webhookQueue.getJobCounts();
  const recentErrors = await getRecentErrors();

  res.json({
    status: 'ok',
    queueSize,
    recentErrors: recentErrors.length
  });
});
```

## Getting Help

If you're still experiencing issues:

1. **Check Platform Status**
   - Salla Status: https://status.salla.sa
   - Zid Status: Check Zid dashboard

2. **Enable Debug Logging**
   ```javascript
   app.post('/webhook', (req, res) => {
     fs.appendFileSync('webhook-debug.log', JSON.stringify({
       timestamp: new Date().toISOString(),
       headers: req.headers,
       body: req.body
     }, null, 2) + '\n');

     res.status(200).send('OK');
   });
   ```

3. **Contact Support**
   - Salla: https://support.salla.sa
   - Zid: https://support.zid.sa
   - Professional help: [Grovlix.com](https://grovlix.com)

---

## العربية

## دليل استكشاف أخطاء Webhook وإصلاحها

## المشاكل الشائعة والحلول

يساعدك هذا الدليل على تشخيص وحل مشاكل تكامل webhook الشائعة مع منصتي سلة وزد.

## المشكلة 1: عدم استلام Webhooks

### الأعراض

- نقطة النهاية الخاصة بك لا تستقبل أي استدعاءات webhook
- لا توجد سجلات تظهر طلبات واردة

### الأسباب والحلول المحتملة

#### 1.1 نقطة النهاية غير متاحة للجمهور

```bash
# اختبر ما إذا كانت نقطة النهاية الخاصة بك متاحة
curl -X POST https://your-domain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# الاستجابة المتوقعة: 200 OK
```

**الحل**: استخدم ngrok للتطوير المحلي:

```bash
# تثبيت ngrok
brew install ngrok  # macOS

# بدء ngrok
ngrok http 3000

# استخدم عنوان URL الذي توفره ngrok
```

#### 1.2 جدار الحماية يحظر الطلبات

**الحل**: قم بتكوين جدار الحماية للسماح بطلبات POST الواردة:

```bash
# UFW (Ubuntu)
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
```

#### 1.3 مشاكل شهادة SSL

```bash
# اختبار شهادة SSL
openssl s_client -connect your-domain.com:443
```

**الحل**: استخدم شهادات SSL صالحة من Let's Encrypt:

```bash
sudo certbot --nginx -d your-domain.com
```

## المشكلة 2: فشل التحقق من التوقيع

### الأعراض

- جميع webhooks تعرض 401 Unauthorized
- أخطاء عدم تطابق التوقيع في السجلات

### الحلول

#### 2.1 مفتاح سري غير صحيح

```javascript
// التصحيح: طباعة التوقيع المتوقع والمستلم
function debugSignature(payload, receivedSignature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  console.log('المتوقع:', expectedSignature);
  console.log('المستلم:', receivedSignature);
}
```

**الحل**:
1. تحقق من مفتاح webhook السري في لوحة التحكم
2. تأكد من عدم وجود مسافات إضافية
3. تحقق من تحميل متغيرات البيئة بشكل صحيح

#### 2.2 مشكلة في ترميز Payload

```javascript
// سلة وزد ترسل نص JSON الخام
// تأكد من أن محلل الجسم الخاص بك مهيأ بشكل صحيح

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString('utf8');
  }
}));
```

## المشكلة 3: مهلة Webhook أو المعالجة البطيئة

### الأعراض

- يستغرق webhooks وقتًا طويلاً للرد
- تظهر أخطاء المهلة على المنصة

### الحلول

#### 3.1 استجب فوراً

```javascript
// سيء: المعالجة تستغرق وقتًا طويلاً
app.post('/webhook', async (req, res) => {
  await heavyProcessing(req.body);
  res.status(200).send('OK');
});

// جيد: استجب فوراً، عالج بشكل غير متزامن
app.post('/webhook', async (req, res) => {
  webhookQueue.add(req.body);
  res.status(200).send('OK');
});
```

## المشكلة 4: أحداث Webhook المكررة

### الأعراض

- معالجة نفس الحدث عدة مرات
- أخطاء مفتاح مكرر في قاعدة البيانات

### الحلول

#### 4.1 نفذ Idempotency

```javascript
const processedEvents = new Map();

async function processWebhookEvent(event) {
  const eventId = `${event.event}:${event.id}`;

  if (processedEvents.has(eventId)) {
    console.log('حدث مكرر، جاري التجاوز');
    return;
  }

  await handleEvent(event);
  processedEvents.set(eventId, 'done');
}
```

#### 4.2 استخدم قيود قاعدة البيانات

```javascript
// باستخدام MongoDB مع فهرس فريد
await Order.updateOne(
  { id: event.data.id },
  { $set: event.data },
  { upsert: true }
);
```

## أدوات التصحيح

### خدمات فحص Webhook

- **webhook.site** - فحص طلبات webhook في الوقت الفعلي
- **ngrok** - نفق الخادم المحلي إلى الإنترنت

### أفضل ممارسات التسجيل

```javascript
// التسجيل الهيكلي
const logger = pino({
  level: 'info'
});

logger.info({
  event: 'webhook.received',
  eventType: req.body.event,
  eventId: req.body.id,
  ip: req.ip
});
```

### نقطة نهاية فحص الصحة

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## الحصول على المساعدة

إذا كنت لا تزال تواجه مشاكل:

1. **تحقق من حالة المنصة**
   - سلة: https://status.salla.sa
   - زد: لوحة تحكم زد

2. **فعّل تسجيل التصحيح**
   ```javascript
   app.post('/webhook', (req, res) => {
     fs.appendFileSync('webhook-debug.log', JSON.stringify({
       timestamp: new Date().toISOString(),
       body: req.body
     }, null, 2) + '\n');

     res.status(200).send('OK');
   });
   ```

3. **تواصل مع الدعم**
   - سلة: https://support.salla.sa
   - زد: https://support.zid.sa
   - مساعدة احترافية: [Grovlix.com](https://grovlix.com)

---

<div align="center">

**Need integration support? Contact [Grovlix.com](https://grovlix.com)**

**تحتاج دعم التكامل؟ تواصل مع [Grovlix.com](https://grovlix.com)**

</div>
