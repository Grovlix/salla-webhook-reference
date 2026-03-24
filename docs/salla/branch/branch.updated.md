# branch.updated - تحديث الفرع

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث بيانات فرع موجود.

**English:** This event is triggered when existing branch data is updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "branch.updated",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "فرع الرياض المحدث",
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
    if ($payload['event'] === 'branch.updated') {
        $branch = $payload['data'];
        updateBranchInDatabase($branch);
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

**English:** Salla webhook, branch.updated event, branch update webhook

**العربية:** ويب هوك سلة، حدث تحديث الفرع، إشعار تحديث الفرع

## Related Events

- [branch.created](./branch.created.md) - إنشاء فرع
- [branch.deleted](./branch.deleted.md) - حذف فرع

---

*Last Updated: مارس 2026*
