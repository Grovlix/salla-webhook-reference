# ticket.updated - تحديث التذكرة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث حالة التذكرة أو محتواها.

**English:** This event is triggered when ticket status or content is updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "ticket.updated",
  "store_id": "123456789",
  "data": {
    "id": 888,
    "status": "in_progress",
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
    if ($payload['event'] === 'ticket.updated') {
        $ticket = $payload['data'];
        updateTicketInSystem($ticket);
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

**English:** Salla webhook, ticket.updated event, ticket update webhook

**العربية:** ويب هوك سلة، حدث تحديث التذكرة، إشعار تحديث التذكرة

## Related Events

- [ticket.created](./ticket.created.md) - إنشاء تذكرة
- [ticket.closed](./ticket.closed.md) - إغلاق التذكرة

---

*Last Updated: مارس 2026*
