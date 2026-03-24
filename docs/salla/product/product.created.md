# product.created - إنشاء منتج

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء منتج جديد في المتجر. يحتوي هذا الحدث على جميع تفاصيل المنتج الجديد بما في ذلك الاسم والوصف والسعر والمخزون.

**English:** This event is triggered when a new product is created in the store. This event contains all details of the new product including name, description, price, and inventory.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إنشاء منتج جديد من قبل التاجر
- **English:** When a merchant creates a new product
- **العربية:** عند استيراد منتجات من ملف Excel/CSV
- **English:** When importing products from Excel/CSV file
- **العربية:** عند إضافة منتج من كتالوج الموردين
- **English:** When adding a product from suppliers catalog
- **العربية:** عند نسخ منتج موجود
- **English:** When duplicating an existing product

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.created",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج",
    "name_en": "Product Name",
    "description": "وصف المنتج",
    "description_en": "Product description",
    "sku": "SKU-12345",
    "barcode": "1234567890123",
    "price": 150.00,
    "sale_price": 100.00,
    "sale_price_start": "2024-01-01T00:00:00Z",
    "sale_price_end": "2024-01-31T23:59:59Z",
    "cost_price": 80.00,
    "quantity": 50,
    "unlimited_quantity": false,
    "weight": 500,
    "weight_unit": "g",
    "status": "active",
    "visibility": "visible",
    "categories": [
      {
        "id": 123,
        "name": "الفئة الرئيسية"
      }
    ],
    "brand": {
      "id": 456,
      "name": "اسم العلامة التجارية"
    },
    "images": [
      {
        "id": 789,
        "url": "https://cdn.salla.dev/products/image.jpg"
      }
    ],
    "options": [
      {
        "id": 1,
        "name": "اللون",
        "values": ["أحمر", "أزرق", "أسود"]
      }
    ],
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `id` | Integer | معرف المنتج الفريد |
| `name` | String | اسم المنتج بالعربية |
| `name_en` | String | اسم المنتج بالإنجليزية |
| `sku` | String | رمز المخزون |
| `price` | Decimal | السعر الأساسي |
| `sale_price` | Decimal | سعر البيع (الخصم) |
| `quantity` | Integer | الكمية المتاحة في المخزون |
| `unlimited_quantity` | Boolean | مخزون غير محدود |
| `status` | String | حالة المنتج (active, inactive) |
| `visibility` | String | ظهور المنتج (visible, hidden) |
| `categories` | Array | فئات المنتج |
| `brand` | Object | العلامة التجارية للمنتج |
| `images` | Array | صور المنتج |

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
    if ($payload['event'] === 'product.created') {
        $product = $payload['data'];

        // معالجة المنتج الجديد
        $productId = $product['id'];
        $productName = $product['name'];
        $sku = $product['sku'];
        $price = $product['price'];
        $quantity = $product['quantity'];

        // مزامنة مع قاعدة البيانات المحلية
        syncProductToLocalDB($product);

        // إضافة لمحرك البحث
        addToSearchEngine($product);

        // إرسال إشعار للإدارة
        sendNewProductNotification($product);

        // تحديث المخزون في ERP
        if ($quantity > 0) {
            updateERPInventory($sku, $quantity);
        }

        error_log("Product created: {$productName} (ID: {$productId})");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function syncProductToLocalDB($product) {
    // حفظ المنتج في قاعدة البيانات المحلية
    global $pdo;

    $stmt = $pdo->prepare("
        INSERT INTO products (
            salla_id, name, name_en, sku, price,
            sale_price, quantity, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            price = VALUES(price),
            quantity = VALUES(quantity)
    ");

    $stmt->execute([
        $product['id'],
        $product['name'],
        $product['name_en'] ?? null,
        $product['sku'],
        $product['price'],
        $product['sale_price'] ?? null,
        $product['quantity'],
        $product['status']
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

async function handleProductCreated(product) {
    const { id, name, sku, price, quantity, categories, images } = product;

    // مزامنة مع قاعدة البيانات
    await db.products.upsert({
        salla_id: id,
        name: name,
        name_en: product.name_en,
        sku: sku,
        price: price,
        sale_price: product.sale_price,
        quantity: quantity,
        status: product.status,
        images: images,
        categories: categories
    });

    // إضافة لمحرك البحث
    await searchEngine.index({
        id: id,
        name: name,
        name_en: product.name_en,
        description: product.description,
        price: price,
        categories: categories.map(c => c.name)
    });

    // إرسال إشعار Slack
    await slack.send({
        text: `منتج جديد: ${name}`,
        attachments: [{
            title: name,
            fields: [
                { title: 'SKU', value: sku, short: true },
                { title: 'السعر', value: price + ' SAR', short: true },
                { title: 'المخزون', value: quantity, short: true }
            ]
        }]
    });

    // تحديث نظام ERP
    if (quantity > 0) {
        await erp.syncProduct(product);
    }

    console.log(`Product created: ${name} (ID: ${id})`);
}

// Express.js endpoint
app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.created') {
            await handleProductCreated(req.body.data);
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

def handle_product_created(product):
    product_id = product['id']
    name = product['name']
    sku = product['sku']
    price = product['price']
    quantity = product['quantity']

    # مزامنة مع قاعدة البيانات
    sync_to_database(product)

    # إضافة لمحرك البحث
    add_to_search_index(product)

    # إرسال إشعار
    send_notification(f"منتج جديد: {name}")

    print(f"Product created: {name} (ID: {product_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.created':
            handle_product_created(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: صور المنتج غير متاحة فوراً

**العربية:** قد لا تكون صور المنتج جاهزة عند استقبال الحدث.

**English:** Product images might not be ready when the event is received.

**الحل (Solution):** انتظر بضع ثوانٍ قبل تحميل الصور:

```javascript
setTimeout(async () => {
    await downloadProductImages(product.images);
}, 5000);
```

### Issue 2: بيانات المنتج غير مكتملة

**العربية:** قد تكون بعض الحقول اختيارية وغير موجودة.

**English:** Some fields might be optional and not present.

**الحل (Solution):** تحقق دائماً من وجود الحقول:

```php
$description = $product['description'] ?? '';
$salePrice = $product['sale_price'] ?? null;
```

### Issue 3: تكرار إنشاء المنتج

**العربية:** قد يتم استقبال نفس الحدث مرتين.

**English:** The same event might be received twice.

**الحل (Solution):** استخدم `X-Salla-Delivery` header:

```php
$deliveryId = $_SERVER['HTTP_X_SALLA_DELIVERY'] ?? '';
if (isAlreadyProcessed($deliveryId)) {
    http_response_code(200);
    exit;
}
```

## SEO Keywords

**English:** Salla webhook, product.created event, new product webhook, e-commerce product sync, Salla product API

**العربية:** ويب هوك سلة، حدث إنشاء منتج، إشعار منتج جديد، مزامنة المنتجات، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [product.updated](./product.updated.md) - تحديث منتج
- [product.deleted](./product.deleted.md) - حذف منتج
- [product.price.updated](./product.price.updated.md) - تغيير سعر المنتج
- [product.quantity.updated](./product.quantity.updated.md) - تحديث المخزون

---

*Last Updated: مارس 2026*
