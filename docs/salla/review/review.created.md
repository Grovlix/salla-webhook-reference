# review.created - تقييم جديد

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إضافة عميل لتقييم جديد على منتج.

**English:** This event is triggered when a customer adds a new product review.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "review.created",
  "store_id": "123456789",
  "data": {
    "id": 555,
    "product_id": 45678,
    "customer_name": "اسم العميل",
    "rating": 5,
    "comment": "منتج رائع!",
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
    if ($payload['event'] === 'review.created') {
        $review = $payload['data'];

        // حفظ التقييم
        saveReview($review);

        // إخطار الإدارة
        if ($review['rating'] < 3) {
            notifyLowRatingReview($review);
        }

        error_log("New review created: Product {$review['product_id']}");
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

async function handleReviewCreated(review) {
    await db.reviews.insert({ ...review, created_at: new Date() });

    // إشعار للتقييمات المنخفضة
    if (review.rating < 3) {
        await slack.send({
            text: `تقييم منخفض جديد`,
            attachments: [{
                title: `التقييم: ${review.rating}/5`,
                text: review.comment,
                color: 'warning'
            }]
        });
    }

    console.log(`New review: Product ${review.product_id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'review.created') {
            await handleReviewCreated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, review.created event, product review webhook

**العربية:** ويب هوك سلة، حدث تقييم جديد، إشعار التقييم

## Related Events

- [review.updated](./review.updated.md) - تحديث التقييم
- [product.created](../product/product.created.md) - إنشاء منتج

---

*Last Updated: مارس 2026*
