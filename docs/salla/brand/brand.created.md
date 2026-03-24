# brand.created - إنشاء علامة تجارية

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إضافة علامة تجارية جديدة للمتجر.

**English:** This event is triggered when a new brand is added to the store.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "brand.created",
  "store_id": "123456789",
  "data": {
    "id": 333,
    "name": "اسم العلامة التجارية",
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
    if ($payload['event'] === 'brand.created') {
        $brand = $payload['data'];
        syncBrandToDatabase($brand);
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

**English:** Salla webhook, brand.created event, brand creation webhook

**العربية:** ويب هوك سلة، حدث إنشاء علامة تجارية، إشعار إنشاء العلامة

## Related Events

- [brand.updated](./brand.updated.md) - تحديث العلامة التجارية
- [brand.deleted](./brand.deleted.md) - حذف العلامة التجارية

---

*Last Updated: مارس 2026*
