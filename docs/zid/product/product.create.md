# product.create - إنشاء منتج جديد

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند إنشاء منتج جديد في المتجر، بغض النظر عن حالته (منشور أو مسودة).

**English:** This event is triggered when a new product is created in the store, regardless of its status (published or draft).

## When Triggered (متى يتم إطلاقه)
- عند إنشاء منتج جديد من قبل التاجر
- عند استيراد منتجات من ملف خارجي
- عند إنشاء منتج عبر واجهة برمجة التطبيقات
- **ملاحظة:** يتم إطلاقه سواء كان المنتج منشوراً أو مسودة

## Payload Schema (هيكل البيانات)
```json
{
  "event": "product.create",
  "data": {
    "id": 12345,
    "name": "قميص رجالي أبيض",
    "name_en": "Men's White Shirt",
    "description": "قميص قطني عالي الجودة",
    "description_en": "High quality cotton shirt",
    "sku": "SHIRT-001",
    "status": "published",
    "is_active": true,
    "price": 149.00,
    "compare_at_price": 199.00,
    "cost_price": 80.00,
    "currency": "SAR",
    "quantity": 50,
    "weight": 500,
    "weight_unit": "gram",
    "categories": [
      {
        "id": 123,
        "name": "ملابس رجالية"
      }
    ],
    "images": [
      {
        "id": 789,
        "url": "https://cdn.zid.sa/product/image.jpg",
        "position": 1,
        "alt": "صورة المنتج"
      }
    ],
    "variants": [
      {
        "id": 456,
        "name": "XL - أبيض",
        "price": 149.00,
        "quantity": 10,
        "sku": "SHIRT-001-XL-W",
        "options": {
          "size": "XL",
          "color": "أبيض"
        }
      }
    ],
    "tags": ["قمصان", "رجالي", "قطن"],
    "created_at": "2024-03-25T10:00:00Z",
    "updated_at": "2024-03-25T10:00:00Z"
  },
  "timestamp": "2024-03-25T10:00:00Z"
}
```

## Code Examples (أمثلة البرمجة)

### PHP
```php
<?php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_ZID_SIGNATURE'] ?? '';
$secret = 'your_webhook_secret';

if (!verifyWebhookSignature($payload, $signature, $secret)) {
    http_response_code(403);
    exit('Invalid signature');
}

$data = json_decode($payload, true);

if ($data['event'] === 'product.create') {
    $product = $data['data'];

    $productId = $product['id'];
    $name = $product['name'];
    $nameEn = $product['name_en'] ?? '';
    $price = $product['price'];
    $sku = $product['sku'] ?? '';
    $status = $product['status'];
    $images = $product['images'] ?? [];
    $categories = $product['categories'] ?? [];

    // إضافة المنتج إلى نظام خارجي (مثل ERP أو CRM)
    $externalProductId = addProductToERP([
        'zid_id' => $productId,
        'name_ar' => $name,
        'name_en' => $nameEn,
        'price' => $price,
        'sku' => $sku,
        'status' => $status,
        'images' => array_column($images, 'url'),
        'categories' => array_column($categories, 'id')
    ]);

    // حفظ المعلومات في قاعدة البيانات
    saveProductMapping([
        'zid_product_id' => $productId,
        'external_product_id' => $externalProductId,
        'synced_at' => date('Y-m-d H:i:s')
    ]);

    // إذا كان المنتج منشوراً، أرسله إلى قنوات البيع الإضافية
    if ($status === 'published') {
        publishToAdditionalChannels($productId, $product);
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
}
```

### JavaScript (Node.js)
```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

async function handleProductCreate(product) {
    const { id, name, name_en, price, sku, status, images, categories } = product;

    // إضافة المنتج إلى النظام الخارجي
    const externalProduct = await externalSystem.createProduct({
        external_id: id,
        name: { ar: name, en: name_en },
        price: price,
        sku: sku,
        images: images.map(img => img.url),
        category_ids: categories.map(cat => cat.id),
        status: status
    });

    // حفظ العلاقة بين الأنظمة
    await db.product_mapping.create({
        zid_product_id: id,
        external_product_id: externalProduct.id,
        synced_at: new Date()
    });

    // مزامنة المخزون
    if (product.variants && product.variants.length > 0) {
        await syncProductVariants(id, product.variants);
    }

    // نشر على قنوات إضافية إذا كان منشوراً
    if (status === 'published') {
        await publishToChannels(id, product);
    }

    console.log(`Product ${id} created successfully`);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'product.create') {
        handleProductCreate(data.data)
            .catch(error => console.error('Product create error:', error));
    }

    res.status(200).json({ received: true });
});
```

### Python
```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

async def handle_product_create(product):
    """معالجة إنشاء منتج جديد"""
    product_id = product.get('id')
    name = product.get('name')
    name_en = product.get('name_en', '')
    price = product.get('price')
    sku = product.get('sku', '')
    status = product.get('status')
    images = product.get('images', [])
    categories = product.get('categories', [])

    # إضافة إلى النظام الخارجي
    external_product = await erp_client.create_product({
        'external_id': product_id,
        'name_ar': name,
        'name_en': name_en,
        'price': price,
        'sku': sku,
        'status': status,
        'image_urls': [img['url'] for img in images],
        'category_ids': [cat['id'] for cat in categories]
    })

    # حفظ التطابق
    await db.product_mappings.insert_one({
        'zid_product_id': product_id,
        'external_product_id': external_product['id'],
        'synced_at': datetime.utcnow()
    })

    # مزامنة المتغيرات (variants)
    variants = product.get('variants', [])
    for variant in variants:
        await sync_variant(product_id, variant)

    # نشر على قنوات إضافية
    if status == 'published':
        await publish_to_channels(product_id, product)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'product.create':
        asyncio.create_task(handle_product_create(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: المنتج تم إنشاؤه ولكنه غير متاح للبيع
**السبب:** المنتج قد يكون بحالة `draft` وليس `published`
**الحل:** تحقق من حقل `status` قبل معالجة المنتج للبيع

### مشكلة: صور المنتج غير مكتملة
**السبب:** صور المنتج قد يتم تحميلها بشكل غير متزامن
**الحل:** استخدم `product.publish` للحصول على البيانات النهائية

### مشكلة: SKU مكرر
**السبب:** قد يكون المنتج يستخدم SKU موجود بالفعل
**الحل:** تحقق من تفرد SKU قبل إضافته للنظام الخارجي

## Use Cases (حالات الاستخدام)
- مزامنة المنتجات مع نظام ERP
- إضافة المنتجات لمنصات تسوق إضافية
- تحديث محرك البحث أو قاعدة بيانات المنتجات
- إرسال إشعارات للإدارة عند إضافة منتج جديد
- إنشاء بطاقات منتجات تلقائياً
- تحديث جرد المخزون

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- يتم إطلاقه للمنتجات المنشورة والمسودة على حد سواء
- قد يكون من الأفضل استخدام `product.publish` لبعض حالات الاستخدام

## Related Events (أحداث ذات صلة)
- `product.update` - عند تحديث بيانات المنتج
- `product.publish` - عند نشر المنتج لأول مرة
- `product.delete` - عند حذف المنتج

## SEO Keywords
Zid webhook, product.create, إنشاء منتج, product created webhook, زد webhook, منتج جديد, إضافة منتج, أحداث المنتجات, مزامنة المنتجات
