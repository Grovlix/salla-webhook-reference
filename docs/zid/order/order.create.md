# order.create - إنشاء طلب جديد

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند إنشاء طلب جديد في المتجر، وذلك عندما يقوم العميل بإتمام عملية الشراء والدفع بنجاح.

**English:** This event is triggered when a new order is created in the store, after a customer completes the checkout process successfully.

## When Triggered (متى يتم إطلاقه)
- عند إتمام العميل عملية الشراء وإتمام الدفع
- عند إنشاء طلب جديد من خلال لوحة تحكم التاجر
- عند إنشاء طلب عبر واجهة برمجة التطبيقات

## Supported Conditions (الشروط المدعومة)
يدعم هذا الحدث إمكانية تصفية الإشعارات بناءً على شروط محددة:

| الشرط | الوصف |
|-------|-------|
| `delivery_option_id` | تصفية حسب خيار التوصيل |
| `payment_method` | تصفية حسب طريقة الدفع |
| `status` | تصفية حسب حالة الطلب |

## Payload Schema (هيكل البيانات)
```json
{
  "event": "order.create",
  "data": {
    "id": 12345,
    "reference_number": "ORD-2024-001",
    "status": "new",
    "payment_status": "paid",
    "currency": "SAR",
    "total_amount": 299.99,
    "subtotal": 250.00,
    "shipping_amount": 49.99,
    "discount_amount": 0.00,
    "tax_amount": 0.00,
    "customer": {
      "id": 5678,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+966501234567"
    },
    "items": [
      {
        "id": 890,
        "name": "منتج تجريبي",
        "quantity": 2,
        "price": 125.00,
        "total": 250.00
      }
    ],
    "shipping_address": {
      "city": "الرياض",
      "district": "النخيل",
      "street": "شارع الملك فهد",
      "postcode": "12345"
    },
    "payment_method": "Credit Card",
    "delivery_option": {
      "id": 55,
      "name": "توصيل سريع"
    },
    "created_at": "2024-03-25T10:30:00Z",
    "updated_at": "2024-03-25T10:30:00Z"
  },
  "timestamp": "2024-03-25T10:30:00Z"
}
```

## Code Examples (أمثلة البرمجة)

### PHP
```php
<?php
// التحقق من توقيع الـ webhook
function verifyWebhookSignature($payload, $signature, $secret) {
    $expectedSignature = hash_hmac('sha256', $payload, $secret);
    return hash_equals($expectedSignature, $signature);
}

// استقبال الـ webhook
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_ZID_SIGNATURE'] ?? '';
$secret = 'your_webhook_secret';

if (!verifyWebhookSignature($payload, $signature, $secret)) {
    http_response_code(403);
    exit('Invalid signature');
}

$data = json_decode($payload, true);

if ($data['event'] === 'order.create') {
    $order = $data['data'];

    // معالجة الطلب الجديد
    $orderId = $order['id'];
    $customerEmail = $order['customer']['email'];
    $totalAmount = $order['total_amount'];

    // إرسال تأكيد بالبريد الإلكتروني
    // تحديث قاعدة البيانات
    // أو إرسال الطلب إلى نظام خارجي

    // التخزين لتجنب التكرار
    $processedId = storeProcessedOrder($orderId);

    if ($processedId) {
        http_response_code(200);
        echo json_encode(['received' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to process order']);
    }
}
```

### JavaScript (Node.js)
```javascript
const crypto = require('crypto');
const express = require('express');
const app = express();

// التحقق من توقيع الـ webhook
function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

app.post('/webhooks/zid', express.raw({type: 'application/json'}), (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'order.create') {
        const order = data.data;

        // معالجة الطلب الجديد
        const orderId = order.id;
        const customerEmail = order.customer.email;
        const totalAmount = order.total_amount;

        // معالجة غير متزامنة لتجنب timeout
        processOrderAsync(order)
            .then(() => {
                res.status(200).json({ received: true });
            })
            .catch((error) => {
                console.error('Error processing order:', error);
                res.status(500).json({ error: 'Processing failed' });
            });
    } else {
        res.status(200).json({ received: true });
    }
});

app.listen(3000);
```

### Python
```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'order.create':
        order = data.get('data', {})

        # معالجة الطلب الجديد
        order_id = order.get('id')
        customer_email = order.get('customer', {}).get('email')
        total_amount = order.get('total_amount')

        # معالجة الطلب
        # إرسال تأكيد
        # تحديث النظام

        return jsonify({'received': True}), 200

    return jsonify({'received': True}), 200

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### مشكلة: استلام نفس الطلب عدة مرات
**الحل:** استخدم `order.id` كـ unique identifier في قاعدة البيانات. تحقق من وجود الطلب قبل معالجته.

### مشكلة: timeout عند معالجة الطلب
**الحل:** قم بإرجاع استجابة 200 فوراً وقم بمعالجة الطلب بشكل غير متزامن (async) في الخلفية.

### مشكلة: العملات المختلفة
**الحل:** تحقق من حقل `currency` في الطلب وقم بتحويل المبالغ حسب الحاجة باستخدام سعر التحويل المرفق.

### مشكلة: فشل التحقق من التوقيع
**الحل:** تأكد من:
- استخدام نفس `webhook_secret` المقدم من Zid
- معالجة الـ payload كـ نص خام (raw string) دون تعديل
- استخدام خوارزمية HMAC-SHA256

## Best Practices (أفضل الممارسات)
- استخدم idempotency keys لتجنب المعالجة المزدوجة
- احتفظ بسجل لجميع الطلبات المستلمة لغرض المراجعة
- قم بمعالجة الأخطاء بشكل مناسب وسجلها
- استخدم retry mechanism لعمليات الفشل الخارجية
- تأكد من أن نقطة النهاية (endpoint) تستجيب بسرعة (أقل من 30 ثانية)

## SEO Keywords
Zid webhook, order.create, زد webhook, إنشاء طلب, order created webhook, أحداث الطلبات, Zid API, webhook متجر زد, طلب جديد, إشعار طلب
