# product.delete - حذف المنتج

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند حذف منتج من المتجر بشكل دائم أو نقله إلى الأرشيف.

**English:** This event is triggered when a product is permanently deleted from the store or archived.

## When Triggered (متى يتم إطلاقه)
- عند حذف المنتج بشكل دائم
- عند أرشفة المنتج (حسب إعدادات المتجر)
- **ملاحظة:** المنتج المحذوف قد لا يمكن استرداده

## Payload Schema (هيكل البيانات)
```json
{
  "event": "product.delete",
  "data": {
    "id": 12345,
    "name": "قميص رجالي أبيض",
    "name_en": "Men's White Shirt",
    "sku": "SHIRT-001",
    "status": "deleted",
    "deleted_at": "2024-03-25T15:00:00Z",
    "previously_active": true
  },
  "timestamp": "2024-03-25T15:00:00Z"
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

if ($data['event'] === 'product.delete') {
    $product = $data['data'];

    $productId = $product['id'];
    $sku = $product['sku'] ?? '';
    $deletedAt = $product['deleted_at'];

    // البحث عن المنتج في النظام الخارجي
    $mapping = getProductMapping($productId);

    if ($mapping) {
        $externalProductId = $mapping['external_product_id'];

        // إزالة المنتج من القنوات الإضافية
        removeFromFacebookCatalog($externalProductId);
        removeFromGoogleShopping($externalProductId);
        removeFromSearchEngine($externalProductId);

        // أرشفة البيانات بدلاً من الحذف
        archiveProductData($externalProductId, [
            'deleted_from_zid_at' => $deletedAt,
            'reason' => 'deleted_from_store'
        ]);

        // حذف أو إيقاف المنتج في نظام ERP
        deactivateProductInERP($externalProductId);

        // إزالة التطابق
        deleteProductMapping($productId);

        // تسجيل الحذف
        logProductDeletion($productId, $externalProductId, $deletedAt);
    }

    // معالجة المنتجات المتعلقة (bundle, upsell)
    handleRelatedProducts($productId);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function removeFromFacebookCatalog($externalProductId) {
    // إزالة من كتالوج فيسبوك
    $fbResult = facebookApi()->delete("/{$externalProductId}");
    return $fbResult;
}

function archiveProductData($externalProductId, $metadata) {
    // أرشفة البيانات للسجل
    $archiveData = [
        'product_id' => $externalProductId,
        'archived_at' => date('Y-m-d H:i:s'),
        'metadata' => json_encode($metadata),
        'original_data' => json_encode(getProductData($externalProductId))
    ];
    saveToArchive($archiveData);
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

async function handleProductDelete(product) {
    const { id, sku, deleted_at } = product;

    // البحث عن المنتج في قاعدة البيانات
    const mapping = await db.product_mapping.findOne({
        where: { zid_product_id: id }
    });

    if (!mapping) {
        console.log(`Product ${id} not found in mapping, skipping`);
        return;
    }

    const externalProductId = mapping.external_product_id;

    // إزالة من جميع القنوات بشكل متوازي
    const removalTasks = [
        // إزالة من فيسبوك كتالوج
        facebookCatalog.deleteProduct(externalProductId),

        // إزالة من Google Shopping
        googleShopping.deleteProduct(externalProductId),

        // إزالة من محرك البحث
        searchEngine.delete(externalProductId),

        // إيقاف في نظام ERP
        erpSystem.deactivateProduct(externalProductId),

        // أرشفة البيانات
        archiveProductData(externalProductId, {
            deleted_from_zid_at: deleted_at,
            zid_product_id: id,
            sku: sku
        })
    ];

    const results = await Promise.allSettled(removalTasks);

    // تسجيل الأخطاء
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`Failed to remove from channel ${index}:`, result.reason);
        }
    });

    // حذف التطابق
    await db.product_mapping.destroy({
        where: { zid_product_id: id }
    });

    // معالجة المنتجات المرتبطة
    await handleRelatedProducts(id, externalProductId);

    // تسجيل الحذف
    await db.deletion_log.create({
        zid_product_id: id,
        external_product_id: externalProductId,
        deleted_at: new Date(deleted_at)
    });

    console.log(`Product ${id} deleted from all channels`);
}

async function handleRelatedProducts(zidProductId, externalProductId) {
    // البحث عن المنتجات المرتبطة
    const relatedProducts = await db.product_relations.findAll({
        where: { related_to: externalProductId }
    });

    // إزالة العلاقات أو تحديثها
    for (const relation of relatedProducts) {
        await relation.destroy();
    }

    // البحث عن منتجات bundle تحتوي هذا المنتج
    const bundles = await db.product_bundles.findAll({
        where: { contains_product: externalProductId }
    });

    // تحديث أو إيقاف الـ bundles
    for (const bundle of bundles) {
        await bundle.update({ active: false });
        await notifyMerchantBundleInactivated(bundle.id);
    }
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'product.delete') {
        handleProductDelete(data.data)
            .catch(error => console.error('Product delete error:', error));
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

async def handle_product_delete(product):
    """معالجة حذف المنتج"""
    product_id = product.get('id')
    sku = product.get('sku', '')
    deleted_at = product.get('deleted_at')

    # البحث عن المنتج في النظام
    mapping = await db.product_mappings.find_one({
        'zid_product_id': product_id
    })

    if not mapping:
        print(f"Product {product_id} not found in mapping")
        return

    external_id = mapping.get('external_product_id')

    # إزالة من جميع القنوات
    tasks = []

    # إزالة من فيسبوك
    tasks.append(facebook_catalog.delete_product(external_id))

    # إزالة من Google
    tasks.append(google_shopping.delete_product(external_id))

    # إزالة من محرك البحث
    tasks.append(search_engine.delete(external_id))

    # أرشفة البيانات
    tasks.append(archive_product(external_id, {
        'deleted_from_zid_at': deleted_at,
        'zid_product_id': product_id,
        'sku': sku
    }))

    # تنفيذ جميع المهام
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # تسجيل الأخطاء
    for result in results:
        if isinstance(result, Exception):
            print(f"Removal error: {result}")

    # حذف التطابق
    await db.product_mappings.delete_one({
        'zid_product_id': product_id
    })

    # معالجة المنتجات المرتبطة
    await handle_related_products(external_id)

    # تسجيل الحذف
    await db.deletion_logs.insert_one({
        'zid_product_id': product_id,
        'external_product_id': external_id,
        'deleted_at': datetime.utcnow()
    })

async def handle_related_products(external_product_id):
    """معالجة المنتجات المرتبطة"""
    # البحث عن المنتجات المرتبطة
    relations = await db.product_relations.find({
        'related_to': external_product_id
    }).to_list(None)

    # إزالة العلاقات
    for relation in relations:
        await db.product_relations.delete_one({'_id': relation['_id']})

    # البحث عن الـ bundles
    bundles = await db.product_bundles.find({
        'contains_product': external_product_id
    }).to_list(None)

    # إيقاف الـ bundles
    for bundle in bundles:
        await db.product_bundles.update_one(
            {'_id': bundle['_id']},
            {'$set': {'active': False}}
        )

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'product.delete':
        asyncio.create_task(handle_product_delete(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: محاولة حذف منتج غير موجود
**السبب:** قد يكون المنتج لم يتم مزامنته مسبقاً
**الحل:** تحقق من وجود المنتج قبل محاولة حذفه

### مشكلة: بقاء المنتج في بعض القنوات
**السبب:** فشل إزالة المنتج من إحدى القنوات
**الحل:** استخدم retry mechanism وتحقق من نجاح الحذف من جميع القنوات

### مشكلة: فقدان البيانات نهائياً
**السبب:** الحذف الدائم يفقد البيانات
**الحل:** قم دائماً بأرشفة بيانات المنتج قبل حذفها

## Use Cases (حالات الاستخدام)
- إزالة المنتجات من كتالوجات البيع الإضافية
- تحديث محركات البحث
- أرشفة بيانات المنتجات
- معالجة المنتجات المرتبطة (bundles)
- إيقاف المنتج في أنظمة ERP
- تحديث الروابط المعطلة

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد يحتوي Payload على بيانات محدودة فقط
- يُنصح دائماً بأرشفة البيانات قبل الحذف
- تأكد من معالجة المنتجات المرتبطة

## Related Events (أحداث ذات صلة)
- `product.create` - عند إنشاء منتج جديد
- `product.update` - عند تحديث المنتج
- `product.publish` - عند نشر المنتج

## SEO Keywords
Zid webhook, product.delete, حذف المنتج, product deleted webhook, زد webhook, إزالة منتج, أرشفة منتج, حذف من المتجر, أحداث المنتجات
