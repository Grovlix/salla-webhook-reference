# ticket.created - إنشاء تذكرة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء تذكرة دعم جديدة.

**English:** This event is triggered when a new support ticket is created.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "ticket.created",
  "store_id": "123456789",
  "data": {
    "id": 888,
    "customer_id": 98765,
    "subject": "استفسار عن المنتج",
    "status": "open",
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
    if ($payload['event'] === 'ticket.created') {
        $ticket = $payload['data'];
        syncTicketToSupportSystem($ticket);
        notifyNewTicket($ticket);
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

**English:** Salla webhook, ticket.created event, support ticket webhook

**العربية:** ويب هوك سلة، حدث إنشاء تذكرة، إشعار التذكرة

## Related Events

- [ticket.updated](./ticket.updated.md) - تحديث التذكرة
- [ticket.closed](./ticket.closed.md) - إغلاق التذكرة

---

*Last Updated: مارس 2026*
