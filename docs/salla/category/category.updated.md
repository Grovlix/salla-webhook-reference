# category.updated - تحديث فئة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث بيانات فئة موجودة.

**English:** This event is triggered when existing category data is updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "category.updated",
  "store_id": "123456789",
  "data": {
    "id": 123,
    "name": "اسم الفئة المحدث",
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
    if ($payload['event'] === 'category.updated') {
        $category = $payload['data'];
        updateCategoryInDatabase($category);
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

**English:** Salla webhook, category.updated event, category update webhook

**العربية:** ويب هوك سلة، حدث تحديث فئة، إشعار تحديث الفئة

## Related Events

- [category.created](./category.created.md) - إنشاء فئة
- [category.deleted](./category.deleted.md) - حذف فئة

---

*Last Updated: مارس 2026*
