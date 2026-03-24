# branch.deleted - حذف فرع

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف فرع من المتجر.

**English:** This event is triggered when a branch is deleted from the store.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "branch.deleted",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "فرع الرياض",
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
    if ($payload['event'] === 'branch.deleted') {
        $branch = $payload['data'];
        archiveBranchData($branch['id']);
        deleteBranchFromDatabase($branch['id']);
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

**English:** Salla webhook, branch.deleted event, branch deletion webhook

**العربية:** ويب هوك سلة، حدث حذف فرع، إشعار حذف الفرع

## Related Events

- [branch.created](./branch.created.md) - إنشاء فرع
- [branch.updated](./branch.updated.md) - تحديث الفرع

---

*Last Updated: مارس 2026*
