# store.app.installed - تثبيت تطبيق

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تثبيت تطبيق على المتجر. مهم لتطبيقات الطرف الثالث لبدء الإعداد.

**English:** This event is triggered when an app is installed on the store. Important for third-party apps to start setup.

## Payload Schema (هيكل البيانات)

```json
{
  "event": "store.app.installed",
  "store_id": "123456789",
  "data": {
    "app_id": "app_123",
    "app_name": "اسم التطبيق",
    "installed_at": "2024-01-01T12:00:00Z",
    "merchant_id": 98765
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
    if ($payload['event'] === 'store.app.installed') {
        $data = $payload['data'];

        // تهيئة التطبيق للمتجر
        initializeAppForStore($data['store_id'], $data['merchant_id']);

        // إرسال بر ترحيبي
        sendWelcomeEmail($data['merchant_id']);

        error_log("App installed for store: {$data['store_id']}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function initializeAppForStore($storeId, $merchantId) {
    // إنشاء إعدادات التطبيق للمتجر
    global $pdo;

    $stmt = $pdo->prepare("
        INSERT INTO app_stores (store_id, merchant_id, status, created_at)
        VALUES (?, ?, 'active', NOW())
        ON DUPLICATE KEY UPDATE status = 'active'
    ");

    $stmt->execute([$storeId, $merchantId]);
}
?>
```

### JavaScript (Node.js)

```javascript
const crypto = require('crypto');

function verifySallaWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    const expectedSignature = `sha256=${digest}`;
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

async function handleAppInstalled(data) {
    const { store_id, merchant_id, app_id } = data;

    // تهيئة التطبيق
    await db.app_stores.insert({
        store_id,
        merchant_id,
        app_id,
        status: 'active',
        installed_at: new Date()
    });

    // إرسال بريد ترحيبي
    await emailService.send({
        template: 'app_installed',
        to: await getMerchantEmail(merchant_id),
        data: { store_id }
    });

    console.log(`App installed for store: ${store_id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-marketsignature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'store.app.installed') {
            await handleAppInstalled(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, store.app.installed event, app installation webhook, Salla app API

**العربية:** ويب هوك سلة، حدث تثبيت تطبيق، إشعار تثبيت التطبيق

## Related Events

- [store.app.uninstalled](./store.app.uninstalled.md) - إلغاء تثبيت تطبيق

---

*Last Updated: مارس 2026*
