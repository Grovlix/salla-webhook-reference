# store.app.uninstalled - إلغاء تثبيت تطبيق

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إلغاء تثبيت تطبيق من المتجر. مهم لتنظيف البيانات.

**English:** This event is triggered when an app is uninstalled from the store. Important for data cleanup.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "store.app.uninstalled",
  "store_id": "123456789",
  "data": {
    "app_id": "app_123",
    "app_name": "اسم التطبيق",
    "uninstalled_at": "2024-01-03T10:00:00Z",
    "merchant_id": 98765
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
    if ($payload['event'] === 'store.app.uninstalled') {
        $data = $payload['data'];

        // أرشفة بيانات المتجر
        archiveStoreData($data['store_id']);

        // حذف البيانات المرتبطة
        cleanupAppData($data['store_id']);

        error_log("App uninstalled for store: {$data['store_id']}");
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

**English:** Salla webhook, store.app.uninstalled event, app uninstallation webhook

**العربية:** ويب هوك سلة، حدث إلغاء تثبيت تطبيق، إشعار إزالة التطبيق

## Related Events

- [store.app.installed](./store.app.installed.md) - تثبيت تطبيق

---

*Last Updated: مارس 2026*
