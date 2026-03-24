# order.status.update - تحديث حالة الطلب

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند تغيير حالة الطلب، مثل تحويله من "جديد" إلى "قيد التحضير" أو "تم التوصيل".

**English:** This event is triggered when an order's status is updated, such as changing from "new" to "preparing" or "delivered".

## When Triggered (متى يتم إطلاقه)
- عند تغيير حالة الطلب من قبل التاجر
- عند تحديث الحالة تلقائياً بواسطة النظام
- عند تغيير حالة الطلب عبر واجهة برمجة التطبيقات

## Order Status Values (قيم حالات الطلب)
| الحالة | بالعربية | الوصف |
|-------|---------|-------|
| `new` | جديد | طلب تم إنشاؤه حديثاً |
| `preparing` | قيد التحضير | الطلب قيد التجهيز |
| `ready` | جاهز | الطلب جاهز للاستلام أو التوصيل |
| `inDelivery` | قيد التوصيل | الطلب في طريقه للعميل |
| `delivered` | تم التوصيل | تم تسليم الطلب للعميل |
| `cancelled` | ملغي | تم إلغاء الطلب |

## Supported Conditions (الشروط المدعومة)
يدعم هذا الحدث إمكانية تصفية الإشعارات بناءً على شروط محددة:

| الشرط | الوصف |
|-------|-------|
| `delivery_option_id` | تصفية حسب خيار التوصيل |
| `payment_method` | تصفية حسب طريقة الدفع |
| `status` | تصفية حسب حالة الطلب الجديدة |

## Payload Schema (هيكل البيانات)
```json
{
  "event": "order.status.update",
  "data": {
    "id": 12345,
    "reference_number": "ORD-2024-001",
    "status": "preparing",
    "previous_status": "new",
    "payment_status": "paid",
    "currency": "SAR",
    "total_amount": 299.99,
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
        "price": 125.00
      }
    ],
    "shipping_address": {
      "city": "الرياض",
      "district": "النخيل",
      "street": "شارع الملك فهد"
    },
    "updated_at": "2024-03-25T11:30:00Z"
  },
  "timestamp": "2024-03-25T11:30:00Z"
}
```

## Code Examples (أمثلة البرمجة)

### PHP
```php
<?php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_ZID_SIGNATURE'] ?? '';
$secret = 'your_webhook_secret';

// التحقق من التوقيع
if (!verifyWebhookSignature($payload, $signature, $secret)) {
    http_response_code(403);
    exit('Invalid signature');
}

$data = json_decode($payload, true);

if ($data['event'] === 'order.status.update') {
    $order = $data['data'];
    $newStatus = $order['status'];
    $previousStatus = $order['previous_status'] ?? null;
    $orderId = $order['id'];
    $customerEmail = $order['customer']['email'];

    // معالجة تغيير الحالة
    switch ($newStatus) {
        case 'preparing':
            // إرسال إشعار بأن الطلب قيد التحضير
            sendPreparingNotification($customerEmail, $orderId);
            break;

        case 'inDelivery':
            // إرسال تفاصيل التتبع
            sendTrackingDetails($customerEmail, $orderId);
            break;

        case 'delivered':
            // إرسال طلب تقييم
            sendReviewRequest($customerEmail, $orderId);
            break;

        case 'cancelled':
            // معالجة الإلغاء والاسترداد
            processCancellation($orderId);
            break;
    }

    // تسجيل تغيير الحالة
    logStatusChange($orderId, $previousStatus, $newStatus);

    http_response_code(200);
    echo json_encode(['received' => true]);
}
```

### JavaScript (Node.js)
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

async function handleOrderStatusUpdate(order) {
    const { id, status, previous_status, customer } = order;

    const statusHandlers = {
        'preparing': async () => {
            await sendNotification(customer.email, {
                subject: 'طلبك قيد التحضير',
                message: `الطلب رقم ${id} قيد التحضير الآن`
            });
        },
        'ready': async () => {
            await sendNotification(customer.email, {
                subject: 'طلبك جاهز',
                message: `الطلب رقم ${id} جاهز للاستلام`
            });
        },
        'inDelivery': async () => {
            await sendTrackingLink(customer.phone, id);
        },
        'delivered': async () => {
            await sendReviewRequest(customer.email, id);
        },
        'cancelled': async () => {
            await processRefund(id);
            await sendCancellationNotice(customer.email, id);
        }
    };

    if (statusHandlers[status]) {
        await statusHandlers[status]();
    }

    // تسجيل التغيير
    await logStatusChange(id, previous_status, status);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'order.status.update') {
        // معالجة غير متزامنة
        handleOrderStatusUpdate(data.data)
            .catch(error => console.error('Error:', error));
    }

    res.status(200).json({ received: true });
});
```

### Python
```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

STATUS_HANDLERS = {
    'preparing': lambda order: send_preparing_notification(order),
    'ready': lambda order: send_ready_notification(order),
    'inDelivery': lambda order: send_tracking_details(order),
    'delivered': lambda order: send_review_request(order),
    'cancelled': lambda order: process_cancellation(order),
}

def handle_order_status_update(order):
    status = order.get('status')
    previous_status = order.get('previous_status')
    order_id = order.get('id')

    handler = STATUS_HANDLERS.get(status)
    if handler:
        handler(order)

    # تسجيل التغيير
    log_status_change(order_id, previous_status, status)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'order.status.update':
        handle_order_status_update(data.get('data', {}))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: استلام webhook للحالة نفسها
**الحل:** تحقق من `previous_status` وتأكد من أن الحالة الفعلية تغيرت قبل المعالجة.

### مشكلة: عدم وجود previous_status
**الحل:** بعض التحديثات القديمة قد لا تحتوي على هذا الحقل. تعامل معه كقيمة اختيارية.

### مشكلة: عدد كبير من التحديثات فوراً
**الحل:** استخدم queue لمعالجة التحديثات بشكل منظم وتجنب overload على النظام.

## Use Cases (حالات الاستخدام)
- إرسال إشعارات SMS/Email للعملاء عند تغيير حالة الطلب
- تحديث نظام إدارة المستودعات
- مزامنة حالة الطلب مع أنظمة الشحن الخارجية
- تشغيل عمليات تلقائية (مثل طلب التقييم عند التوصيل)
- تحليل البيانات وتتبع أداء الطلبات

## SEO Keywords
Zid webhook, order.status.update, تحديث حالة الطلب, order status webhook, زد webhook, تغيير حالة الطلب, أحداث الطلبات, حالة التوصيل
