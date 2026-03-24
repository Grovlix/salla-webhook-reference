# shipment.cancelled - إلغاء الشحنة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إلغاء شحنة. قد يكون بسبب إلغاء الطلب أو طلب العميل.

**English:** This event is triggered when a shipment is cancelled. Could be due to order cancellation or customer request.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إلغاء الطلب المرتبط بالشحنة
- **English:** When associated order is cancelled
- **العربية:** عند طلب التاجر إلغاء الشحنة
- **English:** When merchant requests shipment cancellation

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.cancelled",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "tracking_number": "TRACK123456",
    "status": "cancelled",
    "cancelled_at": "2024-01-03T10:00:00Z"
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
    if ($payload['event'] === 'shipment.cancelled') {
        $shipment = $payload['data'];
        updateShipmentStatus($shipment['id'], 'cancelled');
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

async function handleShipmentCancelled(shipment) {
    await db.shipments.updateOne(
        { shipment_id: shipment.id },
        { $set: { status: 'cancelled', cancelled_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.cancelled') {
            await handleShipmentCancelled(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.cancelled event, shipment cancellation webhook

**العربية:** ويب هوك سلة، حدث إلغاء الشحنة، إشعار إلغاء الشحن

## Related Events (أحداث ذات صلة)

- [shipment.created](./shipment.created.md) - إنشاء شحنة
- [order.cancelled](../order/order.cancelled.md) - إلغاء طلب

---

*Last Updated: مارس 2026*
