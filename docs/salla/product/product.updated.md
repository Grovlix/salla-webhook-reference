# product.updated - تحديث منتج

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث تفاصيل منتج موجود. يشمل ذلك تغيير الاسم أو الوصف أو الصور أو أي تفاصيل أخرى للمنتج.

**English:** This event is triggered when details of an existing product are updated. This includes changes to name, description, images, or any other product details.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تعديل اسم أو وصف المنتج
- **English:** When product name or description is modified
- **العربية:** عند تحديث صور المنتج
- **English:** When product images are updated
- **العربية:** عند تغيير فئات المنتج
- **English:** When product categories are changed
- **العربية:** عند تعديل خيارات المنتج (مثل الألوان والأحجام)
- **English:** When product options (like colors and sizes) are modified

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.updated",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج المحدث",
    "name_en": "Updated Product Name",
    "description": "وصف محدث للمنتج",
    "description_en": "Updated product description",
    "sku": "SKU-12345",
    "price": 150.00,
    "sale_price": 120.00,
    "quantity": 45,
    "status": "active",
    "visibility": "visible",
    "categories": [
      {
        "id": 123,
        "name": "الفئة المحدثة"
      }
    ],
    "brand": {
      "id": 456,
      "name": "اسم العلامة التجارية"
    },
    "images": [
      {
        "id": 789,
        "url": "https://cdn.salla.dev/products/updated-image.jpg"
      }
    ],
    "updated_at": "2024-01-02T14:30:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-02T14:30:00Z"
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
    if ($payload['event'] === 'product.updated') {
        $product = $payload['data'];
        $productId = $product['id'];

        // الحصول على البيانات القديمة للمقارنة
        $oldProduct = getProductFromDatabase($productId);

        // معالجة التحديثات
        if ($oldProduct) {
            // تحقق من التغييرات المحددة
            if ($oldProduct['name'] !== $product['name']) {
                logChange('name', $oldProduct['name'], $product['name']);
            }

            if ($oldProduct['description'] !== $product['description']) {
                logChange('description', 'changed', 'changed');
            }

            if (count($oldProduct['images']) !== count($product['images'])) {
                syncImages($product['images']);
            }
        }

        // تحديث قاعدة البيانات المحلية
        updateProductInDatabase($product);

        // تحديث محرك البحث
        updateSearchIndex($product);

        error_log("Product updated: ID {$productId}");
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

async function handleProductUpdated(newProduct) {
    const { id, name, description, images, categories } = newProduct;

    // الحصول على المنتج القديم
    const oldProduct = await db.products.findOne({ salla_id: id });

    if (oldProduct) {
        // تتبع التغييرات
        const changes = [];

        if (oldProduct.name !== name) {
            changes.push({ field: 'name', old: oldProduct.name, new: name });
        }

        if (oldProduct.description !== description) {
            changes.push({ field: 'description', changed: true });
        }

        if (JSON.stringify(oldProduct.categories) !== JSON.stringify(categories)) {
            changes.push({ field: 'categories', changed: true });
        }

        // تسجيل التغييرات
        if (changes.length > 0) {
            await db.changelog.insert({
                product_id: id,
                changes: changes,
                timestamp: new Date()
            });
        }
    }

    // تحديث قاعدة البيانات
    await db.products.updateOne(
        { salla_id: id },
        { $set: newProduct }
    );

    // تحديث محرك البحث
    await searchEngine.update(id, {
        name,
        description,
        categories: categories.map(c => c.name)
    });

    console.log(`Product updated: ${name} (ID: ${id})`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.updated') {
            await handleProductUpdated(req.body.data);
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

def handle_product_updated(product):
    product_id = product['id']
    name = product['name']

    # الحصول على المنتج القديم
    old_product = get_product_from_db(product_id)

    if old_product:
        # تتبع التغييرات
        if old_product['name'] != name:
            log_product_change(product_id, 'name', old_product['name'], name)

        if old_product.get('description') != product.get('description'):
            log_product_change(product_id, 'description', '', 'updated')

    # تحديث قاعدة البيانات
    update_product_in_db(product)

    # تحديث محرك البحث
    update_search_index(product)

    print(f"Product updated: {name} (ID: {product_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.updated':
            handle_product_updated(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: استقبال أحداث update بدلاً من أحداث price/quantity المحددة

**العربية:** عند تغيير السعر أو الكمية، قد تستقبل هذا الحدث بدلاً من الأحداث المخصصة.

**English:** When changing price or quantity, you might receive this event instead of the specific events.

**الحل (Solution):** تحقق من الحقول التي تغيرت:

```javascript
if (oldProduct.price !== newProduct.price) {
    // معالجة تغيير السعر
}
if (oldProduct.quantity !== newProduct.quantity) {
    // معالجة تغيير الكمية
}
```

### Issue 2: تحديثات متكررة

**العربية:** قد يتم استقبال أحداث متعددة لنفس التحديث.

**English:** Multiple events might be received for the same update.

**الحل (Solution):** استخدم التخزين المؤقت لتجميع التحديثات:

```javascript
const updateCache = new Map();

function debounceProductUpdate(productId, callback) {
    if (updateCache.has(productId)) {
        clearTimeout(updateCache.get(productId));
    }
    const timeout = setTimeout(() => {
        callback();
        updateCache.delete(productId);
    }, 1000);
    updateCache.set(productId, timeout);
}
```

## SEO Keywords

**English:** Salla webhook, product.updated event, product update webhook, e-commerce product sync, Salla product API

**العربية:** ويب هوك سلة، حدث تحديث منتج، إشعار تحديث المنتج، مزامنة المنتجات، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [product.created](./product.created.md) - إنشاء منتج
- [product.deleted](./product.deleted.md) - حذف منتج
- [product.price.updated](./product.price.updated.md) - تغيير سعر المنتج
- [product.quantity.updated](./product.quantity.updated.md) - تحديث المخزون

---

*Last Updated: مارس 2026*
