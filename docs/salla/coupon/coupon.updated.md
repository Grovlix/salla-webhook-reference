# coupon.updated - تحديث قسيمة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث تفاصيل قسيمة موجودة.

**English:** This event is triggered when existing coupon details are updated.

## When Triggered (متى يتم إطلاقه)

- عند تعديل قسيمة من قبل التاجر
- When merchant modifies an existing coupon

## Payload Schema (هيكل البيانات)

```json
{
  "event": "coupon.updated",
  "store_id": "123456789",
  "data": {
    "code": "SAVE20",
    "discount_value": 25,
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
    if ($payload['event'] === 'coupon.updated') {
        $coupon = $payload['data'];
        updateCouponInDatabase($coupon);
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

async function handleCouponUpdated(coupon) {
    await db.coupons.updateOne(
        { code: coupon.code },
        { $set: { ...coupon, updated_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'coupon.updated') {
            await handleCouponUpdated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, coupon.updated event, update coupon webhook

**العربية:** ويب هوك سلة، حدث تحديث قسيمة، إشعار تحديث القسيمة

## Related Events

- [coupon.created](./coupon.created.md) - إنشاء قسيمة
- [coupon.deleted](./coupon.deleted.md) - حذف قسيمة

---

*Last Updated: مارس 2026*
