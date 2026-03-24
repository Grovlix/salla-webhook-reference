# Getting Started with Salla & Zid Webhooks

---

## English

## Introduction

Webhooks are a powerful way to integrate your applications with Salla and Zid e-commerce platforms. They allow your application to receive real-time notifications when events occur on the platform, such as new orders, product updates, or customer changes.

## What is a Webhook?

A webhook is an HTTP callback that sends data to your application when a specific event occurs. Instead of your application repeatedly asking the platform "are there any new events?", the platform proactively sends the event data to a URL you specify.

## Benefits of Using Webhooks

- **Real-time updates** - Receive notifications instantly when events occur
- **Reduced API calls** - No need to poll the API continuously
- **Better performance** - Process events asynchronously
- **Improved user experience** - Respond to customer actions immediately

## Setting Up Your First Webhook

### 1. Create an Endpoint

First, create an HTTP endpoint on your server that can receive POST requests:

```javascript
// Node.js / Express example
app.post('/webhook', (req, res) => {
  const event = req.body;

  console.log('Received webhook:', event);

  // Process the event
  switch(event.event) {
    case 'order.created':
      handleNewOrder(event.data);
      break;
    case 'order.updated':
      handleUpdatedOrder(event.data);
      break;
    // Handle more events...
  }

  // Always respond with 200 OK
  res.status(200).send('OK');
});
```

```php
// PHP example
<?php
$json = file_get_contents('php://input');
$event = json_decode($json, true);

switch($event['event']) {
    case 'order.created':
        handleNewOrder($event['data']);
        break;
    case 'order.updated':
        handleUpdatedOrder($event['data']);
        break;
}

http_response_code(200);
echo 'OK';
?>
```

### 2. Register Your Webhook

#### Salla

1. Go to your Salla dashboard
2. Navigate to Settings > Developers
3. Click "Add Webhook"
4. Enter your endpoint URL
5. Select the events you want to subscribe to
6. Save your webhook secret

#### Zid

1. Go to your Zid dashboard
2. Navigate to Settings > API & Webhooks
3. Click "Add New Webhook"
4. Enter your endpoint URL
5. Configure event subscriptions
6. Save your webhook authentication key

### 3. Verify Webhook Signatures (Important!)

Always verify that webhooks are genuinely from Salla or Zid:

```javascript
// Verify Salla webhook signature
const crypto = require('crypto');

function verifySallaSignature(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hmac)
  );
}

// Usage
const isValid = verifySallaSignature(
  req.body,
  req.headers['x-salla-signature'],
  process.env.SALLA_WEBHOOK_SECRET
);

if (!isValid) {
  return res.status(401).send('Invalid signature');
}
```

### 4. Handle Events Reliably

- **Respond quickly** - Send a 200 OK response before processing
- **Use queues** - Process heavy tasks asynchronously
- **Implement retries** - Handle temporary failures gracefully
- **Log everything** - Keep detailed logs for debugging

```javascript
// Better approach with queue
app.post('/webhook', async (req, res) => {
  const event = req.body;

  // Verify signature
  if (!verifySignature(event)) {
    return res.status(401).send('Invalid signature');
  }

  // Add to queue for processing
  await webhookQueue.add(event);

  // Respond immediately
  res.status(200).send('OK');
});

// Process in background
webhookQueue.process(async (job) => {
  const event = job.data;
  await processEvent(event);
});
```

## Common Webhook Events

### Order Events

| Event | Description | متى يحدث |
|-------|-------------|----------|
| `order.created` | New order placed | عند إنشاء طلب جديد |
| `order.updated` | Order details changed | عند تحديث تفاصيل الطلب |
| `order.status.updated` | Order status changed | عند تغيير حالة الطلب |
| `order.paid` | Order payment completed | عند اكتمال دفع الطلب |

### Product Events

| Event | Description | متى يحدث |
|-------|-------------|----------|
| `product.created` | New product added | عند إضافة منتج جديد |
| `product.updated` | Product details changed | عند تحديث تفاصيل المنتج |
| `product.deleted` | Product removed | عند حذف المنتج |

### Customer Events

| Event | Description | متى يحدث |
|-------|-------------|----------|
| `customer.created` | New customer registered | عند تسجيل عميل جديد |
| `customer.updated` | Customer details changed | عند تحديث بيانات العميل |

## Testing Your Webhook

Use these tools to test your webhook locally:

- **ngrok** - Expose local server to the internet
- **webhook.site** - Inspect webhook requests
- **Postman** - Simulate webhook calls

```bash
# Example using ngrok
ngrok http 3000

# Now use the ngrok URL in your webhook configuration
# https://abc123.ngrok.io/webhook
```

## Best Practices

1. **Always verify signatures** - Prevent fake webhooks
2. **Use HTTPS** - Encrypt data in transit
3. **Handle duplicate events** - Webhooks may be sent twice
4. **Implement idempotency** - Make operations safe to retry
5. **Monitor failures** - Set up alerts for webhook errors
6. **Keep secrets secure** - Use environment variables
7. **Log all events** - Essential for debugging

## Next Steps

- Read [Webhook Security Guide](./webhook-security.md)
- Learn about [Troubleshooting](./troubleshooting.md)
- Explore [Salla Events](../docs/salla/)
- Explore [Zid Events](../docs/zid/)

---

## العربية

## مقدمة

الـ Webhooks هي طريقة قوية لدمج تطبيقاتك مع منصتي سلة وزد للتجارة الإلكترونية. تتيح لتطبيقك استلام إشعارات فورية عند حدوث أحداث على المنصة، مثل الطلبات الجديدة أو تحديثات المنتجات أو تغييرات العملاء.

