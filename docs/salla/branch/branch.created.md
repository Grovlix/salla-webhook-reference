# branch.created - إنشاء فرع

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء فرع جديد للمتجر.

**English:** This event is triggered when a new store branch is created.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "branch.created",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "فرع الرياض",
    "city": "Riyadh",
    "address": "عنوان الفرع",
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
    if ($payload['event'] === 'branch.created') {
        $branch = $payload['data'];
        syncBranchToDatabase($branch);
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

**English:** Salla webhook, branch.created event, branch creation webhook

**العربية:** ويب هوك سلة، حدث إنشاء فرع، إشعار إنشاء الفرع

## Related Events

- [branch.updated](./branch.updated.md) - تحديث الفرع
- [branch.deleted](./branch.deleted.md) - حذف فرع

---

*Last Updated: مارس 2026*
