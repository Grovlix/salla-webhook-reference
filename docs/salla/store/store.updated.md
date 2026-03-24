# store.updated - تحديث المتجر

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث بيانات المتجر الأساسية.

**English:** This event is triggered when store basic information is updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "store.updated",
  "store_id": "123456789",
  "data": {
    "name": "اسم المتجر",
    "description": "وصف المتجر",
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
    if ($payload['event'] === 'store.updated') {
        $store = $payload['data'];
        syncStoreInfo($store);
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

**English:** Salla webhook, store.updated event, store update webhook

**العربية:** ويب هوك سلة، حدث تحديث المتجر، إشعار تحديث المتجر

## Related Events

- [store.app.installed](./store.app.installed.md) - تثبيت تطبيق
- [store.settings.updated](./store.settings.updated.md) - تحديث إعدادات المتجر

---

*Last Updated: مارس 2026*