## ما هو الـ Webhook؟

الـ Webhook هو استدعاء HTTP يرسل البيانات إلى تطبيقك عند حدوث حدث معين. بدلاً من أن يسأل تطبيقك المنصة بشكل متكرر "هل هناك أحداث جديدة؟"، تقوم المنصة بإرسال بيانات الحدث بشكل استباقي إلى عنوان URL تحدده.

## فوائد استخدام Webhooks

- **تحديثات فورية** - استلم الإشعارات فور حدوثها
- **تقليل استدعاءات API** - لا حاجة للتحقق المستمر من API
- **أداء أفضل** - معالجة الأحداث بشكل غير متزامن
- **تحسين تجربة المستخدم** - الاستجابة الفورية لجميع إجراءات العملاء

## إعداد أول Webhook لك

### 1. إنشاء Endpoint

أنشئ أولاً نقطة نهاية HTTP على خادمك يمكنها استلام طلبات POST:

```javascript
// مثال Node.js / Express
app.post('/webhook', (req, res) => {
  const event = req.body;

  console.log('تم استلام webhook:', event);

  // معالجة الحدث
  switch(event.event) {
    case 'order.created':
      handleNewOrder(event.data);
      break;
    case 'order.updated':
      handleUpdatedOrder(event.data);
      break;
    // معالجة المزيد من الأحداث...
  }

  // دائماً استجب بـ 200 OK
  res.status(200).send('OK');
});
```

### 2. تسجيل Webhook الخاص بك

#### سلة

1. اذهب إلى لوحة تحكم سلة
2. انتقل إلى الإعدادات > المطورون
3. انقر "إضافة Webhook"
4. أدخل عنوان URL الخاص بنقطة النهاية الخاصة بك
5. اختر الأحداث التي تريد الاشتراك فيها
6. احفظ مفتاح webhook السري الخاص بك

#### زد

1. اذهب إلى لوحة تحكم زد
2. انتقل إلى الإعدادات > API و Webhooks
3. انقر "إضافة Webhook جديد"
4. أدخل عنوان URL الخاص بنقطة النهاية الخاصة بك
5. قم بإعداد اشتراكات الأحداث
6. احفظ مفتاح مصادقة webhook

### 3. التحقق من توقيعات Webhook (مهم!)

تحقق دائماً من أن webhooks تأتي فعلاً من سلة أو زد:

```javascript
// التحقق من توقيع webhook سلة
const crypto = require('crypto');

function verifySallaSignature(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hmac)
  );
}

// الاستخدام
const isValid = verifySallaSignature(
  req.body,
  req.headers['x-salla-signature'],
  process.env.SALLA_WEBHOOK_SECRET
);

if (!isValid) {
  return res.status(401).send('توقيع غير صالح');
}
```

### 4. معالجة الأحداث بشكل موثوق

- **استجب بسرعة** - أرسل استجابة 200 OK قبل المعالجة
- **استخدم الطوابير** - عالج المهام الثقيلة بشكل غير متزامن
- **نفذ إعادة المحاولة** - تعامل مع الفشل المؤقت بشكل أنيق
- **سجل كل شيء** - احتفظ بسجلات مفصلة لتصحيح الأخطاء

## أحداث Webhook الشائعة

### أحداث الطلبات

| الحدث | الوصف |
|-------|-------------|
| `order.created` | طلب جديد |
| `order.updated` | تحديث الطلب |
| `order.status.updated` | تغيير حالة الطلب |
| `order.paid` | اكتمال دفع الطلب |

### أحداث المنتجات

| الحدث | الوصف |
|-------|-------------|
| `product.created` | منتج جديد |
| `product.updated` | تحديث المنتج |
| `product.deleted` | حذف المنتج |

### أحداث العملاء

| الحدث | الوصف |
|-------|-------------|
| `customer.created` | عميل جديد |
| `customer.updated` | تحديث العميل |

## اختبار Webhook

استخدم هذه الأدوات لاختبار webhook محلياً:

- **ngrok** - تعريض الخادم المحلي للإنترنت
- **webhook.site** - فحص طلبات webhook
- **Postman** - محاكاة استدعاءات webhook

```bash
# مثال باستخدام ngrok
ngrok http 3000

# الآن استخدم عنوان ngrok في إعداد webhook
# https://abc123.ngrok.io/webhook
```

## أفضل الممارسات

1. **تحقق دائماً من التوقيعات** - منع webhooks مزيفة
2. **استخدم HTTPS** - تشفير البيانات أثناء النقل
3. **تعامل مع الأحداث المكررة** - قد يتم إرسال webhooks مرتين
4. **نفذ خاصية Idempotency** - اجعل العمليات آمنة لإعادة المحاولة
5. **راقب الفشل** - قم بإعداد تنبيهات لأخطاء webhook
6. **احتفظ بالأسرار بأمان** - استخدم متغيرات البيئة
7. **سجل جميع الأحداث** - ضروري لتصحيح الأخطاء

## الخطوات التالية

- اقرأ [دليل أمان Webhook](./webhook-security.md)
- تعرف على [استكشاف الأخطاء](./troubleshooting.md)
- استكشف [أحداث سلة](../docs/salla/)
- استكشف [أحداث زد](../docs/zid/)

---

<div align="center">

**Need integration help? Visit [Grovlix.com](https://grovlix.com)**

**تحتاج مساعدة في التكامل؟ زر [Grovlix.com](https://grovlix.com)**

</div>
