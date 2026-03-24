# product.update - تحديث المنتج

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند تحديث بيانات منتج موجود، مثل تغيير السعر، الوصف، الصور، أو أي تفاصيل أخرى.

**English:** This event is triggered when an existing product's details are updated, such as price changes, description updates, image modifications, or any other details.

## When Triggered (متى يتم إطلاقه)
- عند تعديل اسم المنتج أو وصفه
- عند تغيير سعر المنتج
- عند إضافة أو حذف صور المنتج
- عند تحديث المخزون أو الكمية
- عند تعديل خيارات المنتج (variants)
- عند تغيير فئة المنتج
- عند إضافة أو حذف وسوم (tags)

## Payload Schema (هيكل البيانات)
```json
{
  "event": "product.update",
  "data": {
    "id": 12345,
    "name": "قميص رجالي أبيض",
    "name_en": "Men's White Shirt",
    "description": "وصف محدث للمنتج",
    "description_en": "Updated product description",
    "sku": "SHIRT-001",
    "status": "published",
    "is_active": true,
    "price": 159.00,
    "previous_price": 149.00,
    "compare_at_price": 199.00,
    "cost_price": 80.00,
    "currency": "SAR",
    "quantity": 45,
    "weight": 500,
    "weight_unit": "gram",
    "categories": [
      {
        "id": 123,
        "name": "ملابس رجالية"
      },
      {
        "id": 456,
        "name": "أفضل البائعين"
      }
    ],
    "images": [
      {
        "id": 789,
        "url": "https://cdn.zid.sa/product/updated-image.jpg",
        "position": 1,
        "alt": "صورة محدثة"
      }
    ],
    "variants": [
      {
        "id": 456,
        "name": "XL - أبيض",
        "price": 159.00,
        "quantity": 8,
        "sku": "SHIRT-001-XL-W",
        "options": {
          "size": "XL",
          "color": "أبيض"
        }
      }
    ],
    "tags": ["قمصان", "رجالي", "قطن", "جديد"],
    "created_at": "2024-03-20T10:00:00Z",
    "updated_at": "2024-03-25T12:30:00Z"
  },
  "timestamp": "2024-03-25T12:30:00Z"
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

if ($data['event'] === 'product.update') {
    $product = $data['data'];

    $productId = $product['id'];
    $name = $product['name'];
    $price = $product['price'];
    $previousPrice = $product['previous_price'] ?? null;
    $quantity = $product['quantity'];
    $status = $product['status'];

    // البحث عن المنتج في النظام الخارجي
    $mapping = getProductMapping($productId);

    if ($mapping) {
        $externalProductId = $mapping['external_product_id'];

        // تحديث المنتج في النظام الخارجي
        updateProductInERP($externalProductId, [
            'name_ar' => $name,
            'price' => $price,
            'quantity' => $quantity,
            'status' => $status,
            'images' => array_column($product['images'] ?? [], 'url'),
            'categories' => array_column($product['categories'] ?? [], 'id')
        ]);

        // تسجيل تغيير السعر
        if ($previousPrice && $previousPrice != $price) {
            logPriceChange($productId, $previousPrice, $price);
        }

        // تحديث المخزون إذا تغير
        updateInventoryInWarehouse($externalProductId, $quantity);

    } else {
        // المنتج غير موجود في النظام الخارجي - إنشاؤه
        $externalProductId = addProductToERP([
            'zid_id' => $productId,
            'name_ar' => $name,
            'price' => $price,
            'quantity' => $quantity
        ]);
        saveProductMapping($productId, $externalProductId);
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

async function handleProductUpdate(product) {
    const { id, price, previous_price, quantity, status, images, categories } = product;

    // البحث عن المنتج في قاعدة البيانات
    const mapping = await db.product_mapping.findOne({
        where: { zid_product_id: id }
    });

    if (!mapping) {
        // المنتج غير موجود - معالجته كمنتج جديد
        return handleProductCreate(product);
    }

    const updateData = {
        name: { ar: product.name, en: product.name_en },
        price: price,
        quantity: quantity,
        status: status
    };

    // تحديث الصور إذا كانت موجودة
    if (images && images.length > 0) {
        updateData.images = images.map(img => img.url);
    }

    // تحديث الفئات
    if (categories) {
        updateData.category_ids = categories.map(cat => cat.id);
    }

    // تحديث في النظام الخارجي
    await externalSystem.updateProduct(mapping.external_product_id, updateData);

    // تسجيل تغيير السعر
    if (previous_price && previous_price !== price) {
        await db.price_history.create({
            product_id: id,
            old_price: previous_price,
            new_price: price,
            changed_at: new Date()
        });
    }

    // تحديث المخزون في المستودعات
    if (quantity !== undefined) {
        await inventoryService.updateStock(mapping.external_product_id, quantity);
    }

    // تحديث المتغيرات
    if (product.variants) {
        for (const variant of product.variants) {
            await syncVariant(id, variant);
        }
    }

    console.log(`Product ${id} updated successfully`);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'product.update') {
        handleProductUpdate(data.data)
            .catch(error => console.error('Product update error:', error));
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

async def handle_product_update(product):
    """معالجة تحديث المنتج"""
    product_id = product.get('id')

    # البحث عن المنتج في النظام
    mapping = await db.product_mappings.find_one({
        'zid_product_id': product_id
    })

    if not mapping:
        # المنتج غير موجود - معالجته كمنتج جديد
        return await handle_product_create(product)

    external_id = mapping.get('external_product_id')

    # تجهيز بيانات التحديث
    update_data = {
        'name_ar': product.get('name'),
        'name_en': product.get('name_en', ''),
        'price': product.get('price'),
        'quantity': product.get('quantity'),
        'status': product.get('status')
    }

    # تحديث الصور
    images = product.get('images', [])
    if images:
        update_data['image_urls'] = [img['url'] for img in images]

    # تحديث الفئات
    categories = product.get('categories', [])
    if categories:
        update_data['category_ids'] = [cat['id'] for cat in categories]

    # تنفيذ التحديث
    await erp_client.update_product(external_id, update_data)

    # تسجيل تغيير السعر
    previous_price = product.get('previous_price')
    current_price = product.get('price')

    if previous_price and previous_price != current_price:
        await db.price_history.insert_one({
            'product_id': product_id,
            'old_price': previous_price,
            'new_price': current_price,
            'changed_at': datetime.utcnow()
        })

    # تحديث المخزون
    quantity = product.get('quantity')
    if quantity is not None:
        await inventory.update_stock(external_id, quantity)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'product.update':
        asyncio.create_task(handle_product_update(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: استلام العديد من تحديثات المنتج في وقت قصير
**السبب:** التاجر قد يقوم بتعديلات متعددة على المنتج
**الحل:** استخدم debouncing أو اجمع التحديثات خلال فترة زمنية قصيرة

### مشكلة: المنتج غير موجود في النظام الخارجي
**السبب:** قد يكون المنتج قد تم حذفه أو لم تتم مزامنته سابقاً
**الحل:** تعامل مع الحالة كإنشاء منتج جديد أو احتفظ بسجل للمنتجات المحذوفة

### مشكلة: تغييرات غير متوقعة في السعر
**السبب:** التاجر قد يقوم بعرض خاص أو تغيير مؤقت
**الحل:** احتفظ بسجل تاريخي للأسعار لتتبع التغييرات

## Use Cases (حالات الاستخدام)
- مزامنة تحديثات الأسعار مع أنظمة البيع
- تحديث مخزون المستودعات
- مزامنة الصور والوصف مع قنوات البيع الإضافية
- تتبع تغييرات الأسعار لغرض التحليل
- تحديث محركات البحث وقواعد البيانات
- إشعار الفريق بالتغييرات المهمة

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد لا يحتوي Payload على جميع حقول المنتج، فقط المتغيرات
- تحقق من وجود `previous_price` لتتبع تغييرات الأسعار

## Related Events (أحداث ذات صلة)
- `product.create` - عند إنشاء منتج جديد
- `product.publish` - عند نشر المنتج
- `product.delete` - عند حذف المنتج

## SEO Keywords
Zid webhook, product.update, تحديث المنتج, product updated webhook, زد webhook, تعديل منتج, تغيير سعر المنتج, تحديث المخزون, أحداث المنتجات
