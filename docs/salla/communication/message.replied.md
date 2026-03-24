# message.replied - رد على الرسالة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند الرد على رسالة عميل.

**English:** This event is triggered when a customer message is replied to.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "message.replied",
  "store_id": "123456789",
  "data": {
    "id": 777,
    "message_id": 777,
    "reply": "شكراً لتواصلك معنا",
    "replied_at": "2024-01-01T14:00:00Z"
  },
  "created_at": "2024-01-01T14:00:00Z"
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
    if ($payload['event'] === 'message.replied') {
        $reply = $payload['data'];
        logReply($reply);
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

**English:** Salla webhook, message.replied event, message reply webhook

**العربية:** ويب هوك سلة، حدث رد على الرسالة، إشعار الرد

## Related Events

- [message.received](./message.received.md) - رسالة جديدة

---

*Last Updated: مارس 2026*
