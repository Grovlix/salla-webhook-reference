# product.hidden - إخفاء المنتج

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إخفاء منتج من المتجر دون حذفه. المنتج المخفي لا يظهر للعملاء ولكن يمكن استعادته لاحقاً.

**English:** This event is triggered when a product is hidden from the store without being deleted. Hidden products are not visible to customers but can be restored later.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إخفاء منتج من قبل التاجر
- **English:** When a merchant hides a product
- **العربية:** عند إخفاء منتج نفد مخزونه تلقائياً
- **English:** When an out-of-stock product is auto-hidden
- **العربية:** عند إخفاء منتج موسمي انتهى موسمه
- **English:** When a seasonal product's season ends

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.hidden",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج",
    "sku": "SKU-12345",
    "visibility": "hidden",
    "hidden_at": "2024-01-02T10:00:00Z",
    "reason": "merchant_action"
  },
  "created_at": "2024-01-02T10:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `id` | Integer | معرف المنتج المخفي |
| `name` | String | اسم المنتج |
| `sku` | String | رمز المخزون |
| `visibility` | String | حالة الظهور (hidden) |
| `hidden_at` | DateTime | تاريخ ووقت الإخفاء |
| `reason` | String | سبب الإخفاء |

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
    if ($payload['event'] === 'product.hidden') {
        $data = $payload['data'];
        $productId = $data['id'];
        $productName = $data['name'];
        $reason = $data['reason'] ?? 'manual';

        // تحديث الحالة في قاعدة البيانات المحلية
        updateProductVisibility($productId, 'hidden');

        // إزالة من محرك البحث
        removeFromSearchEngine($productId);

        // إيقاف الإعلانات إذا كانت نشطة
        pauseProductAds($productId);

        // إزالة من المفضلة
        removeFromFeaturedProducts($productId);

        // تسجيل الحدث
        logProductVisibilityChange($productId, 'visible', 'hidden', $reason);

        error_log("Product hidden: {$productName} (ID: {$productId})");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
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

async function handleProductHidden(product) {
    const { id, name, sku, reason } = product;

    // تحديث قاعدة البيانات
    await db.products.updateOne(
        { salla_id: id },
        {
            $set: {
                visibility: 'hidden',
                hidden_at: new Date(),
                updated_at: new Date()
            }
        }
    );

    // إزالة من محرك البحث
    await searchEngine.delete(id);

    // إيقاف الإعلانات
    await adsManager.pauseProduct(id);

    // إزالة من XML sitemap
    await sitemap.removeProduct(id);

    // تحديث أوامر الشراء المعلقة
    await handlePendingOrders(id);

    console.log(`Product hidden: ${name} (ID: ${id})`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.hidden') {
            await handleProductHidden(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

### Python (Flask)

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_salla_webhook(payload, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

def handle_product_hidden(product):
    product_id = product['id']
    name = product['name']
    reason = product.get('reason', 'manual')

    # تحديث قاعدة البيانات
    update_product_visibility(product_id, 'hidden')

    # إزالة من محرك البحث
    remove_from_search_index(product_id)

    # إيقاف الإعلانات
    pause_product_ads(product_id)

    print(f"Product hidden: {name} (ID: {product_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.hidden':
            handle_product_hidden(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: استمرار ظهور المنتج في نتائج البحث

**العربية:** قد يستمر المنتج في الظهور في محركات البحث بعد إخفائه.

**English:** Product might still appear in search engines after being hidden.

**الحل (Solution):** قم بإزالة المنتج من sitemap وطلب فهرسة جديد:

```javascript
await sitemap.removeProduct(productId);
await requestSearchEngineIndexing();
```

### Issue 2: روابط مكسورة

**العربية:** قد تكون هناك روابط خارجية للمنتج المخفي.

**English:** There might be external links to the hidden product.

**الحل (Solution):** إما إعادة توجيه الروابط أو عرض صفحة خطأ مناسبة:

```javascript
// إعادة توجيه لصفحة فئة المنتج
await redirectProductPage(productId, product.category_id);
```

## SEO Keywords

**English:** Salla webhook, product.hidden event, hide product webhook, e-commerce product visibility, Salla product API

**العربية:** ويب هوك سلة، حدث إخفاء المنتج، إشعار إخفاء منتج، ظهور المنتج، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [product.created](./product.created.md) - إنشاء منتج
- [product.visible](./product.visible.md) - إظهار المنتج
- [product.deleted](./product.deleted.md) - حذف منتج

---

*Last Updated: مارس 2026*
