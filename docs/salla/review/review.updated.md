# review.updated - تحديث التقييم

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تعديل العميل لتقييمه الموجود.

**English:** This event is triggered when a customer modifies their existing review.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "review.updated",
  "store_id": "123456789",
  "data": {
    "id": 555,
    "product_id": 45678,
    "rating": 4,
    "comment": "تعديل: المنتج جيد",
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
    if ($payload['event'] === 'review.updated') {
        $review = $payload['data'];
        updateReviewInDatabase($review);
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

async function handleReviewUpdated(review) {
    await db.reviews.updateOne(
        { review_id: review.id },
        { $set: { ...review, updated_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'review.updated') {
            await handleReviewUpdated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, review.updated event, review update webhook

**العربية:** ويب هوك سلة، حدث تحديث التقييم، إشعار تعديل التقييم

## Related Events

- [review.created](./review.created.md) - تقييم جديد

---

*Last Updated: مارس 2026*
