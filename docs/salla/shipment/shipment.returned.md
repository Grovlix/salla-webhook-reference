# shipment.returned - إرجاع الشحنة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إرجاع الشونة إلى المرسل. قد يكون بسبب عدم استلام العميل أو رفض الاستلام.

**English:** This event is triggered when shipment is returned to sender. Could be due to customer not receiving or refusing delivery.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إرجاع الشحنة من شركة الشحن
- **English:** When shipment is returned by shipping company
- **العربية:** بعد عدة محاولات فاشلة للتسليم
- **English:** After multiple failed delivery attempts

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.returned",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "tracking_number": "TRACK123456",
    "status": "returned",
    "return_reason": "delivery_failed",
    "returned_at": "2024-01-05T10:00:00Z"
  },
  "created_at": "2024-01-05T10:00:00Z"
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
    if ($payload['event'] === 'shipment.returned') {
        $shipment = $payload['data'];

        // إخطار التاجر
        notifyMerchantShipmentReturned($shipment);

        // معالجة الاسترجاع
        processReturnedShipment($shipment);
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

async function handleShipmentReturned(shipment) {
    // إخطار التاجر
    await notificationService.send({
        template: 'shipment_returned',
        to: process.env.MERCHANT_EMAIL,
        data: { shipment }
    });

    // تحديث قاعدة البيانات
    await db.shipments.updateOne(
        { shipment_id: shipment.id },
        { $set: { status: 'returned', returned_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.returned') {
            await handleShipmentReturned(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.returned event, shipment return webhook

**العربية:** ويب هوك سلة، حدث إرجاع الشحنة، إشعار إرجاع الشحن

## Related Events (أحداث ذات صلة)

- [shipment.failed](./shipment.failed.md) - فشل التسليم
- [order.returned](../order/order.returned.md) - استرجاع طلب

---

*Last Updated: مارس 2026*
