# category.created - إنشاء فئة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء فئة منتجات جديدة.

**English:** This event is triggered when a new product category is created.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "category.created",
  "store_id": "123456789",
  "data": {
    "id": 123,
    "name": "اسم الفئة",
    "parent_id": null,
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
    if ($payload['event'] === 'category.created') {
        $category = $payload['data'];
        syncCategoryToDatabase($category);
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}
?>
```

## SEO Keywords

**English:** Salla webhook, category.created event, category creation webhook

**العربية:** ويب هوك سلة، حدث إنشاء فئة، إشعار إنشاء الفئة

## Related Events

- [category.updated](./category.updated.md) - تحديث فئة
- [category.deleted](./category.deleted.md) - حذف فئة

---

*Last Updated: مارس 2026*
