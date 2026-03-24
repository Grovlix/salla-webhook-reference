# order.status.updated - تغيير حالة الطلب

## Description (الوصف)

**Arabic:** يتم إطلاق هذا الحدث عند تغيير حالة الطلب، مثل الانتقال من "جديد" إلى "قيد التحضير" أو "تم التوصيل".

**English:** This event is triggered when the order status changes, such as moving from "new" to "preparing" or "delivered".

## When Triggered (متى يتم إطلاقه)

- عند تغيير حالة الطلب إلى أي من الحالات المتاحة
- عند تحديث حالة الطلب يدوياً من قبل التاجر
- عند تغيير الحالة تلقائياً حسب سير العمل

## Order Status Values (قيم حالات الطلب)

| الحالة | Status Key | الوصف |
|-------|------------|-------|
| جديد | `new` | الطلب تم إنشاؤه حديثاً |
| قيد التحضير | `preparing` | الطلب جاري تحضيره |
| جاهز | `ready` | الطلب جاهز للاستلام أو الشحن |
| قيد التوصيل | `in_delivery` | الطلب في طريقه للعميل |
| تم التوصيل | `delivered` | تم توصيل الطلب بنجاح |
| ملغي | `cancelled` | تم إلغاء الطلب |
| مسترجع | `returned` | تم استرجاع الطلب |
| فشل | `failed` | فشل إتمام الطلب |

## Payload Schema (هيكل البيانات)

```json
{
  "event": "order.status.updated",
  "store_id": "123456789",
  "data": {
    "id": 12345,
    "reference": "ORD-12345",
    "status": "in_delivery",
    "previous_status": "preparing",
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
        "quantity": 2
      }
    ],
    "total": 200.00,
    "currency": "SAR",
    "updated_at": "2024-01-01T15:00:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T15:00:00Z"
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

// معالجة تغيير حالة الطلب
function handleOrderStatusUpdate($order) {
    $status = $order['status'];
    $customerEmail = $order['customer']['email'];
    $customerPhone = $order['customer']['phone'];

    switch ($status) {
        case 'preparing':
            // إرسال إشعار بدء التحضير
            sendEmail($customerEmail, 'طلبك قيد التحضير', 'preparing-template');
            break;

        case 'in_delivery':
            // إرسال إشعار الشحن مع رقم التتبع
            sendWhatsAppMessage($customerPhone, 'طلبك في الطريق إليك!');
            break;

        case 'delivered':
            // طلب تقييم من العميل
            sendReviewRequest($customerEmail, $order['id']);
            break;

        case 'cancelled':
            // معالجة الإلغاء والاسترداد
            processCancellation($order['id']);
            break;
    }
}

// استقبال البيانات
$payload = json_decode(file_get_contents('php://input'), true);
$signature = $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '';
$secret = 'your-webhook-secret';

if (verifySallaWebhook($payload, $signature, $secret)) {
    if ($payload['event'] === 'order.status.updated') {
        handleOrderStatusUpdate($payload['data']);
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

// معالجة تغيير حالة الطلب
async function handleOrderStatusUpdate(order) {
    const { status, previous_status, customer } = order;

    const statusHandlers = {
        'preparing': async () => {
            await sendEmail(customer.email, 'preparing', order);
        },
        'in_delivery': async () => {
            await sendSMS(customer.phone, `Order ${order.reference} is out for delivery`);
        },
        'delivered': async () => {
            await sendReviewRequest(customer.email, order.id);
        },
        'cancelled': async () => {
            await processRefund(order.id);
        }
    };

    if (statusHandlers[status]) {
        await statusHandlers[status]();
    }

    console.log(`Order ${order.reference} status: ${previous_status} -> ${status}`);
}

// مثال على خادم Express
app.post('/webhooks/salla', (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const payload = req.body;

    if (verifySallaWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
        if (payload.event === 'order.status.updated') {
            handleOrderStatusUpdate(payload.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
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

# معالجة تغيير حالة الطلب
def handle_order_status_update(order):
    status = order['status']
    previous_status = order.get('previous_status', 'unknown')
    customer = order['customer']

    status_handlers = {
        'preparing': lambda: send_preparing_notification(customer, order),
        'in_delivery': lambda: send_delivery_notification(customer, order),
        'delivered': lambda: send_delivery_confirmation(customer, order),
        'cancelled': lambda: process_cancellation(order),
        'returned': lambda: process_return(order),
    }

    handler = status_handlers.get(status)
    if handler:
        handler()

    print(f"Order {order['reference']} status: {previous_status} -> {status}")

@app.route('/webhooks/salla', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload['event'] == 'order.status.updated':
            handle_order_status_update(payload['data'])
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

- **مشكلة:** عدم معرفة الحالة السابقة
  **الحل:** في بعض الإصدارات، قد لا يتم إرسال `previous_status`. قم بتخزين الحالة الحالية في قاعدة البيانات للمقارنة

- **مشكلة:** استقبال أحداث متعددة لنفس التغيير
  **الحل:** استخدم معرف `X-Salla-Delivery` لمنع المعالجة المكررة

- **مشكلة:** عدم تلقي إشعارات لبعض الحالات
  **الحل:** تأكد من الاشتراك في حدث `order.status.updated` بشكل صحيح في لوحة تحكم سلة

## Conditional Webhook Usage (استخدام الخطافات المشروطة)

يمكنك استخدام الـ Conditional Webhooks لاستقبال أحداث لحالات معينة فقط:

```json
{
  "url": "https://your-app.com/webhooks/salla",
  "event": "order.status.updated",
  "conditions": {
    "status": ["delivered", "cancelled"]
  }
}
```

هذا سيضمن استقبال الأحداث فقط عند تغيير الحالة إلى "تم التوصيل" أو "ملغي".

## See Also (انظر أيضاً)

- [order.created](./order.created.md) - إنشاء طلب جديد
- [order.updated](./order.updated.md) - تحديث تفاصيل الطلب
- [order.cancelled](./order.cancelled.md) - إلغاء الطلب
- [order.returned](./order.returned.md) - استرجاع الطلب
- [الموقع الرسمي](https://docs.salla.dev/merchant-api/webhooks/conditional-webhooks)

---

**Keywords:** webhook, Salla, order.status.updated, تغيير حالة الطلب, Saudi Arabia, e-commerce, API, integration
**الكلمات المفتاحية:** ويب هوك, سلة, تغيير حالة الطلب, السعودية, تجارة إلكترونية
