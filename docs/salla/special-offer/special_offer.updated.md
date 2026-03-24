# special_offer.updated - تحديث عرض خاص

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث تفاصيل عرض خاص موجود.

**English:** This event is triggered when existing special offer details are updated.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "special_offer.updated",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "عرض الصيف المحدث",
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
    if ($payload['event'] === 'special_offer.updated') {
        $offer = $payload['data'];
        updateOfferInDatabase($offer);
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

**English:** Salla webhook, special_offer.updated event, update special offer webhook

**العربية:** ويب هوك سلة، حدث تحديث عرض خاص، إشعار تحديث العرض

## Related Events

- [special_offer.created](./special_offer.created.md) - إنشاء عرض خاص
- [special_offer.activated](./special_offer.activated.md) - تفعيل عرض خاص

---

*Last Updated: مارس 2026*
