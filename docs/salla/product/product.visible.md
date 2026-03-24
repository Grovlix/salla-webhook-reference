# product.visible - إظهار المنتج

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إعادة إظهار منتج كان مخفياً. المنتج يصبح مرئياً للعملاء ويمكن شراؤه مرة أخرى.

**English:** This event is triggered when a hidden product is made visible again. The product becomes visible to customers and can be purchased once more.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إعادة إظهار منتج مخفي من قبل التاجر
- **English:** When a merchant unhides a product
- **العربية:** عند إعادة توفر مخزون منتج كان مخفياً
- **English:** When an out-of-stock product becomes available again
- **العربية:** عند بدء موسم منتج موسمي
- **English:** When a seasonal product's season begins

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.visible",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج",
    "sku": "SKU-12345",
    "visibility": "visible",
    "visible_at": "2024-01-02T10:00:00Z",
    "previously_hidden_at": "2024-01-01T10:00:00Z",
    "reason": "merchant_action"
  },
  "created_at": "2024-01-02T10:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `id` | Integer | معرف المنتج |
| `name` | String | اسم المنتج |
| `sku` | String | رمز المخزون |
| `visibility` | String | حالة الظهور (visible) |
| `visible_at` | DateTime | تاريخ ووقت الإظهار |
| `previously_hidden_at` | DateTime | تاريخ ووقت الإخفاء السابق |
| `reason` | String | سبب الإظهار |

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
    if ($payload['event'] === 'product.visible') {
        $data = $payload['data'];
        $productId = $data['id'];
        $productName = $data['name'];

        // تحديث الحالة في قاعدة البيانات المحلية
        updateProductVisibility($productId, 'visible');

        // إضافة المنتج لمحرك البحث
        addToSearchEngine($productId);

        // إعادة تفعيل الإعلانات إذا لزم الأمر
        if (shouldResumeAds($productId)) {
            resumeProductAds($productId);
        }

        // إضافة لـ XML sitemap
        addToSitemap($productId);

        // إشعار العملاء الذين يراقبون المنتج
        notifyWaitingCustomers($productId);

        // تسجيل الحدث
        logProductVisibilityChange($productId, 'hidden', 'visible', 'restored');

        error_log("Product visible: {$productName} (ID: {$productId})");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function shouldResumeAds($productId) {
    // التحقق مما إذا كان يجب استئناف الإعلانات
    // يمكن أن يعتمد على المخزون أو إعدادات المنتج
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT auto_ads, quantity FROM products WHERE salla_id = ?
    ");
    $stmt->execute([$productId]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    return $product && $product['auto_ads'] && $product['quantity'] > 0;
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

async function handleProductVisible(product) {
    const { id, name, sku, reason } = product;

    // تحديث قاعدة البيانات
    await db.products.updateOne(
        { salla_id: id },
        {
            $set: {
                visibility: 'visible',
                visible_at: new Date(),
                updated_at: new Date()
            }
        }
    );

    // إضافة لمحرك البحث
    await searchEngine.index({
        id: id,
        name: name,
        sku: sku,
        visibility: 'visible'
    });

    // إضافة لـ XML sitemap
    await sitemap.addProduct(id);

    // إعادة تفعيل الإعلانات
    const productData = await db.products.findOne({ salla_id: id });
    if (productData.auto_ads && productData.quantity > 0) {
        await adsManager.resumeProduct(id);
    }

    // إشعار العملاء الذين يراقبون المنتج
    await notifyBackInStock(id);

    console.log(`Product visible: ${name} (ID: ${id})`);
}

async function notifyBackInStock(productId) {
    // إشعار العملاء الذين طلبوا إشعار عند توفر المنتج
    const watchers = await db.stock_watchers.find({
        product_id: productId,
        notified: false
    });

    for (const watcher of watchers) {
        await sendEmail(watcher.email, 'back_in_stock', {
            product_name: watcher.product_name,
            product_url: watcher.product_url
        });

        await db.stock_watchers.updateOne(
            { _id: watcher._id },
            { $set: { notified: true, notified_at: new Date() } }
        );
    }
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.visible') {
            await handleProductVisible(req.body.data);
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

def handle_product_visible(product):
    product_id = product['id']
    name = product['name']

    # تحديث قاعدة البيانات
    update_product_visibility(product_id, 'visible')

    # إضافة لمحرك البحث
    add_to_search_index(product_id)

    # إضافة لـ sitemap
    add_to_sitemap(product_id)

    # إشعار العملاء
    notify_waiting_customers(product_id)

    print(f"Product visible: {name} (ID: {product_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.visible':
            handle_product_visible(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: عدم ظهور المنتج فوراً في محركات البحث

**العربية:** قد يستغرق الأمر بعض الوقت حتى يظهر المنتج في محركات البحث.

**English:** It might take some time for the product to appear in search engines.

**الحل (Solution):** قم بطلب فهرسة فورية للمحتوى الجديد:

```javascript
await requestSearchEngineIndexing(sitemapUrl);
```

### Issue 2: إشعارات غير مرغوب فيها

**العربية:** قد يتم إرسال إشعارات للعملاء الذين لم يعودوا مهتمين.

**English:** Notifications might be sent to customers who are no longer interested.

**الحل (Solution):** قم بتنظيف قائمة المشاهدين بشكل دوري:

```php
// إزالة المشاهدين الذين لم يتفاعلوا منذ 30 يوم
cleanupOldWatchers(30);
```

## SEO Keywords

**English:** Salla webhook, product.visible event, show product webhook, e-commerce product visibility, Salla product API

**العربية:** ويب هوك سلة، حدث إظهار المنتج، إشعار إظهار منتج، ظهور المنتج، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [product.created](./product.created.md) - إنشاء منتج
- [product.hidden](./product.hidden.md) - إخفاء المنتج
- [product.quantity.updated](./product.quantity.updated.md) - تحديث المخزون

---

*Last Updated: مارس 2026*
