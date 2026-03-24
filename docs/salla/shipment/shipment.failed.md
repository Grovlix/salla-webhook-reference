# shipment.failed - فشل التسليم

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند فشل محاولة تسليم الشحنة. قد يكون بسبب عدم توفر العميل أو عنوان غير صحيح.

**English:** This event is triggered when delivery attempt fails. Could be due to customer unavailability or incorrect address.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند عدم توفر العميل في العنوان
- **English:** When customer is unavailable at address
- **العربية:** عند وجود خطأ في العنوان
- **English:** When address is incorrect
- **العربية:** عند رفض العميل استلام الشحنة
- **English:** When customer refuses to receive shipment

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.failed",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "tracking_number": "TRACK123456",
    "status": "failed",
    "failure_reason": "customer_unavailable",
    "retry_scheduled": "2024-01-04T10:00:00Z",
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
    if ($payload['event'] === 'shipment.failed') {
        $shipment = $payload['data'];

        // إخطار العميل بفشل التسليم
        notifyDeliveryFailed($shipment['order_id'], $shipment['failure_reason']);

        // تحديث حالة الشحنة
        updateShipmentStatus($shipment['id'], 'failed');
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

async function handleShipmentFailed(shipment) {
    const { order_id, failure_reason } = shipment;

    // إخطار العميل
    await notificationService.send({
        template: 'delivery_failed',
        to: await getCustomerPhone(order_id),
        data: { reason: failure_reason }
    });

    // تحديث قاعدة البيانات
    await db.shipments.updateOne(
        { shipment_id: shipment.id },
        { $set: { status: 'failed', failure_reason } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.failed') {
            await handleShipmentFailed(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.failed event, delivery failure webhook

**العربية:** ويب هوك سلة، حدث فشل التسليم، إشعار فشل الشحن

## Related Events (أحداث ذات صلة)

- [shipment.delivered](./shipment.delivered.md) - تم التسليم
- [shipment.returned](./shipment.returned.md) - إرجاع الشحنة

---

*Last Updated: مارس 2026*
