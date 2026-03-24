# coupon.created - إنشاء قسيمة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء قسيمة خصم جديدة في المتجر.

**English:** This event is triggered when a new discount coupon is created in the store.

## When Triggered (متى يتم إطلاقه)

- عند إنشاء قسيمة من قبل التاجر
- When merchant creates a new coupon

## Payload Schema (هيكل البيانات)

```json
{
  "event": "coupon.created",
  "store_id": "123456789",
  "data": {
    "code": "SAVE20",
    "discount_type": "percentage",
    "discount_value": 20,
    "min_purchase": 100,
    "max_discount": 50,
    "usage_limit": 100,
    "expires_at": "2024-12-31T23:59:59Z",
    "created_at": "2024-01-01T12:00:00Z"
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
    if ($payload['event'] === 'coupon.created') {
        $coupon = $payload['data'];
        syncCouponToDatabase($coupon);
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

async function handleCouponCreated(coupon) {
    await db.coupons.insert({
        ...coupon,
        synced_at: new Date()
    });
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'coupon.created') {
            await handleCouponCreated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, coupon.created event, create coupon webhook

**العربية:** ويب هوك سلة، حدث إنشاء قسيمة، إشعار إنشاء القسيمة

## Related Events

- [coupon.updated](./coupon.updated.md) - تحديث قسيمة
- [coupon.applied](./coupon.applied.md) - تطبيق قسيمة

---

*Last Updated: مارس 2026*
