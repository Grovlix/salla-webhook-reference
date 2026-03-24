# category.delete - حذف الفئة

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند حذف فئة منتجات من المتجر.

**English:** This event is triggered when a product category is deleted from the store.

## When Triggered (متى يتم إطلاقه)
- عند حذف فئة من قبل التاجر
- عند حذف فئة كانت تحتوي على منتجات (المنتجات تنتقل لفئة أخرى أو تصغير غير مصنفة)
- عند حذف فئة رئيسية (يتم حذف أو نقل الفئات الفرعية)

## Payload Schema (هيكل البيانات)
```json
{
  "event": "category.delete",
  "data": {
    "id": 123,
    "name": "ملابس رجالية",
    "name_en": "Men's Clothing",
    "slug": "mens-clothing",
    "parent_id": null,
    "products_count": 45,
    "products_action": "moved_to_uncategorized",
    "deleted_at": "2024-03-25T22:00:00Z",
    "child_categories": [
      {
        "id": 124,
        "name": "قمصان",
        "action": "deleted"
      },
      {
        "id": 125,
        "name": "بنطلونات",
        "action": "moved_to_parent",
        "new_parent_id": 100
      }
    ]
  },
  "timestamp": "2024-03-25T22:00:00Z"
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

if ($data['event'] === 'category.delete') {
    $category = $data['data'];

    $categoryId = $category['id'];
    $name = $category['name'];
    $productsCount = $category['products_count'] ?? 0;
    $productsAction = $category['products_action'] ?? '';
    $childCategories = $category['child_categories'] ?? [];

    // البحث عن الفئة في النظام الخارجي
    $mapping = getCategoryMapping($categoryId);

    if ($mapping) {
        $externalCategoryId = $mapping['external_category_id'];

        // أرشفة الفئة قبل الحذف
        archiveCategory($externalCategoryId, [
            'zid_id' => $categoryId,
            'name' => $name,
            'products_count' => $productsCount,
            'deleted_at' => $category['deleted_at']
        ]);

        // إزالة الفئة من النظام الخارجي
        deleteCategoryFromERP($externalCategoryId);

        // إزالة من قائمة التنقل
        removeFromNavigationMenu($categoryId);

        // إزالة من محرك البحث
        removeFromSearchEngine($categoryId);

        // إزالة التطابق
        deleteCategoryMapping($categoryId);

        // معالجة الفئات الفرعية
        foreach ($childCategories as $child) {
            handleChildCategoryAfterParentDelete($child);
        }

        // معالجة المنتجات بناءً على الإجراء
        handleCategoryProducts($categoryId, $productsAction, $productsCount);

        // تسجيل الحذف
        logCategoryDeletion($categoryId, $name, $productsCount);
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function handleChildCategoryAfterParentDelete($child) {
    $childId = $child['id'];
    $action = $child['action'] ?? '';
    $newParentId = $child['new_parent_id'] ?? null;

    switch ($action) {
        case 'deleted':
            // الفئة الفرعية تم حذفها أيضاً
            $childMapping = getCategoryMapping($childId);
            if ($childMapping) {
                deleteCategoryFromERP($childMapping['external_category_id']);
                deleteCategoryMapping($childId);
            }
            break;

        case 'moved_to_parent':
            // الفئة الفرعية تم نقلها لفئة رئيسية أخرى
            $childMapping = getCategoryMapping($childId);
            if ($childMapping) {
                updateCategoryParentInERP(
                    $childMapping['external_category_id'],
                    $newParentId
                );
            }
            break;
    }
}

function handleCategoryProducts($categoryId, $action, $count) {
    switch ($action) {
        case 'moved_to_uncategorized':
            // المنتجات نقلت لغير مصنفة
            logCategoryChange($categoryId, 'uncategorized', $count);
            break;

        case 'moved_to_category':
            // المنتجات نقلت لفئة أخرى
            logCategoryChange($categoryId, 'moved', $count);
            break;

        case 'deleted':
            // المنتجات حذفت مع الفئة (نادر)
            logCategoryChange($categoryId, 'deleted_products', $count);
            break;
    }
}

function archiveCategory($externalCategoryId, $data) {
    // أرشفة بيانات الفئة قبل الحذف
    $archiveData = [
        'external_id' => $externalCategoryId,
        'original_data' => json_encode($data),
        'archived_at' => date('Y-m-d H:i:s')
    ];
    saveToArchive('categories', $archiveData);
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

async function handleCategoryDelete(category) {
    const {
        id,
        name,
        products_count,
        products_action,
        child_categories
    } = category;

    // البحث عن الفئة
    const mapping = await db.category_mapping.findOne({
        where: { zid_category_id: id }
    });

    if (!mapping) {
        console.log(`Category ${id} not found in mapping`);
        return;
    }

    const externalId = mapping.external_category_id;

    // أرشفة الفئة
    await archiveCategory(externalId, {
        zid_id: id,
        name: name,
        products_count: products_count
    });

    // إزالة من جميع الأنظمة
    await Promise.all([
        // حذف من ERP
        externalSystem.deleteCategory(externalId),

        // إزالة من القائمة
        navigationMenu.remove(id),

        // إزالة من البحث
        searchEngine.deleteCategory(id)
    ]);

    // حذف التطابق
    await db.category_mapping.destroy({
        where: { zid_category_id: id }
    });

    // معالجة الفئات الفرعية
    if (child_categories && child_categories.length > 0) {
        for (const child of child_categories) {
            await handleChildCategory(child);
        }
    }

    // معالجة المنتجات
    await handleCategoryProducts(id, products_action, products_count);

    // تسجيل الحذف
    await analytics.track('category_deleted', {
        category_id: id,
        name: name,
        products_count: products_count
    });

    console.log(`Category ${id} deleted`);
}

async function handleChildCategory(child) {
    const { id, action, new_parent_id } = child;

    const childMapping = await db.category_mapping.findOne({
        where: { zid_category_id: id }
    });

    if (!childMapping) {
        return;
    }

    switch (action) {
        case 'deleted':
            // حذف الفئة الفرعية
            await externalSystem.deleteCategory(childMapping.external_category_id);
            await db.category_mapping.destroy({
                where: { zid_category_id: id }
            });
            break;

        case 'moved_to_parent':
            // تحديث الفئة الرئيسية للفئة الفرعية
            await externalSystem.updateCategoryParent(
                childMapping.external_category_id,
                new_parent_id
            );
            break;
    }
}

async function handleCategoryProducts(categoryId, action, count) {
    await analytics.track('category_products_handled', {
        category_id: categoryId,
        action: action,
        products_count: count
    });
}

async function archiveCategory(externalId, data) {
    await db.category_archive.create({
        external_id: externalId,
        original_data: data,
        archived_at: new Date()
    });
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'category.delete') {
        handleCategoryDelete(data.data)
            .catch(error => console.error('Category delete error:', error));
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
from datetime import datetime

app = Flask(__name__)

async def handle_category_delete(category):
    """معالجة حذف الفئة"""
    category_id = category.get('id')
    name = category.get('name')
    products_count = category.get('products_count', 0)
    products_action = category.get('products_action', '')
    child_categories = category.get('child_categories', [])

    # البحث عن الفئة
    mapping = await db.category_mappings.find_one({
        'zid_category_id': category_id
    })

    if not mapping:
        print(f"Category {category_id} not found in mapping")
        return

    external_id = mapping.get('external_category_id')

    # أرشفة الفئة
    await db.category_archive.insert_one({
        'external_id': external_id,
        'original_data': {
            'zid_id': category_id,
            'name': name,
            'products_count': products_count
        },
        'archived_at': datetime.utcnow()
    })

    # إزالة من جميع الأنظمة
    await erp.delete_category(external_id)
    await navigation.remove(category_id)
    await search.delete_category(category_id)

    # حذف التطابق
    await db.category_mappings.delete_one({
        'zid_category_id': category_id
    })

    # معالجة الفئات الفرعية
    for child in child_categories:
        await handle_child_category(child)

    # تسجيل الحذف
    await analytics.track('category_deleted', {
        'category_id': category_id,
        'name': name,
        'products_count': products_count
    })

async def handle_child_category(child):
    """معالجة الفئة الفرعية بعد حذف الرئيسية"""
    child_id = child.get('id')
    action = child.get('action')
    new_parent_id = child.get('new_parent_id')

    child_mapping = await db.category_mappings.find_one({
        'zid_category_id': child_id
    })

    if not child_mapping:
        return

    external_id = child_mapping.get('external_category_id')

    if action == 'deleted':
        await erp.delete_category(external_id)
        await db.category_mappings.delete_one({
            'zid_category_id': child_id
        })

    elif action == 'moved_to_parent':
        await erp.update_category_parent(external_id, new_parent_id)

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'category.delete':
        asyncio.create_task(handle_category_delete(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: الفئة تحتوي على منتجات
**السبب:** حذف الفئة يؤثر على المنتجات المصنفة
**الحل:** تحقق من `products_action` لمعرفة مصير المنتجات

### مشكلة: فئات فرعية متأثرة
**الحل:** تعامل مع كل فئة فرعية بناءً على `action` المحدد

### مشكلة: فقدان البيانات نهائياً
**الحل:** قم دائماً بأرشفة بيانات الفئة قبل حذفها

## Use Cases (حالات الاستخدام)
- حذف الفئات من ERP
- إزالة من قوائم التنقل
- إزالة من محركات البحث
- أرشفة بيانات الفئات
- معالجة المنتجات المتأثرة
- تحديث التسلسل الهرمي

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد يحتوي على بيانات محدودة
- راقب `child_categories` لمعجل تأثير الحذف

## Related Events (أحداث ذات صلة)
- `category.create` - عند إنشاء فئة جديدة
- `category.update` - عند تحديث الفئة

## SEO Keywords
Zid webhook, category.delete, حذف الفئة, category deleted webhook, زد webhook, إزالة الفئة, حذف تصنيف, أرشفة الفئة
