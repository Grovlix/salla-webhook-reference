# special_offer.created - إنشاء عرض خاص

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء عرض خاص جديد في المتجر.

**English:** This event is triggered when a new special offer is created in the store.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "special_offer.created",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "عرض الصيف",
    "type": "flash_sale",
    "start_date": "2024-06-01T00:00:00Z",
    "end_date": "2024-06-30T23:59:59Z",
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
    if ($payload['event'] === 'special_offer.created') {
        $offer = $payload['data'];
        syncOfferToDatabase($offer);
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

**English:** Salla webhook, special_offer.created event, special offer webhook

**العربية:** ويب هوك سلة، حدث إنشاء عرض خاص، إشعار إنشاء العرض

## Related Events

- [special_offer.activated](./special_offer.activated.md) - تفعيل عرض خاص
- [special_offer.updated](./special_offer.updated.md) - تحديث عرض خاص

---

*Last Updated: مارس 2026*
