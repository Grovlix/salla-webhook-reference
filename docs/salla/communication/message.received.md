# message.received - رسالة جديدة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند استلام رسالة جديدة من العميل.

**English:** This event is triggered when a new message is received from customer.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "message.received",
  "store_id": "123456789",
  "data": {
    "id": 777,
    "customer_id": 98765,
    "customer_name": "اسم العميل",
    "message": "مرحباً، عندي استفسار",
    "received_at": "2024-01-01T12:00:00Z"
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
    if ($payload['event'] === 'message.received') {
        $message = $payload['data'];
        notifyNewMessage($message);
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

**English:** Salla webhook, message.received event, new message webhook

**العربية:** ويب هوك سلة، حدث رسالة جديدة، إشعار الرسائل

## Related Events

- [message.replied](./message.replied.md) - رد على الرسالة

---

*Last Updated: مارس 2026*
