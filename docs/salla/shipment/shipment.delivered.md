# shipment.delivered - تم التسليم

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تسليم الشحنة للعميل بنجاح. مفيد لطلب التقييمات وإرسال رسائل الشكر.

**English:** This event is triggered when the shipment is successfully delivered to the customer. Useful for requesting reviews and sending thank you messages.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تأكيد استلام العميل للشحنة
- **English:** When customer confirms receipt of shipment
- **العربية:** عند تحديث شركة الشحن بالتسليم
- **English:** When shipping company updates delivery status

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.delivered",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "tracking_number": "TRACK123456",
    "status": "delivered",
    "delivered_at": "2024-01-03T15:30:00Z",
    "updated_at": "2024-01-03T15:30:00Z"
  },
  "created_at": "2024-01-03T15:30:00Z"
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
    if ($payload['event'] === 'shipment.delivered') {
        $shipment = $payload['data'];
        $orderId = $shipment['order_id'];

        // إرسال بريد شكر
        sendThankYouEmail($orderId);

        // طلب تقييم من العميل
        sendReviewRequest($orderId);

        // تحديث حالة الشحنة
        updateShipmentStatus($shipment['id'], 'delivered');
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

async function handleShipmentDelivered(shipment) {
    const { order_id, id } = shipment;

    // إرسال بريد شكر
    await emailService.send({
        template: 'thank_you',
        to: await getCustomerEmail(order_id),
        data: { order_id }
    });

    // طلب تقييم
    await sendReviewRequest(order_id);

    // تحديث قاعدة البيانات
    await db.shipments.updateOne(
        { shipment_id: id },
        { $set: { status: 'delivered', delivered_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.delivered') {
            await handleShipmentDelivered(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.delivered event, delivery confirmation webhook

**العربية:** ويب هوك سلة، حدث تم التسليم، إشعار تأكيد التسليم

## Related Events (أحداث ذات صلة)

- [shipment.in_delivery](./shipment.in_delivery.md) - قيد التوصيل
- [order.status.updated](../order/order.status.updated.md) - تغيير حالة الطلب

---

*Last Updated: مارس 2026*
