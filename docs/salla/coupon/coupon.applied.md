# coupon.applied - تطبيق قسيمة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تطبيق قسيمة خصم على طلب.

**English:** This event is triggered when a discount coupon is applied to an order.

## When Triggered (متى يتم إطلاقه)

- عند إدخال العميل لرمز القسيمة الصحيح
- When customer enters valid coupon code

## Payload Schema (هيكل البيانات)

```json
{
  "event": "coupon.applied",
  "store_id": "123456789",
  "data": {
    "code": "SAVE10",
    "discount_type": "percentage",
    "discount_value": 10,
    "order_id": 12345,
    "applied_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
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
    if ($payload['event'] === 'coupon.applied') {
        $coupon = $payload['data'];
        logCouponUsage($coupon);
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

async function handleCouponApplied(coupon) {
    await db.coupons_usage.insert({
        code: coupon.code,
        order_id: coupon.order_id,
        applied_at: new Date()
    });
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'coupon.applied') {
            await handleCouponApplied(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, coupon.applied event, discount coupon webhook

**العربية:** ويب هوك سلة، حدث تطبيق قسيمة، إشعار تطبيق القسيمة

## Related Events

- [coupon.created](./coupon.created.md) - إنشاء قسيمة
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
