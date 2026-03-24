# shipment.in_delivery - شحنة قيد التوصيل

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عندما تكون الشحنة في طريقها إلى العميل. مفيد لإرسال تحديثات التتبع.

**English:** This event is triggered when the shipment is out for delivery. Useful for sending tracking updates.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند استلام شركة الشحن للطرود
- **English:** When shipping company picks up the packages
- **العربية:** عند بدء رحلة التوصيل
- **English:** When delivery journey begins

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.in_delivery",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "tracking_number": "TRACK123456",
    "status": "in_delivery",
    "estimated_delivery": "2024-01-03T18:00:00Z",
    "updated_at": "2024-01-02T10:00:00Z"
  },
  "created_at": "2024-01-02T10:00:00Z"
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
    if ($payload['event'] === 'shipment.in_delivery') {
        $shipment = $payload['data'];

        // إرسال إشعار للعميل
        sendInDeliveryNotification($shipment['order_id'], $shipment['tracking_number']);

        // تحديث حالة الشحنة
        updateShipmentStatus($shipment['id'], 'in_delivery');
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

async function handleInDelivery(shipment) {
    const { order_id, tracking_number } = shipment;

    // إرسال إشعار SMS
    await smsService.send({
        to: await getCustomerPhone(order_id),
        message: `طلبك في الطريق إليك! رقم التتبع: ${tracking_number}`
    });

    // تحديث قاعدة البيانات
    await db.shipments.updateOne(
        { shipment_id: shipment.id },
        { $set: { status: 'in_delivery', updated_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.in_delivery') {
            await handleInDelivery(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.in_delivery event, out for delivery webhook

**العربية:** ويب هوك سلة، حدث الشحنة قيد التوصيل، إشعار الشحن قيد التوصيل

## Related Events (أحداث ذات صلة)

- [shipment.delivered](./shipment.delivered.md) - تم التسليم
- [shipment.created](./shipment.created.md) - إنشاء شحنة

---

*Last Updated: مارس 2026*
