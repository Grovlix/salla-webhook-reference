# product.publish - نشر المنتج

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند نشر منتج وجعله متاحاً للبيع في المتجر، سواء كان نشراً جديداً أو إعادة نشر منتج كان مسودة.

**English:** This event is triggered when a product is published and made available for sale in the store, whether it's a new publication or republishing a draft.

## When Triggered (متى يتم إطلاقه)
- عند تحويل منتج من مسودة (draft) إلى منشور (published)
- عند إنشاء منتج جديد مباشرة بحالة منشور
- عند إعادة نشر منتج كان غير نشط
- **ملاحظة:** هذا الحدث يضمن أن المنتج جاهز للبيع

## Payload Schema (هيكل البيانات)
```json
{
  "event": "product.publish",
  "data": {
    "id": 12345,
    "name": "قميص رجالي أبيض",
    "name_en": "Men's White Shirt",
    "description": "قميص قطني عالي الجودة",
    "description_en": "High quality cotton shirt",
    "sku": "SHIRT-001",
    "status": "published",
    "is_active": true,
    "is_visible": true,
    "url": "https://store.zid.sa/products/white-shirt",
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
    "seo": {
      "meta_title": "قميص رجالي أبيض - متجري",
      "meta_description": "اشتري أفضل القمصان الرجالية البيضاء",
      "slug": "white-shirt"
    },
    "published_at": "2024-03-25T14:00:00Z",
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-25T14:00:00Z"
  },
  "timestamp": "2024-03-25T14:00:00Z"
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

if ($data['event'] === 'product.publish') {
    $product = $data['data'];

    $productId = $product['id'];
    $name = $product['name'];
    $url = $product['url'] ?? '';
    $images = $product['images'] ?? [];
    $price = $product['price'];

    // نشر المنتج على قنوات البيع الإضافية
    publishToFacebookCatalog($productId, $product);
    publishToGoogleShopping($productId, $product);
    publishToInstagram($productId, $product);

    // إضافة المنتج لمحركات البحث
    addToSearchEngine($productId, [
        'name' => $name,
        'description' => $product['description'] ?? '',
        'price' => $price,
        'images' => array_column($images, 'url'),
        'url' => $url
    ]);

    // إرسال إشعار للعملاء المهتمين (إذا كان المنتج متوقعاً)
    notifyInterestedCustomers($productId, $name);

    // تحديث نظام إدارة المستودعات
    syncToWarehouseSystem($productId, $product);

    // إنشاء أو تحديث قاعدة بيانات المنتجات
    updateProductDatabase($productId, $product);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function publishToFacebookCatalog($productId, $product) {
    // نشر المنتج في كتالوج فيسبوك
    $fbData = [
        'retailer_id' => $productId,
        'name' => $product['name'],
        'description' => $product['description'] ?? '',
        'price' => $product['price'] . ' ' . $product['currency'],
        'link' => $product['url'],
        'image_url' => $product['images'][0]['url'] ?? '',
        'availability' => 'in stock'
    ];

    // إرسال إلى Facebook Commerce API
    // ...
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

async function handleProductPublish(product) {
    const { id, name, url, images, price, currency, description } = product;

    // نشر على قنوات متعددة بشكل متوازي
    const publishPromises = [
        // كتالوج فيسبوك
        facebookCatalog.addProduct({
            retailer_id: id,
            name: name,
            description: description,
            price: `${price} ${currency}`,
            link: url,
            image_url: images[0]?.url,
            availability: 'in stock'
        }),

        // Google Shopping
        googleShopping.addProduct({
            id: id,
            title: name,
            description: description,
            price: { value: price, currency: currency },
            link: url,
            image_link: images[0]?.url
        }),

        // TikTok Catalog
        tiktokCatalog.addProduct({
            product_id: id,
            name: name,
            description: description,
            price: price,
            currency: currency,
            image_url: images[0]?.url,
            product_url: url
        }),

        // محركات البحث
        searchEngine.index({
            id: id,
            name: name,
            description: description,
            price: price,
            images: images.map(img => img.url),
            url: url
        })
    ];

    // تنفيذ جميع عمليات النشر
    const results = await Promise.allSettled(publishPromises);

    // تسجيل النتائج
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`Failed to publish to channel ${index}:`, result.reason);
        }
    });

    // إشعار العملاء المهتمين
    await notifyWaitingListCustomers(id, {
        productName: name,
        productUrl: url,
        price: price
    });

    // تحديث نظام المستودعات
    await warehouse.syncProduct(id, product);

    console.log(`Product ${id} published to all channels`);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'product.publish') {
        handleProductPublish(data.data)
            .catch(error => console.error('Product publish error:', error));
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
import asyncio

app = Flask(__name__)

async def publish_to_channels(product):
    """نشر المنتج على جميع القنوات"""
    product_id = product.get('id')
    name = product.get('name')
    description = product.get('description', '')
    price = product.get('price')
    currency = product.get('currency')
    url = product.get('url', '')
    images = product.get('images', [])

    # تجميع مهام النشر
    tasks = []

    # فيسبوك كتالوج
    tasks.append(facebook_catalog.add_product({
        'retailer_id': product_id,
        'name': name,
        'description': description,
        'price': f'{price} {currency}',
        'link': url,
        'image_url': images[0]['url'] if images else ''
    }))

    # Google Shopping
    tasks.append(google_shopping.add_product({
        'id': product_id,
        'title': name,
        'description': description,
        'price': {'value': price, 'currency': currency},
        'link': url,
        'image_link': images[0]['url'] if images else ''
    }))

    # محرك البحث
    tasks.append(search_engine.index({
        'id': product_id,
        'name': name,
        'description': description,
        'price': price,
        'url': url
    }))

    # تنفيذ جميع المهام
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # تسجيل الأخطاء
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"Channel {i} publish failed: {result}")

async def handle_product_publish(product):
    """معالجة نشر المنتج"""
    product_id = product.get('id')

    # النشر على القنوات
    await publish_to_channels(product)

    # إشعار قائمة الانتظار
    await notify_waiting_list(product_id, {
        'product_name': product.get('name'),
        'product_url': product.get('url'),
        'price': product.get('price')
    })

    # تحديث المستودعات
    await warehouse.sync_product(product_id, product)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'product.publish':
        asyncio.create_task(handle_product_publish(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: المنتج لم يظهر على القنوات الإضافية
**السبب:** قد يكون هناك خطأ في الاتصال أو البيانات غير مكتملة
**الحل:** تحقق من وجود جميع الحقول المطلوبة (الاسم، السعر، الصورة، الرابط)

### مشكلة: نشر مزدوج للمنتج
**السبب:** قد يتم استلام كل من `product.create` و `product.publish` لمنتج جديد
**الحل:** استخدم idempotency key وتحقق من عدم وجود المنتج قبل النشر

### مشكلة: الصور غير جاهزة
**السبب:** قد يتم نشر المنتج قبل رفع جميع الصور
**الحل:** تحقق من وجود مصفوفة `images` وعددها قبل النشر

## Use Cases (حالات الاستخدام)
- نشر المنتجات على كتالوج فيسبوك
- إضافة المنتجات لـ Google Shopping
- مزامنة مع منصات السوشيال ميديا
- تحديث محركات البحث
- إشعار العملاء في قائمة الانتظار
- تفعيل المنتج في أنظمة ERP
- إنشاء حملات إعلانية تلقائية

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- استخدم هذا الحدث للتأكد من أن المنتج جاهز للبيع بالكامل
- قد يتم إطلاقه مع `product.create` عند إنشاء منتج منشور مباشرة

## Related Events (أحداث ذات صلة)
- `product.create` - عند إنشاء المنتج
- `product.update` - عند تحديث المنتج
- `product.delete` - عند حذف المنتج

## SEO Keywords
Zid webhook, product.publish, نشر المنتج, product published webhook, زد webhook, تفعيل المنتج, إطلاق منتج, نشر على فيسبوك, أحداث المنتجات
