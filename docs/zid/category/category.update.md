# category.update - تحديث الفئة

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند تحديث بيانات فئة المنتجات، مثل تغيير الاسم، الوصف، أو الصورة.

**English:** This event is triggered when a product category's details are updated, such as name changes, description updates, or image modifications.

## When Triggered (متى يتم إطلاقه)
- عند تعديل اسم الفئة
- عند تغيير وصف الفئة
- عند تحديث صورة الفئة
- عند نقل الفئة لتصبح فرعية لفئة أخرى
- عند تغيير ترتيب الفئة

## Payload Schema (هيكل البيانات)
```json
{
  "event": "category.update",
  "data": {
    "id": 123,
    "name": "ملابس رجالية وأحذية",
    "name_en": "Men's Clothing & Shoes",
    "previous_name": "ملابس رجالية",
    "slug": "mens-clothing-shoes",
    "description": "ملابس وأحذية رجالية",
    "description_en": "Men's clothing and shoes",
    "parent_id": null,
    "previous_parent_id": null,
    "image": "https://cdn.zid.sa/category/new-image.jpg",
    "is_active": true,
    "is_visible": true,
    "sort_order": 1,
    "products_count": 45,
    "updated_at": "2024-03-25T21:00:00Z",
    "created_at": "2024-03-20T10:00:00Z"
  },
  "timestamp": "2024-03-25T21:00:00Z"
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

if ($data['event'] === 'category.update') {
    $category = $data['data'];

    $categoryId = $category['id'];
    $name = $category['name'];
    $nameEn = $category['name_en'] ?? '';
    $previousName = $category['previous_name'] ?? '';
    $slug = $category['slug'] ?? '';
    $description = $category['description'] ?? '';
    $image = $category['image'] ?? '';
    $parentId = $category['parent_id'] ?? null;
    $previousParentId = $category['previous_parent_id'] ?? null;

    // البحث عن الفئة في النظام الخارجي
    $mapping = getCategoryMapping($categoryId);

    if ($mapping) {
        $externalCategoryId = $mapping['external_category_id'];

        // تحديث الفئة
        updateCategoryInERP($externalCategoryId, [
            'name_ar' => $name,
            'name_en' => $nameEn,
            'slug' => $slug,
            'description' => $description,
            'image' => $image,
            'parent_id' => $parentId
        ]);

        // إذا تغير الاسم، حدث قائمة التنقل
        if ($previousName && $previousName !== $name) {
            updateNavigationMenu($categoryId, [
                'name' => $name
            ]);

            // إعادة فهرسة في محرك البحث
            reindexCategory($categoryId, [
                'title' => $name,
                'title_en' => $nameEn
            ]);
        }

        // إذا تغيرت الفئة الرئيسية
        if ($previousParentId !== $parentId) {
            updateCategoryParent($externalCategoryId, $parentId);
            logCategoryMove($categoryId, $previousParentId, $parentId);
        }

        // تحديث الوصف والصورة
        updateCategoryMetadata($externalCategoryId, [
            'description' => $description,
            'image' => $image
        ]);

    } else {
        // الفئة غير موجودة - إنشاؤها
        $externalCategoryId = addCategoryToERP([
            'zid_id' => $categoryId,
            'name_ar' => $name,
            'name_en' => $nameEn,
            'slug' => $slug
        ]);
        saveCategoryMapping($categoryId, $externalCategoryId);
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

async function handleCategoryUpdate(category) {
    const {
        id,
        name,
        name_en,
        previous_name,
        slug,
        description,
        image,
        parent_id,
        previous_parent_id
    } = category;

    // البحث عن الفئة
    const mapping = await db.category_mapping.findOne({
        where: { zid_category_id: id }
    });

    if (!mapping) {
        // الفئة غير موجودة - معالجتها كفئة جديدة
        return handleCategoryCreate(category);
    }

    const externalId = mapping.external_category_id;

    // تحديث البيانات
    await externalSystem.updateCategory(externalId, {
        name: { ar: name, en: name_en },
        slug: slug,
        description: description,
        image: image,
        parent_id: parent_id
    });

    // معالجة تغيير الاسم
    if (previous_name && previous_name !== name) {
        await navigationMenu.update(id, { name });
        await searchEngine.reindexCategory(id, {
            title: { ar: name, en: name_en }
        });
    }

    // معالجة تغيير الفئة الرئيسية
    if (previous_parent_id !== parent_id) {
        await externalSystem.updateCategoryParent(externalId, parent_id);
        await analytics.logCategoryMove(id, previous_parent_id, parent_id);
    }

    // تحديث الأطفال (الفئات الفرعية) إذا تغير الاسم
    if (previous_name && previous_name !== name) {
        const children = await db.category_mapping.findAll({
            where: { parent_zid_id: id }
        });

        for (const child of children) {
            await updateChildBreadcrumb(child.id, name);
        }
    }

    console.log(`Category ${id} updated successfully`);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'category.update') {
        handleCategoryUpdate(data.data)
            .catch(error => console.error('Category update error:', error));
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

async def handle_category_update(category):
    """معالجة تحديث الفئة"""
    category_id = category.get('id')
    name = category.get('name')
    name_en = category.get('name_en', '')
    previous_name = category.get('previous_name', '')
    slug = category.get('slug', '')
    description = category.get('description', '')
    image = category.get('image', '')
    parent_id = category.get('parent_id')
    previous_parent_id = category.get('previous_parent_id')

    # البحث عن الفئة
    mapping = await db.category_mappings.find_one({
        'zid_category_id': category_id
    })

    if not mapping:
        # الفئة غير موجودة - معالجتها كجديدة
        return await handle_category_create(category)

    external_id = mapping.get('external_category_id')

    # تحديث البيانات
    await erp.update_category(external_id, {
        'name_ar': name,
        'name_en': name_en,
        'slug': slug,
        'description': description,
        'image': image,
        'parent_id': parent_id
    })

    # معالجة تغيير الاسم
    if previous_name and previous_name != name:
        await navigation.update(category_id, {'name': name})
        await search.reindex_category(category_id, {
            'title_ar': name,
            'title_en': name_en
        })

    # معالجة تغيير الفئة الرئيسية
    if previous_parent_id != parent_id:
        await erp.update_category_parent(external_id, parent_id)
        await analytics.log_category_move(category_id, previous_parent_id, parent_id)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'category.update':
        asyncio.create_task(handle_category_update(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: الفئة غير موجودة في النظام الخارجي
**الحل:** معالجتها كفئة جديدة بدلاً من التحديث

### مشكلة: أخطاء في التسلسل الهرمي
**الحل:** تحقق من وجود الفئة الرئيسية قبل تحديث parent_id

### مشكلة: إعادة فهرسة جميع المنتجات
**الحل:** أعد فهرسة المنتجات فقط إذا تغير الاسم أو Slug بشكل كبير

## Use Cases (حالات الاستخدام)
- تحديث الفئات في ERP
- إعادة فهرسة في محركات البحث
- تحديث قوائم التنقل
- معالجة تغيير التسلسل الهرمي
- تحديث مسارات URL

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد لا يحتوي على جميع الحقول
- تحقق من التغييرات الفعلية قبل المعالجة

## Related Events (أحداث ذات صلة)
- `category.create` - عند إنشاء فئة جديدة
- `category.delete` - عند حذف الفئة

## SEO Keywords
Zid webhook, category.update, تحديث الفئة, category updated webhook, زد webhook, تعديل الفئة, تغيير اسم الفئة, تحديث التصنيف
