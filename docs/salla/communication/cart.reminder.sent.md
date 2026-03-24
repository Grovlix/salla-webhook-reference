# cart.reminder.sent - تذكير بالسلة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إرسال تذكير بالسلة المتروكة للعميل.

**English:** This event is triggered when an abandoned cart reminder is sent to customer.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "cart.reminder.sent",
  "store_id": "123456789",
  "data": {
    "cart_id": 99999,
    "customer_email": "customer@example.com",
    "sent_at": "2024-01-01T12:00:00Z"
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
    if ($payload['event'] === 'cart.reminder.sent') {
        $reminder = $payload['data'];
        logReminderSent($reminder);
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

**English:** Salla webhook, cart.reminder.sent event, cart reminder webhook

**العربية:** ويب هوك سلة، حدث تذكير بالسلة، إشعار تذكير السلة

## Related Events

- [cart.abandoned](../cart/cart.abandoned.md) - سلة متروكة

---

*Last Updated: مارس 2026*
