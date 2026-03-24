# customer.merchant.update - تحديث بيانات التاجر للعميل

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند قيام التاجر بتحديث بيانات خاصة بالعميل، مثل إضافة وسوم (tags)، ملاحظات، أو تصنيف العميل.

**English:** This event is triggered when the merchant updates customer-specific data, such as adding tags, notes, or customer classifications.

## When Triggered (متى يتم إطلاقه)
- عند إضافة التاجر وسم (tag) للعميل
- عند إضافة ملاحظة على العميل
- عند تصنيف العميل (VIP، عميل مميز، إلخ)
- عند تحديث التاجر لبيانات العميل يدوياً
- عند ربط العميل بقائمة بريدية محددة

## Payload Schema (هيكل البيانات)
```json
{
  "event": "customer.merchant.update",
  "data": {
    "id": 5678,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "tags": ["VIP", "عميل مميز", "كثير الشراء"],
    "previous_tags": ["VIP"],
    "notes": "عميل مهم يفضل الدفع عند الاستلام",
    "customer_type": "vip",
    "previous_customer_type": "regular",
    "credit_limit": 5000.00,
    "custom_fields": {
      "preferred_payment_method": "Cash On Delivery",
      "sales_representative": "محمد علي",
      "last_contact_date": "2024-03-20"
    },
    "updated_at": "2024-03-25T18:00:00Z",
    "updated_by": "merchant_admin"
  },
  "timestamp": "2024-03-25T18:00:00Z"
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

if ($data['event'] === 'customer.merchant.update') {
    $customer = $data['data'];

    $customerId = $customer['id'];
    $tags = $customer['tags'] ?? [];
    $previousTags = $customer['previous_tags'] ?? [];
    $customerType = $customer['customer_type'] ?? '';
    $previousType = $customer['previous_customer_type'] ?? '';
    $notes = $customer['notes'] ?? '';
    $customFields = $customer['custom_fields'] ?? [];

    // تحديث الوسوم في CRM
    updateCustomerTagsInCRM($customerId, $tags);

    // تحديث نوع العميل
    if ($previousType && $previousType !== $customerType) {
        updateCustomerType($customerId, $customerType);
        logCustomerTypeChange($customerId, $previousType, $customerType);

        // إجراءات بناءً على النوع الجديد
        if ($customerType === 'vip') {
            // إضافة العميل لقائمة العملاء المميزين
            addToList($customerId, 'vip_customers');

            // إرسال رسالة شكر للعميل
            sendVIPWelcomeMessage($customerId);

            // منح نقاط إضافية
            grantBonusPoints($customerId, 500);
        }
    }

    // معالجة الوسوم الجديدة
    $newTags = array_diff($tags, $previousTags);
    foreach ($newTags as $tag) {
        // إجراءات بناءً على الوسوم
        handleNewTag($customerId, $tag);
    }

    // إضافة الملاحظات
    if ($notes) {
        addNoteToCRM($customerId, $notes);
    }

    // تحديث الحقول المخصصة
    foreach ($customFields as $key => $value) {
        updateCustomField($customerId, $key, $value);
    }

    // تحديث قوائم التسويق بناءً على الوسوم
    updateMarketingLists($customerId, $tags);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function handleNewTag($customerId, $tag) {
    // معالجة الوسوم الجديدة
    switch ($tag) {
        case 'عميل كثير الشراء':
            // إضافة لقائمة العملاء المميزين
            addToList($customerId, 'frequent_shoppers');
            break;

        case 'عميل مشكلة':
            // إضافة تنبيه للخدمة
            addServiceAlert($customerId, 'تعامل بحذر');
            break;

        case 'مهتم بالعروض':
            // إضافة لقائمة العروض
            addToList($customerId, 'deals_interested');
            break;
    }
}

function sendVIPWelcomeMessage($customerId) {
    $customer = getCustomerDetails($customerId);
    sendEmail($customer['email'], [
        'subject' => 'أصبحت الآن عميل VIP!',
        'template' => 'vip_welcome',
        'data' => ['name' => $customer['name']]
    ]);
}

function updateMarketingLists($customerId, $tags) {
    // تحديث قوائم التسويق بناءً على الوسوم
    foreach ($tags as $tag) {
        if (in_array($tag, ['مهتم بالعروض', 'عروض', 'promotions'])) {
            addToList($customerId, 'promotional_emails');
        }
        if (in_array($tag, ['منتجات جديدة', 'جديد'])) {
            addToList($customerId, 'new_products');
        }
    }
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

async function handleCustomerMerchantUpdate(customer) {
    const {
        id,
        tags,
        previous_tags,
        customer_type,
        previous_customer_type,
        notes,
        custom_fields
    } = customer;

    // حساب الوسوم الجديدة والمحذوفة
    const newTags = tags.filter(tag => !previous_tags.includes(tag));
    const removedTags = previous_tags.filter(tag => !tags.includes(tag));

    // تحديث الوسوم في جميع الأنظمة
    await Promise.all([
        // تحديث في CRM
        crm.updateCustomerTags(id, tags),

        // تحديث في نظام البريد الإلكتروني
        emailListService.updateTags(id, { add: newTags, remove: removedTags }),

        // تحديث في WhatsApp
        whatsappService.updateTags(id, tags)
    ]);

    // معالجة تغيير نوع العميل
    if (previous_customer_type && previous_customer_type !== customer_type) {
        await handleCustomerTypeChange(id, previous_customer_type, customer_type);
    }

    // معالجة الوسوم الجديدة
    for (const tag of newTags) {
        await handleNewTag(id, tag);
    }

    // إضافة الملاحظات
    if (notes) {
        await crm.addNote(id, {
            content: notes,
            created_by: 'merchant',
            created_at: new Date()
        });
    }

    // تحديث الحقول المخصصة
    if (custom_fields) {
        for (const [key, value] of Object.entries(custom_fields)) {
            await crm.updateCustomField(id, key, value);
        }
    }

    console.log(`Customer ${id} merchant data updated`);
}

async function handleCustomerTypeChange(customerId, oldType, newType) {
    // تسجيل التغيير
    await db.customer_type_log.create({
        customer_id: customerId,
        old_type: oldType,
        new_type: newType,
        changed_at: new Date()
    });

    // إجراءات حسب النوع الجديد
    switch (newType) {
        case 'vip':
            await crm.addToList(customerId, 'vip_customers');
            await loyalty.grantBonus(customerId, 500);
            await sendVIPWelcome(customerId);
            break;

        case 'wholesale':
            await crm.addToList(customerId, 'wholesale_customers');
            await pricing.applyWholesalePricing(customerId);
            break;

        case 'blocked':
            await crm.addToList(customerId, 'blocked_customers');
            await restrictions.apply(customerId, { orders: true });
            break;
    }
}

async function handleNewTag(customerId, tag) {
    const tagHandlers = {
        'عميل كثير الشراء': async () => {
            await crm.addToList(customerId, 'frequent_shoppers');
        },
        'عميل مشكلة': async () => {
            await service.addAlert(customerId, 'تعامل بحذر');
        },
        'مهتم بالعروض': async () => {
            await emailList.addToList(customerId, 'promotional_emails');
        },
        'B2B': async () => {
            await crm.updateCustomerType(customerId, 'business');
            await pricing.applyB2BPricing(customerId);
        }
    };

    const handler = tagHandlers[tag];
    if (handler) {
        await handler();
    }
}

async function sendVIPWelcome(customerId) {
    const customer = await getCustomerDetails(customerId);

    await emailService.send({
        to: customer.email,
        template: 'vip_welcome',
        data: { name: customer.name }
    });

    await whatsappService.send({
        to: customer.phone,
        message: `مرحباً ${customer.name}! 🌟\nنشعارك بأنك أصبحت عضواً في نادي عملاء VIP. استمتع بمميزات حصرية!`
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

    if (data.event === 'customer.merchant.update') {
        handleCustomerMerchantUpdate(data.data)
            .catch(error => console.error('Customer merchant update error:', error));
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

async def handle_customer_merchant_update(customer):
    """معالجة تحديث التاجر لبيانات العميل"""
    customer_id = customer.get('id')
    tags = customer.get('tags', [])
    previous_tags = customer.get('previous_tags', [])
    customer_type = customer.get('customer_type', '')
    previous_type = customer.get('previous_customer_type', '')
    notes = customer.get('notes', '')
    custom_fields = customer.get('custom_fields', {})

    # حساب الوسوم الجديدة والمحذوفة
    new_tags = set(tags) - set(previous_tags)
    removed_tags = set(previous_tags) - set(tags)

    # تحديث الوسوم في جميع الأنظمة
    await crm.update_customer_tags(customer_id, tags)
    await email_service.update_tags(customer_id, {
        'add': list(new_tags),
        'remove': list(removed_tags)
    })

    # معالجة تغيير نوع العميل
    if previous_type and previous_type != customer_type:
        await handle_customer_type_change(
            customer_id, previous_type, customer_type
        )

    # معالجة الوسوم الجديدة
    for tag in new_tags:
        await handle_new_tag(customer_id, tag)

    # إضافة الملاحظات
    if notes:
        await crm.add_note(customer_id, {
            'content': notes,
            'created_by': 'merchant',
            'created_at': datetime.utcnow()
        })

    # تحديث الحقول المخصصة
    for key, value in custom_fields.items():
        await crm.update_custom_field(customer_id, key, value)

async def handle_customer_type_change(customer_id, old_type, new_type):
    """معالجة تغيير نوع العميل"""
    # تسجيل التغيير
    await db.customer_type_log.insert_one({
        'customer_id': customer_id,
        'old_type': old_type,
        'new_type': new_type,
        'changed_at': datetime.utcnow()
    })

    # إجراءات حسب النوع
    if new_type == 'vip':
        await crm.add_to_list(customer_id, 'vip_customers')
        await loyalty.grant_bonus(customer_id, 500)
        await send_vip_welcome(customer_id)

    elif new_type == 'wholesale':
        await crm.add_to_list(customer_id, 'wholesale_customers')
        await pricing.apply_wholesale_pricing(customer_id)

    elif new_type == 'blocked':
        await crm.add_to_list(customer_id, 'blocked_customers')
        await restrictions.apply(customer_id, {'orders': True})

async def handle_new_tag(customer_id, tag):
    """معالجة الوسوم الجديدة"""
    tag_handlers = {
        'عميل كثير الشراء': lambda: crm.add_to_list(
            customer_id, 'frequent_shoppers'
        ),
        'عميل مشكلة': lambda: service.add_alert(
            customer_id, 'تعامل بحذر'
        ),
        'مهتم بالعروض': lambda: email_service.add_to_list(
            customer_id, 'promotional_emails'
        ),
    }

    handler = tag_handlers.get(tag)
    if handler:
        await handler()

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'customer.merchant.update':
        asyncio.create_task(handle_customer_merchant_update(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: عدم وجود previous_tags
**السبب:** قد لا يتم إرسال هذا الحقل دائماً
**الحل:** تعامل معه كحقل اختياري مع قيمة افتراضية مصفوفة فارغة

### مشكلة: وسم غير معروف
**السبب:** التاجر قد ينشئ وسوماً مخصصة
**الحل:** استخدم معالج افتراضي للوسوم غير المعروفة

### مشكلة: تحديثات متكررة
**السبب:** التاجر قد يقوم بتعديلات متعددة
**الحل:** استخدم debouncing لتجميع التحديثات

## Use Cases (حالات الاستخدام)
- تصنيف العملاء (VIP، B2B، إلخ)
- إضافة وسوم للعملاء
- إضافة ملاحظات داخلية
- تحديث قوائم التسويق
- تطبيق تسعير خاص
- منح مميزات إضافية

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- `previous_tags` قد لا يكون موجوداً دائماً
- التاجر يمكنه إنشاء وسوم مخصصة

## Related Events (أحداث ذات صلة)
- `customer.create` - عند إنشاء عميل جديد
- `customer.update` - عند تحديث العميل لبياناته
- `customer.login` - عند تسجيل الدخول

## SEO Keywords
Zid webhook, customer.merchant.update, تحديث التاجر للعميل, customer merchant update webhook, زد webhook, تصنيف العملاء, وسوم العملاء, تحديث بيانات التاجر, أحداث العملاء
