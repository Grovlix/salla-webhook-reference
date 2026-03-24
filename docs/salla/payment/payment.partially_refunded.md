# payment.partially_refunded - استرداد جزئي

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند استرداد جزء من مبلغ الدفع للعميل.

**English:** This event is triggered when part of the payment amount is refunded to customer.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند استرداد جزء من المبلغ للعميل
- **English:** When partial amount is refunded to customer
- **العربية:** عند استرجاع بعض المنتجات فقط
- **English:** When only some products are returned

## Payload Schema (هيكل البيانات)

```json
{
  "event": "payment.partially_refunded",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "order_id": 12345,
    "amount": 200.00,
    "refund_amount": 100.00,
    "currency": "SAR",
    "refund_reason": "partial_return",
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
    if ($payload['event'] === 'payment.partially_refunded') {
        $payment = $payload['data'];

        // تحديث حالة الطلب
        updateOrderStatus($payment['order_id'], 'partially_refunded');

        // إرسال تأكيد الاسترداد الجزئي
        sendPartialRefundConfirmation($payment);

        error_log("Payment partially refunded: Order {$payment['order_id']}, Amount: {$payment['refund_amount']}");
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

async function handlePartialRefund(payment) {
    await db.orders.updateOne(
        { order_id: payment.order_id },
        { $set: { status: 'partially_refunded' } }
    );

    await sendPartialRefundConfirmation(payment);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'payment.partially_refunded') {
            await handlePartialRefund(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, payment.partially_refunded event, partial refund webhook

**العربية:** ويب هوك سلة، حدث استرداد جزئي، إشعار استرداد جزئي

## Related Events (أحداث ذات صلة)

- [payment.refunded](./payment.refunded.md) - استرداد كامل
- [order.returned](../order/order.returned.md) - استرجاع طلب

---

*Last Updated: مارس 2026*
