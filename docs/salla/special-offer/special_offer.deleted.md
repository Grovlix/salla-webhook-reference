# special_offer.deleted - حذف عرض خاص

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف عرض خاص من المتجر.

**English:** This event is triggered when a special offer is deleted from the store.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "special_offer.deleted",
  "store_id": "123456789",
  "data": {
    "id": 111,
    "name": "عرض الصيف",
    "deleted_at": "2024-01-03T10:00:00Z"
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
    if ($payload['event'] === 'special_offer.deleted') {
        $offer = $payload['data'];
        deleteOfferFromDatabase($offer['id']);
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

**English:** Salla webhook, special_offer.deleted event, delete special offer webhook

**العربية:** ويب هوك سلة، حدث حذف عرض خاص، إشعار حذف العرض

## Related Events

- [special_offer.created](./special_offer.created.md) - إنشاء عرض خاص
- [special_offer.deactivated](./special_offer.deactivated.md) - إيقاف عرض خاص

---

*Last Updated: مارس 2026*
