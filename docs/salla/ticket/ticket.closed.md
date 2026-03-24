# ticket.closed - إغلاق التذكرة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إغلاق تذكرة الدعم.

**English:** This event is triggered when a support ticket is closed.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "ticket.closed",
  "store_id": "123456789",
  "data": {
    "id": 888,
    "status": "closed",
    "closed_at": "2024-01-03T10:00:00Z"
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
    if ($payload['event'] === 'ticket.closed') {
        $ticket = $payload['data'];
        closeTicketInSystem($ticket['id']);
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

**English:** Salla webhook, ticket.closed event, ticket closure webhook

**العربية:** ويب هوك سلة، حدث إغلاق التذكرة، إشعار إغلاق التذكرة

## Related Events

- [ticket.created](./ticket.created.md) - إنشاء تذكرة
- [ticket.updated](./ticket.updated.md) - تحديث التذكرة

---

*Last Updated: مارس 2026*
