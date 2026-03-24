# order.updated - تحديث الطلب

## Description (الوصف)

**Arabic:** يتم إطلاق هذا الحدث عند تعديل تفاصيل الطلب الموجود، مثل تغيير المنتجات أو العنوان أو طريقة الشحن.

**English:** This event is triggered when an existing order's details are modified, such as changes to items, shipping address, or shipping method.

## When Triggered (متى يتم إطلاقه)

- عند إضافة منتجات جديدة للطلب
- عند حذف منتجات من الطلب
- عند تغيير كمية المنتجات
- عند تعديل عنوان الشحن
- عند تغيير طريقة الشحن
- عند إضافة أو تعديل ملاحظات الطلب

## Payload Schema (هيكل البيانات)

```json
{
  "event": "order.updated",
  "store_id": "123456789",
  "data": {
    "id": 12345,
    "reference": "ORD-12345",
    "status": "preparing",
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
        "quantity": 3,
        "price": 100.00,
        "total": 300.00
      }
    ],
    "shipping": {
      "method": "aramex",
      "cost": 25.00,
      "address": {
        "city": "الرياض",
        "district": "الملقا",
        "street": "اسم الشارع",
        "building": "123"
      }
    },
    "total": 325.00,
    "currency": "SAR",
    "updated_at": "2024-01-01T14:30:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T14:30:00Z"
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
    if ($payload['event'] === 'order.updated') {
        $order = $payload['data'];
        $orderId = $order['id'];
        $reference = $order['reference'];

        // معالجة تحديث الطلب
        // مقارنة بالبيانات السابقة
        // إشعار العميل بالتغييرات

        error_log("Order updated: {$reference}");
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

// معالجة حدث تحديث الطلب
async function handleOrderUpdated(order) {
    const orderId = order.id;
    const reference = order.reference;

    // الحصول على الطلب السابق من قاعدة البيانات
    const oldOrder = await getOrderFromDatabase(orderId);

    // مقارنة التغييرات
    const changes = detectOrderChanges(oldOrder, order);

    // إشعار العميل بالتغييرات
    if (changes.length > 0) {
        await notifyCustomer(order.customer.email, changes);
    }

    // تحديث قاعدة البيانات
    await updateOrderInDatabase(order);

    console.log(`Order ${reference} updated with ${changes.length} changes`);
}

function detectOrderChanges(oldOrder, newOrder) {
    const changes = [];
    // منطق مقارنة التغييرات
    return changes;
}
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
        if payload['event'] == 'order.updated':
            order = payload['data']
            order_id = order['id']
            reference = order['reference']

            # معالجة تحديث الطلب
            # مقارنة بالبيانات السابقة
            # إشعار العميل بالتغييرات

            print(f"Order updated: {reference}")

        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

- **مشكلة:** استقبال حدث `order.updated` عند تغيير الحالة فقط
  **الحل:** استخدم حدث `order.status.updated` لتتبع تغييرات الحالة بشكل منفصل

- **مشكلة:** التكرار المفرط لأحداث التحديث
  **الحل:** قم بتجميع التحديثات خلال فترة زمنية قصيرة قبل المعالجة

- **مشكلة:** صعوبة تتبع التغييرات المحددة
  **الحل:** قم بتخزين نسخة من الطلب السابق في قاعدة البيانات للمقارنة

## See Also (انظر أيضاً)

- [order.created](./order.created.md) - إنشاء طلب جديد
- [order.status.updated](./order.status.updated.md) - تحديث حالة الطلب
- [order.cancelled](./order.cancelled.md) - إلغاء الطلب
- [الموقع الرسمي](https://docs.salla.dev/merchant-api/webhooks/webhooks-store-events)

---

**Keywords:** webhook, Salla, order.updated, تحديث الطلب, Saudi Arabia, e-commerce, API, integration
**الكلمات المفتاحية:** ويب هوك, سلة, تحديث الطلب, السعودية, تجارة إلكترونية
