# special_offer.activated - تفعيل عرض خاص

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تفعيل عرض خاص ليصبح نشطاً.

**English:** This event is triggered when a special offer is activated to become active.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "special_offer.activated",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "عرض الصيف",
    "activated_at": "2024-06-01T00:00:00Z"
  },
  "created_at": "2024-06-01T00:00:00Z"
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
    if ($payload['event'] === 'special_offer.activated') {
        $offer = $payload['data'];
        notifyOfferActivated($offer);
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

**English:** Salla webhook, special_offer.activated event, activate special offer webhook

**العربية:** ويب هوك سلة، حدث تفعيل عرض خاص، إشعار تفعيل العرض

## Related Events

- [special_offer.created](./special_offer.created.md) - إنشاء عرض خاص
- [special_offer.deactivated](./special_offer.deactivated.md) - إيقاف عرض خاص

---

*Last Updated: مارس 2026*
