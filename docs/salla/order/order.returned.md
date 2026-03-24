# order.returned - استرجاع طلب

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عندما يتم استرجاع طلب من قبل العميل، إما كلياً أو جزئياً. يحتوي هذا الحدث على تفاصيل المنتجات المسترجعة وأسباب الاسترجاع.

**English:** This event is triggered when an order is returned by the customer, either fully or partially. This event contains details of the returned items and return reasons.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عندما يقوم العميل بطلب استرجاع المنتجات
- **English:** When the customer requests product returns
- **العربية:** عند قبول طلب الاسترجاع من قبل التاجر
- **English:** When the return request is approved by the merchant
- **العربية:** عند استلام المنتجات المسترجعة في المستودع
- **English:** When returned products are received at the warehouse

## Payload Schema (هيكل البيانات)

```json
{
  "event": "order.returned",
  "store_id": "123456789",
  "data": {
    "id": 12345,
    "reference": "ORD-12345",
    "status": "returned",
    "previous_status": "delivered",
    "payment_status": "refunded",
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
        "quantity": 1,
        "price": 100.00,
        "return_reason": "معيب",
        "return_quantity": 1
      }
    ],
    "return": {
      "id": 9988,
      "total_amount": 100.00,
      "refund_method": "original_payment",
      "status": "approved",
      "reason": "المنتج معيب",
      "created_at": "2024-01-02T10:00:00Z"
    },
    "total": 100.00,
    "currency": "SAR",
    "updated_at": "2024-01-02T10:00:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-02T10:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `return.id` | Integer | معرف طلب الاسترجاع |
| `return.total_amount` | Decimal | المبلغ المسترجع |
| `return.refund_method` | String | طريقة الاسترداد (original_payment, bank_transfer, wallet) |
| `return.status` | String | حالة الاسترجاع (pending, approved, rejected, completed) |
| `return.reason` | String | سبب الاسترجاع |
| `items[].return_quantity` | Integer | الكمية المسترجعة من المنتج |
| `items[].return_reason` | String | سبب استرجاع المنتج |

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
    if ($payload['event'] === 'order.returned') {
        $order = $payload['data'];
        $returnInfo = $order['return'];

        // معالجة الاسترجاع
        switch ($returnInfo['status']) {
            case 'approved':
                // قبول الاسترجاع
                processApprovedReturn($order);
                break;

            case 'completed':
                // إكمال الاسترجاع وتحديث المخزون
                restoreInventory($order['items']);
                sendReturnConfirmationEmail($order['customer']['email'], $order);
                break;
        }

        // تحديث نظام المحاسبة
        updateAccountingSystem($order);

        error_log("Order returned: {$order['reference']} - Amount: {$returnInfo['total_amount']}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function restoreInventory($items) {
    foreach ($items as $item) {
        if (isset($item['return_quantity'])) {
            // إضافة الكمية المسترجعة للمخزون
            restoreProductStock($item['product_id'], $item['return_quantity']);
        }
    }
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

async function handleOrderReturned(order) {
    const { return: returnInfo, customer, items } = order;

    // معالجة الاسترجاع حسب الحالة
    const statusHandlers = {
        'approved': async () => {
            // إشعار قسم المخازن باستلام المنتج
            await notifyWarehouse(order);
        },
        'completed': async () => {
            // تحديث المخزون
            for (const item of items) {
                if (item.return_quantity) {
                    await updateProductStock(item.product_id, item.return_quantity);
                }
            }

            // إرسال تأكيد للعميل
            await sendEmail(customer.email, 'return_confirmation', {
                orderReference: order.reference,
                refundAmount: returnInfo.total_amount
            });

            // تحديث نظام ERP
            await syncReturnToERP(order);
        }
    };

    const handler = statusHandlers[returnInfo.status];
    if (handler) {
        await handler();
    }

    console.log(`Order ${order.reference} returned: ${returnInfo.total_amount}`);
}

// Express.js endpoint
app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'order.returned') {
            await handleOrderReturned(req.body.data);
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

def handle_order_returned(order):
    return_info = order.get('return', {})
    customer = order.get('customer', {})
    items = order.get('items', [])

    # معالجة الاسترجاع
    if return_info.get('status') == 'completed':
        # تحديث المخزون
        for item in items:
            return_qty = item.get('return_quantity', 0)
            if return_qty > 0:
                restore_product_stock(item['product_id'], return_qty)

        # إرسال تأكيد للعميل
        send_return_confirmation(
            customer.get('email'),
            order['reference'],
            return_info.get('total_amount')
        )

        # تسجيل في نظام المحاسبة
        log_return_transaction(order)

    print(f"Order {order['reference']} returned: {return_info.get('total_amount')}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'order.returned':
            handle_order_returned(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: عدم تحديث المخزون بشكل صحيح

**العربية:** قد لا يتم تحديث المخزون عند استرجاع المنتجات.

**English:** Inventory might not be updated when products are returned.

**الحل (Solution):** تأكد من التحقق من حالة الاسترجاع قبل تحديث المخزون:

```php
if ($returnInfo['status'] === 'completed') {
    // فقط عند اكتمال الاسترجاع يتم تحديث المخزون
    restoreInventory($items);
}
```

### Issue 2: الاسترداد المزدوج

**العربية:** قد يتم معالجة نفس الاسترجاع مرتين.

**English:** The same return might be processed twice.

**الحل (Solution):** استخدم `X-Salla-Delivery` header للتحقق:

```php
$deliveryId = $_SERVER['HTTP_X_SALLA_DELIVERY'] ?? '';
if (isReturnAlreadyProcessed($deliveryId)) {
    http_response_code(200);
    exit;
}
```

### Issue 3: عدم معرفة الكمية المسترجعة

**العربية:** قد تكون الكمية المسترجعة غير واضحة في البيانات.

**English:** The returned quantity might not be clear in the data.

**الحل (Solution):** تحقق من `return_quantity` لكل منتج:

```javascript
const totalReturned = items.reduce((sum, item) => {
    return sum + (item.return_quantity || 0);
}, 0);
```

## SEO Keywords

**English:** Salla webhook, order.returned event, order return webhook, e-commerce returns, refund handling, Salla API

**العربية:** ويب هوك سلة، حدث استرجاع الطلب، إشعار الاسترجاع، استرداد الأموال، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [order.created](./order.created.md) - طلب جديد
- [order.status.updated](./order.status.updated.md) - تغيير حالة الطلب
- [payment.refunded](../payment/payment.refunded.md) - استرداد الدفع
- [payment.partially_refunded](../payment/payment.partially_refunded.md) - استرداد جزئي

---

*Last Updated: مارس 2026*
