# coupon.deleted - حذف قسيمة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف قسيمة من المتجر.

**English:** This event is triggered when a coupon is deleted from the store.

## When Triggered (متى يتم إطلاقه)

- عند حذف قسيمة من قبل التاجر
- When merchant deletes a coupon

## Payload Schema (هيكل البيانات)

```json
{
  "event": "coupon.deleted",
  "store_id": "123456789",
  "data": {
    "code": "SAVE20",
    "deleted_at": "2024-01-03T10:00:00Z"
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
    if ($payload['event'] === 'coupon.deleted') {
        $coupon = $payload['data'];
        deleteCouponFromDatabase($coupon['code']);
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

async function handleCouponDeleted(coupon) {
    await db.coupons.deleteOne({ code: coupon.code });
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'coupon.deleted') {
            await handleCouponDeleted(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, coupon.deleted event, delete coupon webhook

**العربية:** ويب هوك سلة، حدث حذف قسيمة، إشعار حذف القسيمة

## Related Events

- [coupon.created](./coupon.created.md) - إنشاء قسيمة
- [coupon.updated](./coupon.updated.md) - تحديث قسيمة

---

*Last Updated: مارس 2026*
