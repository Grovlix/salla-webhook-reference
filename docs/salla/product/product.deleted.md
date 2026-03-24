# product.deleted - حذف منتج

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف منتج من المتجر بشكل دائم. يحتوي هذا الحدث على معرف المنتج المحذوف وبعض البيانات الأساسية.

**English:** This event is triggered when a product is permanently deleted from the store. This event contains the deleted product ID and some basic data.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند حذف منتج من قبل التاجر
- **English:** When a merchant deletes a product
- **العربية:** عند حذف منتجات متعددة دفعة واحدة
- **English:** When deleting multiple products at once
- **العربية:** عند حذف المنتجات غير النشطة تلقائياً
- **English:** When automatically deleting inactive products

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.deleted",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج المحذوف",
    "sku": "SKU-12345",
    "deleted_at": "2024-01-02T10:00:00Z"
  },
  "created_at": "2024-01-02T10:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `id` | Integer | معرف المنتج المحذوف |
| `name` | String | اسم المنتج (للأرشفة) |
| `sku` | String | رمز المخزون |
| `deleted_at` | DateTime | تاريخ ووقت الحذف |

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
    if ($payload['event'] === 'product.deleted') {
        $product = $payload['data'];
        $productId = $product['id'];
        $productName = $product['name'];
        $sku = $product['sku'];

        // أرشفة المنتج قبل الحذف النهائي
        archiveProduct($productId, $product);

        // حذف من قاعدة البيانات المحلية
        deleteProductFromDatabase($productId);

        // إزالة من محرك البحث
        removeFromSearchEngine($productId);

        // حذف الصور المخزنة محلياً
        deleteLocalProductImages($productId);

        // إرسال إشعار للإدارة
        sendProductDeletedNotification($productName, $sku);

        error_log("Product deleted: {$productName} (ID: {$productId})");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function archiveProduct($productId, $productData) {
    // أرشفة بيانات المنتج للسجلات
    global $pdo;

    $stmt = $pdo->prepare("
        INSERT INTO products_archive (
            salla_id, name, sku, archived_data, archived_at
        ) VALUES (?, ?, ?, ?, NOW())
    ");

    $stmt->execute([
        $productId,
        $productData['name'],
        $productData['sku'],
        json_encode($productData)
    ]);
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

async function handleProductDeleted(product) {
    const { id, name, sku } = product;

    // الحصول على المنتج من قاعدة البيانات للأرشفة
    const existingProduct = await db.products.findOne({ salla_id: id });

    if (existingProduct) {
        // أرشفة المنتج
        await db.products_archive.insert({
            ...existingProduct,
            archived_at: new Date(),
            deletion_reason: 'webhook_deleted'
        });
    }

    // حذف من قاعدة البيانات
    await db.products.deleteOne({ salla_id: id });

    // إزالة من محرك البحث
    await searchEngine.delete(id);

    // حذف الصور المخزنة محلياً
    await deleteLocalImages(id);

    // إرسال إشعار Slack
    await slack.send({
        text: `تم حذف منتج: ${name}`,
        attachments: [{
            title: name,
            fields: [
                { title: 'SKU', value: sku, short: true },
                { title: 'معرف المنتج', value: id.toString(), short: true }
            ],
            color: 'danger'
        }]
    });

    console.log(`Product deleted: ${name} (ID: ${id})`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.deleted') {
            await handleProductDeleted(req.body.data);
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

def handle_product_deleted(product):
    product_id = product['id']
    name = product['name']
    sku = product['sku']

    # أرشفة المنتج
    archive_product(product_id, product)

    # حذف من قاعدة البيانات
    delete_product_from_db(product_id)

    # إزالة من محرك البحث
    remove_from_search_index(product_id)

    # إرسال إشعار
    send_notification(f"تم حذف المنتج: {name}")

    print(f"Product deleted: {name} (ID: {product_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.deleted':
            handle_product_deleted(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: فقدان البيانات بشكل دائم

**العربية:** قد تحتاج للاحتفاظ ببيانات المنتج المحذوف للتقارير أو التحليلات.

**English:** You might need to keep deleted product data for reports or analytics.

**الحل (Solution):** قم دائماً بأرشفة المنتج قبل حذفه:

```php
function archiveProduct($productId) {
    $product = getProductFromDB($productId);
    saveToArchive($product);
    deleteFromDB($productId);
}
```

### Issue 2: روابط مكسورة في محرك البحث

**العربية:** قد تظهر روابط لمنتجات محذوفة في نتائج البحث.

**English:** Deleted products might still appear in search results.

**الحل (Solution):** قم بإزالة المنتج فوراً من محرك البحث:

```javascript
await searchEngine.delete(productId);
```

### Issue 3: حذف غير مقصود

**العربية:** قد يتم حذف المنتج عن طريق الخطأ.

**English:** Products might be deleted accidentally.

**الحل (Solution):** احتفظ بنسخة احتياطية لفترة زمنية محددة:

```javascript
await db.deleted_products.insert({
    ...product,
    deleted_at: new Date(),
    auto_delete_after: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 يوم
});
```

## Best Practices (أفضل الممارسات)

- **العربية:** قم دائماً بأرشفة بيانات المنتج قبل حذفها
- **English:** Always archive product data before deletion
- **العربية:** أزل المنتج من جميع الأنظمة المتصلة (محركات البحث، ERP)
- **English:** Remove product from all connected systems (search engines, ERP)
- **العربية:** احتفظ بسجل للمنتجات المحذوفة للتدقيق
- **English:** Keep a log of deleted products for auditing
- **العربية:** أرسل إشعار للإدارة عند حذف منتج
- **English:** Send notification to admin when a product is deleted

## SEO Keywords

**English:** Salla webhook, product.deleted event, product deletion webhook, e-commerce product management, Salla product API

**العربية:** ويب هوك سلة، حدث حذف منتج، إشعار حذف المنتج، إدارة المنتجات، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [product.created](./product.created.md) - إنشاء منتج
- [product.updated](./product.updated.md) - تحديث منتج
- [product.hidden](./product.hidden.md) - إخفاء المنتج (بديل للحذف)

---

*Last Updated: مارس 2026*
