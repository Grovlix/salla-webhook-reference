# brand.updated - تحديث العلامة التجارية

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث بيانات علامة تجارية موجودة.

**English:** This event is triggered when existing brand data is updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "brand.updated",
  "store_id": "123456789",
  "data": {
    "id": 333,
    "name": "اسم العلامة المحدث",
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
    if ($payload['event'] === 'brand.updated') {
        $brand = $payload['data'];
        updateBrandInDatabase($brand);
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

**English:** Salla webhook, brand.updated event, brand update webhook

**العربية:** ويب هوك سلة، حدث تحديث العلامة التجارية، إشعار تحديث العلامة

## Related Events

- [brand.created](./brand.created.md) - إنشاء علامة تجارية
- [brand.deleted](./brand.deleted.md) - حذف العلامة التجارية

---

*Last Updated: مارس 2026*
