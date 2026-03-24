# payment.refunded - استرداد الدفع

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند استرداد كامل مبلغ الدفع للعميل.

**English:** This event is triggered when full payment amount is refunded to customer.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند استرداد المبلغ كلياً للعميل
- **English:** When full amount is refunded to customer
- **العربية:** عند إلغاء الطلب واسترداد المبلغ
- **English:** When order is cancelled and amount is refunded

## Payload Schema (هيكل البيانات)

```json
{
  "event": "payment.refunded",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "order_id": 12345,
    "amount": 200.00,
    "refund_amount": 200.00,
    "currency": "SAR",
    "refund_reason": "customer_request",
    "refunded_at": "2024-01-03T10:00:00Z"
  },
  "created_at": "2024-01-03T10:00:00Z"
}
```

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
    if ($payload['event'] === 'payment.refunded') {
        $payment = $payload['data'];

        // تحديث حالة الطلب
        updateOrderStatus($payment['order_id'], 'refunded');

        // إرسال تأكيد الاسترداد
        sendRefundConfirmation($payment);

        error_log("Payment refunded: Order {$payment['order_id']}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
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

async function handlePaymentRefunded(payment) {
    await db.orders.updateOne(
        { order_id: payment.order_id },
        { $set: { status: 'refunded' } }
    );

    await sendRefundConfirmation(payment);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'payment.refunded') {
            await handlePaymentRefunded(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, payment.refunded event, refund webhook, e-commerce refunds

**العربية:** ويب هوك سلة، حدث استرداد الدفع، إشعار استرداد المبلغ

## Related Events (أحداث ذات صلة)

- [payment.partially_refunded](./payment.partially_refunded.md) - استرداد جزئي
- [order.returned](../order/order.returned.md) - استرجاع طلب

---

*Last Updated: مارس 2026*
