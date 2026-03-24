# order.created - طلب جديد

## Description (الوصف)

**Arabic:** يتم إطلاق هذا الحدث عند إنشاء طلب جديد في المتجر، أي عندما يكمل العميل عملية الدفع بنجاح.

**English:** This event is triggered when a new order is created in the store, i.e., when a customer completes the checkout process successfully.

## When Triggered (متى يتم إطلاقه)

- عندما يكمل العميل عملية الدفع بنجاح
- عندما يتم تأكيد الطلب من قبل العميل
- عند إنشاء طلب جديد بأي حالة (جديد، قيد المعالجة، إلخ)

## Payload Schema (هيكل البيانات)

```json
{
  "event": "order.created",
  "store_id": "123456789",
  "data": {
    "id": 12345,
    "reference": "ORD-12345",
    "status": "new",
    "payment_status": "paid",
    "customer": {
      "id": 98765,
      "name": "اسم العميل",
      "email": "customer@example.com",
      "phone": "+966500000000"
    },
    "items": [
      {
        "id": 111,
        "product_id": 222,
        "name": "اسم المنتج",
        "quantity": 2,
        "price": 100.00,
        "total": 200.00
      }
    ],
    "total": 200.00,
    "currency": "SAR",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

## PHP Example

```php
<?php
// التحقق من توقيع Webhook
function verifySallaWebhook($payload, $signature, $secret) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($expectedSignature, $signature);
}

// استقبال البيانات
$payload = json_decode(file_get_contents('php://input'), true);
$signature = $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '';
$secret = 'your-webhook-secret';

if (verifySallaWebhook($payload, $signature, $secret)) {
    if ($payload['event'] === 'order.created') {
        $order = $payload['data'];
        $orderId = $order['id'];
        $customerName = $order['customer']['name'];
        $total = $order['total'];

        // معالجة الطلب الجديد
        // إرسال إيميل ترحيبي
        // تحديث المخزون
        // إرسال إشعار للإدارة

        error_log("Order created: {$orderId} for {$customerName}");
    }
    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}
?>
```

## JavaScript Example

```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

// التحقق من توقيع Webhook
function verifySallaWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    const expectedSignature = `sha256=${digest}`;

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

app.use(express.raw({ type: 'application/json' }));

app.post('/webhooks/salla', (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = 'your-webhook-secret';
    const payload = JSON.parse(req.body);

    if (verifySallaWebhook(payload, signature, secret)) {
        if (payload.event === 'order.created') {
            const order = payload.data;
            const orderId = order.id;
            const customerName = order.customer.name;
            const total = order.total;

            // معالجة الطلب الجديد
            console.log(`Order created: ${orderId} for ${customerName}`);

            // مثال: إرسال إيميل ترحيبي
            // sendWelcomeEmail(order.customer.email, order);
        }

        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

## Python Example

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

# التحقق من توقيع Webhook
def verify_salla_webhook(payload, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

@app.route('/webhooks/salla', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload['event'] == 'order.created':
            order = payload['data']
            order_id = order['id']
            customer_name = order['customer']['name']
            total = order['total']

            # معالجة الطلب الجديد
            print(f"Order created: {order_id} for {customer_name}")

            # مثال: تحديث قاعدة البيانات
            # update_database(order)

        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

- **مشكلة:** تلقي نفس الطلب أكثر من مرة
  **الحل:** استخدم معرف `X-Salla-Delivery` للتأكد من عدم معالجة الطلب نفسه أكثر من مرة (Idempotency)

- **مشكلة:** فشل التحقق من التوقيع
  **الحل:** تأكد من استخدام نفس `secret` وأنك تقوم بتحويل الـ payload إلى JSON بنفس الطريقة

- **مشكلة:** عدم استقبال جميع الطلبات
  **الحل:** تأكد من أن خادمك يستجيب بـ HTTP 200 بسرعة، وقم بمعالجة البيانات بشكل غير متزامن

- **مشكلة:** البيانات مفقودة أو غير كاملة
  **الحل:** تحقق من هيكل البيانات باستخدام `var_dump` أو `console.log` قبل المعالجة

## See Also (انظر أيضاً)

- [order.updated](./order.updated.md) - تحديث الطلب
- [order.status.updated](./order.status.updated.md) - تغيير حالة الطلب
- [payment.paid](../payment/payment.paid.md) - دفع ناجح
- [الموقع الرسمي](https://docs.salla.dev/merchant-api/webhooks/webhooks-store-events)

---

**Keywords:** webhook, Salla, order.created, طلب جديد, Saudi Arabia, e-commerce, API, integration, order management
**الكلمات المفتاحية:** ويب هوك, سلة, طلب جديد, السعودية, تجارة إلكترونية, إدارة الطلبات
