# shipment.created - إنشاء شحنة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء شحنة جديدة لطلب. يحتوي على تفاصيل الشحن ورقم التتبع.

**English:** This event is triggered when a new shipment is created for an order. Contains shipping details and tracking number.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إنشاء شحنة من قبل التاجر
- **English:** When merchant creates a shipment
- **العربية:** عند تفعيل خدمة الشحن التلقائي
- **English:** When auto-shipping service is activated

## Payload Schema (هيكل البيانات)

```json
{
  "event": "shipment.created",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "order_reference": "ORD-12345",
    "shipping_company": "Aramex",
    "tracking_number": "TRACK123456",
    "status": "created",
    "address": {
      "city": "Riyadh",
      "district": "Al Olaya",
      "street": "Street Name",
      "building": "123",
      "phone": "+966500000000"
    },
    "created_at": "2024-01-02T10:00:00Z"
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
    if ($payload['event'] === 'shipment.created') {
        $shipment = $payload['data'];
        $trackingNumber = $shipment['tracking_number'];
        $orderId = $shipment['order_id'];

        // إرسال بريد إلكتروني برقم التتبع
        sendTrackingEmail($shipment['address']['phone'], $trackingNumber);

        // حفظ الشحنة في قاعدة البيانات
        saveShipment($shipment);

        error_log("Shipment created: {$trackingNumber}");
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

async function handleShipmentCreated(shipment) {
    const { order_id, tracking_number, shipping_company, address } = shipment;

    // إرسال إشعار التتبع
    await notificationService.send({
        to: address.phone,
        template: 'shipment_created',
        data: {
            tracking_number: tracking_number,
            company: shipping_company,
            order_id: order_id
        }
    });

    // حفظ الشحنة
    await db.shipments.insert({
        ...shipment,
        created_at: new Date()
    });

    console.log(`Shipment created: ${tracking_number}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'shipment.created') {
            await handleShipmentCreated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, shipment.created event, shipping webhook, e-commerce shipment tracking

**العربية:** ويب هوك سلة، حدث إنشاء شحنة، إشعار الشحن، تتبع الشحنات

## Related Events (أحداث ذات صلة)

- [shipment.delivered](./shipment.delivered.md) - تم التسليم
- [shipment.in_delivery](./shipment.in_delivery.md) - قيد التوصيل
- [order.status.updated](../order/order.status.updated.md) - تغيير حالة الطلب

---

*Last Updated: مارس 2026*
