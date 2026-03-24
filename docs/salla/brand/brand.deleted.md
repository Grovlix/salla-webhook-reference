# brand.deleted - حذف العلامة التجارية

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف علامة تجارية من المتجر.

**English:** This event is triggered when a brand is deleted from the store.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "brand.deleted",
  "store_id": "123456789",
  "data": {
    "id": 333,
    "name": "اسم العلامة التجارية",
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
    if ($payload['event'] === 'brand.deleted') {
        $brand = $payload['data'];
        deleteBrandFromDatabase($brand['id']);
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

**English:** Salla webhook, brand.deleted event, brand deletion webhook

**العربية:** ويب هوك سلة، حدث حذف العلامة التجارية، إشعار حذف العلامة

## Related Events

- [brand.created](./brand.created.md) - إنشاء علامة تجارية
- [brand.updated](./brand.updated.md) - تحديث العلامة التجارية

---

*Last Updated: مارس 2026*
