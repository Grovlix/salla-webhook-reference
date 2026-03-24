# shipment.updated - تحديث الشحنة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث تفاصيل الشحنة. يشمل ذلك تغيير عنوان الشحن أو شركة الشحن.

**English:** This event is triggered when shipment details are updated. This includes changes to shipping address or company.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تعديل عنوان الشحن
- **English:** When shipping address is modified
- **العربية:** عند تغيير شركة الشحن
- **English:** When shipping company is changed

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.updated",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "tracking_number": "TRACK123456",
    "status": "preparing",
    "updated_at": "2024-01-02T14:00:00Z"
  },
  "created_at": "2024-01-02T14:00:00Z"
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
    if ($payload['event'] === 'shipment.updated') {
        $shipment = $payload['data'];
        updateShipmentInDatabase($shipment);
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

async function handleShipmentUpdated(shipment) {
    await db.shipments.updateOne(
        { shipment_id: shipment.id },
        { $set: { ...shipment, updated_at: new Date() } }
    );
    console.log(`Shipment updated: ${shipment.id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.updated') {
            await handleShipmentUpdated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.updated event, shipment update webhook

**العربية:** ويب هوك سلة، حدث تحديث الشحنة، إشعار تحديث الشحن

## Related Events (أحداث ذات صلة)

- [shipment.created](./shipment.created.md) - إنشاء شحنة
- [shipment.in_delivery](./shipment.in_delivery.md) - قيد التوصيل

---

*Last Updated: مارس 2026*
