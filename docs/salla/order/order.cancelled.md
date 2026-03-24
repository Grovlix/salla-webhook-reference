# order.cancelled - إلغاء طلب

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إلغاء طلب، إما من قبل العميل أو التاجر. يحتوي هذا الحدث على تفاصيل الطلب الملغي وسبب الإلغاء.

**English:** This event is triggered when an order is cancelled, either by the customer or the merchant. This event contains details of the cancelled order and cancellation reason.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عندما يقوم العميل بإلغاء الطلب قبل الشحن
- **English:** When the customer cancels the order before shipping
- **العربية:** عند إلغاء الطلب من قبل التاجر
- **English:** When the merchant cancels the order
- **العربية:** عند إلغاء الطلب تلقائياً بسبب عدم الدفع
- **English:** When the order is automatically cancelled due to non-payment
- **العربية:** عند انتهاء مهلة الدفع
- **English:** When the payment timeout expires

## Payload Schema (هيكل البيانات)

```json
{
  "event": "order.cancelled",
  "store_id": "123456789",
  "data": {
    "id": 12345,
    "reference": "ORD-12345",
    "status": "cancelled",
    "previous_status": "new",
    "payment_status": "pending",
    "cancelled_by": "customer",
    "cancellation_reason": "لم يعد العميل يريد المنتج",
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
    "subtotal": 200.00,
    "currency": "SAR",
    "notes": "ألغى العميل الطلب",
    "cancelled_at": "2024-01-02T10:00:00Z",
    "updated_at": "2024-01-02T10:00:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-02T10:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `cancelled_by` | String | من قام بالإلغاء (customer, merchant, system) |
| `cancellation_reason` | String | سبب الإلغاء |
| `cancelled_at` | DateTime | تاريخ ووقت الإلغاء |
| `previous_status` | String | الحالة السابقة قبل الإلغاء |

## Cancellation Reasons (أسباب الإلغاء)

| Reason (السبب) | Description (الوصف) |
|----------------|---------------------|
| `طلب العميل` | Customer request |
| `نفاد المخزون` | Out of stock |
| `عدم إمكانية التواصل` | Unable to contact customer |
| `عنوان غير صحيح` | Invalid address |
| `طلب مكرر` | Duplicate order |
| `أخرى` | Other |

## Code Examples

### PHP

```php
<?php
function verifySallaWebhook($payload, $signature, $secret) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($expectedSignature, $signature);
}

$payload = json_decode(file_get_contents('php://input'), true);
$signature = $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '';
$secret = 'your-webhook-secret';

