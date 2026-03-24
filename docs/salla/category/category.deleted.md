# category.deleted - حذف فئة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف فئة منتجات من المتجر.

**English:** This event is triggered when a product category is deleted from the store.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "category.deleted",
  "store_id": "123456789",
  "data": {
    "id": 123,
    "name": "اسم الفئة",
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
    if ($payload['event'] === 'category.deleted') {
        $category = $payload['data'];
        deleteCategoryFromDatabase($category['id']);
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

**English:** Salla webhook, category.deleted event, category deletion webhook

**العربية:** ويب هوك سلة، حدث حذف فئة، إشعار حذف الفئة

## Related Events

- [category.created](./category.created.md) - إنشاء فئة
- [category.updated](./category.updated.md) - تحديث فئة

---

*Last Updated: مارس 2026*
