# special_offer.deactivated - إيقاف عرض خاص

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إيقاف عرض خاص ليصبح غير نشط.

**English:** This event is triggered when a special offer is deactivated to become inactive.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "special_offer.deactivated",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "عرض الصيف",
    "deactivated_at": "2024-06-30T23:59:59Z"
  },
  "created_at": "2024-06-30T23:59:59Z"
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
    if ($payload['event'] === 'special_offer.deactivated') {
        $offer = $payload['data'];
        updateOfferStatus($offer['id'], 'inactive');
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

**English:** Salla webhook, special_offer.deactivated event, deactivate special offer webhook

**العربية:** ويب هوك سلة، حدث إيقاف عرض خاص، إشعار إيقاف العرض

## Related Events

- [special_offer.activated](./special_offer.activated.md) - تفعيل عرض خاص
- [special_offer.deleted](./special_offer.deleted.md) - حذف عرض خاص

---

*Last Updated: مارس 2026*