if (verifySallaWebhook($payload, $signature, $secret)) {
    if ($payload['event'] === 'order.cancelled') {
        $order = $payload['data'];
        $cancelledBy = $order['cancelled_by'];
        $reason = $order['cancellation_reason'];

        // معالجة إلغاء الطلب
        switch ($cancelledBy) {
            case 'customer':
                // إلغاء من العميل
                handleCustomerCancellation($order);
                break;

            case 'merchant':
                // إلغاء من التاجر
                handleMerchantCancellation($order);
                break;

            case 'system':
                // إلغاء تلقائي من النظام
                handleSystemCancellation($order);
                break;
        }

        // استعادة المخزون إذا لزم الأمر
        if (shouldRestoreStock($order)) {
            foreach ($order['items'] as $item) {
                restoreProductStock($item['product_id'], $item['quantity']);
            }
        }

        // إرسال إشعار الإلغاء
        sendCancellationNotification($order['customer']['email'], $order);

        // تحديث التحليلات
        trackCancellation($order);

        error_log("Order cancelled: {$order['reference']} by {$cancelledBy} - {$reason}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function shouldRestoreStock($order) {
    // استعادة المخزون فقط إذا لم يتم الشحن
    return in_array($order['previous_status'], ['new', 'pending']);
}
?>
```

### JavaScript (Node.js)

```javascript
const crypto = require('crypto');

function verifySallaWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    const expectedSignature = `sha256=${digest}`;
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

async function handleOrderCancelled(order) {
    const { cancelled_by, cancellation_reason, previous_status, customer } = order;

    // معالجة الإلغاء
    const actions = [];

    // استعادة المخزون
    const shouldRestore = ['new', 'pending'].includes(previous_status);
    if (shouldRestore) {
        for (const item of order.items) {
            await updateProductStock(item.product_id, item.quantity, 'add');
        }
        actions.push('inventory_restored');
    }

    // إرسال إشعار للعميل
    await sendCancellationEmail(customer.email, {
        orderReference: order.reference,
        reason: cancellation_reason,
        cancelledBy: cancelled_by
    });
    actions.push('customer_notified');

    // إلغاء أي شحنة قيد التجهيز
    if (previous_status === 'preparing') {
        await cancelShipment(order.id);
        actions.push('shipment_cancelled');
    }

    // تحديث التحليلات
    await analytics.track('order_cancelled', {
        order_id: order.id,
        reason: cancellation_reason,
        cancelled_by: cancelled_by,
        previous_status: previous_status
    });

    console.log(`Order ${order.reference} cancelled: ${actions.join(', ')}`);
}

// Express.js endpoint
app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'order.cancelled') {
            await handleOrderCancelled(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

### Python (Flask)

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_salla_webhook(payload, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

def handle_order_cancelled(order):
    cancelled_by = order.get('cancelled_by')
    reason = order.get('cancellation_reason')
    previous_status = order.get('previous_status')
    customer = order.get('customer', {})

    # معالجة الإلغاء
    # استعادة المخزون
    if previous_status in ['new', 'pending']:
        for item in order.get('items', []):
            restore_product_stock(
                item['product_id'],
                item['quantity']
            )

    # إرسال إشعار
    send_cancellation_notification(
        customer.get('email'),
        order['reference'],
        reason
    )

    # تسجيل الإلغاء
    log_cancellation(order)

    print(f"Order {order['reference']} cancelled by {cancelled_by}: {reason}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'order.cancelled':
            handle_order_cancelled(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: عدم استعادة المخزون بشكل صحيح

**العربية:** قد يتم استعادة المخزون بشكل خاطئ للطلبات المشحونة بالفعل.

**English:** Inventory might be incorrectly restored for already shipped orders.

**الحل (Solution):** تحقق من الحالة السابقة قبل استعادة المخزون:

```php
$shippableStatuses = ['in_delivery', 'delivered'];
if (!in_array($order['previous_status'], $shippableStatuses)) {
    // يمكن استعادة المخزون
    restoreInventory($order['items']);
}
```

### Issue 2: إشعارات مزدوجة للعميل

**العربية:** قد يتم إرسال إشعارات متعددة لنفس الإلغاء.

**English:** Multiple notifications might be sent for the same cancellation.

**الحل (Solution):** استخدم معرف التسليم لمنع التكرار:

```javascript
if (await isAlreadyProcessed(deliveryId)) {
    return res.status(200).json({ received: true });
}
```

### Issue 3: عدم معرفة السبب الحقيقي للإلغاء

**العربية:** قد لا يكون سبب الإلغاء واضحاً في البيانات.

**English:** The cancellation reason might not be clear in the data.

**الحل (Solution):** قم بتخزين الأسباب المخصصة في ملاحظات الطلب:

```javascript
const reason = order.cancellation_reason || order.notes || 'غير محدد';
```

## Best Practices (أفضل الممارسات)

- **العربية:** قم دائماً بتحليل أسباب الإلغاء لتحسين خدماتك
- **English:** Always analyze cancellation reasons to improve your services
- **العربية:** استرجع المخزون فقط للطلبات غير المشحونة
- **English:** Restore inventory only for non-shipped orders
- **العربية:** أرسل إشعار تأكيد الإلغاء للعميل
- **English:** Send a cancellation confirmation notification to the customer
- **العربية:** تتبع معدلات الإلغاء في تقاريرك
- **English:** Track cancellation rates in your reports

## SEO Keywords

**English:** Salla webhook, order.cancelled event, order cancellation webhook, e-commerce cancellation, Salla API integration

**العربية:** ويب هوك سلة، حدث إلغاء الطلب، إشعار إلغاء الطلب، متجر إلكتروني سلة، إلغاء الطلب

## Related Events (أحداث ذات صلة)

- [order.created](./order.created.md) - طلب جديد
- [order.status.updated](./order.status.updated.md) - تغيير حالة الطلب
- [order.returned](./order.returned.md) - استرجاع طلب
- [payment.refunded](../payment/payment.refunded.md) - استرداد الدفع

---

*Last Updated: مارس 2026*
