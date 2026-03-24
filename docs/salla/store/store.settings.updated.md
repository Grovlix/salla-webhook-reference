# store.settings.updated - تحديث إعدادات المتجر

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث إعدادات المتجر.

**English:** This event is triggered when store settings are updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "store.settings.updated",
  "store_id": "123456789",
  "data": {
    "setting_key": "currency",
    "old_value": "SAR",
    "new_value": "USD",
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
    if ($payload['event'] === 'store.settings.updated') {
        $setting = $payload['data'];
        syncStoreSetting($setting);
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

**English:** Salla webhook, store.settings.updated event, store settings webhook

**العربية:** ويب هوك سلة، حدث تحديث إعدادات المتجر، إشعار تحديث الإعدادات

## Related Events

- [store.updated](./store.updated.md) - تحديث المتجر

---

*Last Updated: مارس 2026*
