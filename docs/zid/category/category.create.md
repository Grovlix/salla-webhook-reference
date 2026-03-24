# category.create - إنشاء فئة جديدة

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند إنشاء فئة منتجات جديدة في المتجر.

**English:** This event is triggered when a new product category is created in the store.

## When Triggered (متى يتم إطلاقه)
- عند إنشاء فئة منتجات جديدة من قبل التاجر
- عند استيراد فئات من ملف خارجي
- عند إنشاء فئة عبر واجهة برمجة التطبيقات

## Payload Schema (هيكل البيانات)
```json
{
  "event": "category.create",
  "data": {
    "id": 123,
    "name": "ملابس رجالية",
    "name_en": "Men's Clothing",
    "slug": "mens-clothing",
    "description": "جميع الملابس الرجالية",
    "description_en": "All men's clothing",
    "parent_id": null,
    "image": "https://cdn.zid.sa/category/image.jpg",
    "icon": null,
    "is_active": true,
    "is_visible": true,
    "sort_order": 1,
    "products_count": 0,
    "created_at": "2024-03-25T20:00:00Z",
    "updated_at": "2024-03-25T20:00:00Z"
  },
  "timestamp": "2024-03-25T20:00:00Z"
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

if ($data['event'] === 'category.create') {
    $category = $data['data'];

    $categoryId = $category['id'];
    $name = $category['name'];
    $nameEn = $category['name_en'] ?? '';
    $slug = $category['slug'] ?? '';
    $parentId = $category['parent_id'] ?? null;
    $description = $category['description'] ?? '';
    $image = $category['image'] ?? '';

    // إضافة الفئة للنظام الخارجي
    $externalCategoryId = addCategoryToERP([
        'zid_id' => $categoryId,
        'name_ar' => $name,
        'name_en' => $nameEn,
        'slug' => $slug,
        'parent_id' => $parentId,
        'description' => $description,
        'image' => $image
    ]);

    // حفظ التطابق
    saveCategoryMapping($categoryId, $externalCategoryId);

    // إضافة لقوائم التصفح
    addToNavigationMenu([
        'category_id' => $categoryId,
        'name' => $name,
        'url' => '/category/' . $slug
    ]);

    // إنشاء صفحة الفئة في محرك البحث
    createCategoryPage([
        'id' => $categoryId,
        'title_ar' => $name,
        'title_en' => $nameEn,
        'description' => $description,
        'slug' => $slug
    ]);

    // إضافة للتصنيف في نظام التحليلات
    addToAnalyticsCategories([
        'category_id' => $categoryId,
        'name' => $name,
        'parent_id' => $parentId
    ]);

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

async function handleCategoryCreate(category) {
    const { id, name, name_en, slug, parent_id, description, image } = category;

    // إضافة للنظام الخارجي
    const externalCategory = await externalSystem.createCategory({
        external_id: id,
        name: { ar: name, en: name_en },
        slug: slug,
        parent_id: parent_id,
        description: description,
        image: image
    });

    // حفظ التطابق
    await db.category_mapping.create({
        zid_category_id: id,
        external_category_id: externalCategory.id
    });

    // إضافة لقائمة التنقل
    await navigationMenu.add({
        type: 'category',
        category_id: id,
        name: name,
        url: `/category/${slug}`
    });

    // إنشاء صفحة في محرك البحث
    await searchEngine.indexCategory({
        id: id,
        title: { ar: name, en: name_en },
        description: description,
        url: `/category/${slug}`
    });

    // إضافة للتحليلات
    await analytics.createCategory({
        category_id: id,
        name: name,
        parent_id: parent_id
    });

    console.log(`Category ${id} created and synced`);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'category.create') {
        handleCategoryCreate(data.data)
            .catch(error => console.error('Category create error:', error));
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

async def handle_category_create(category):
    """معالجة إنشاء فئة جديدة"""
    category_id = category.get('id')
    name = category.get('name')
    name_en = category.get('name_en', '')
    slug = category.get('slug', '')
    parent_id = category.get('parent_id')
    description = category.get('description', '')
    image = category.get('image', '')

    # إضافة للنظام الخارجي
    external_category = await erp.create_category({
        'external_id': category_id,
        'name_ar': name,
        'name_en': name_en,
        'slug': slug,
        'parent_id': parent_id,
        'description': description,
        'image': image
    })

    # حفظ التطابق
    await db.category_mappings.insert_one({
        'zid_category_id': category_id,
        'external_category_id': external_category['id']
    })

    # إضافة لقائمة التنقل
    await navigation.add({
        'type': 'category',
        'category_id': category_id,
        'name': name,
        'url': f'/category/{slug}'
    })

    # فهرسة في محرك البحث
    await search.index_category({
        'id': category_id,
        'title_ar': name,
        'title_en': name_en,
        'description': description,
        'url': f'/category/{slug}'
    })

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'category.create':
        asyncio.create_task(handle_category_create(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: الفئة الرئيسية غير موجودة
**الحل:** تحقق من وجود `parent_id` قبل إضافة الفئة الفرعية

### مشكلة: Slug مكرر
**الحل:** استخدم معرف فريد مع Slug لتجنب التضارب

### مشكلة: الصورة غير مكتملة
**الحل:** تحقق من وجود رابط الصورة قبل استخدامه

## Use Cases (حالات الاستخدام)
- مزامنة الفئات مع ERP
- إنشاء قوائم التنقل
- فهرسة في محركات البحث
- إنشاء صفحات فئات
- تحليل المنتجات حسب الفئة

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد تكون الفئة فارغة (0 منتجات) عند الإنشاء

## Related Events (أحداث ذات صلة)
- `category.update` - عند تحديث الفئة
- `category.delete` - عند حذف الفئة

## SEO Keywords
Zid webhook, category.create, إنشاء فئة, category created webhook, زد webhook, فئة منتجات جديدة, تصنيف المنتجات, إضافة فئة
