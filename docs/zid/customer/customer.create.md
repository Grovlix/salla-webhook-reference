# customer.create - إنشاء عميل جديد

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند إنشاء حساب عميل جديد في المتجر، سواء كان التسجيل من قبل العميل أو من قبل التاجر.

**English:** This event is triggered when a new customer account is created in the store, whether registered by the customer themselves or created by the merchant.

## When Triggered (متى يتم إطلاقه)
- عند تسجيل عميل جديد في المتجر
- عند إنشاء التاجر لحساب عميل
- عند تسجيل العميل عبر وسائل التواصل الاجتماعي
- عند إنشاء عميل أثناء عملية الشراء (checkout)

## Payload Schema (هيكل البيانات)
```json
{
  "event": "customer.create",
  "data": {
    "id": 5678,
    "name": "أحمد محمد",
    "first_name": "أحمد",
    "last_name": "محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "phone_country_code": "+966",
    "phone_number": "501234567",
    "date_of_birth": null,
    "gender": "male",
    "avatar": "https://cdn.zid.sa/customer/avatar.jpg",
    "is_active": true,
    "is_verified": true,
    "addresses": [
      {
        "id": 123,
        "type": "home",
        "is_default": true,
        "city": "الرياض",
        "district": "النخيل",
        "street": "شارع الملك فهد",
        "building": null,
        "apartment": null,
        "postcode": "12345"
      }
    ],
    "tags": ["عميل VIP", "عميل جديد"],
    "metadata": {
      "source": "direct_registration",
      "registration_ip": "192.168.1.1"
    },
    "created_at": "2024-03-25T16:00:00Z",
    "updated_at": "2024-03-25T16:00:00Z"
  },
  "timestamp": "2024-03-25T16:00:00Z"
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

if ($data['event'] === 'customer.create') {
    $customer = $data['data'];

    $customerId = $customer['id'];
    $name = $customer['name'];
    $email = $customer['email'] ?? '';
    $phone = $customer['phone'] ?? '';
    $addresses = $customer['addresses'] ?? [];

    // إضافة العميل إلى CRM
    $crmCustomerId = addToCRM([
        'external_id' => $customerId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'source' => 'Zid Store',
        'created_at' => $customer['created_at']
    ]);

    // حفظ التطابق
    saveCustomerMapping($customerId, $crmCustomerId);

    // إضافة إلى قائمة البريد الإلكتروني
    if ($email) {
        addToEmailList($email, [
            'name' => $name,
            'tags' => ['new_customer']
        ]);
    }

    // إضافة إلى WhatsApp Business
    if ($phone) {
        addToWhatsAppContacts($phone, [
            'name' => $name,
            'source' => 'store_registration'
        ]);
    }

    // إنشاء ملف تعريف في نظام التوصيل
    foreach ($addresses as $address) {
        if ($address['is_default']) {
            createShippingProfile($customerId, $address);
            break;
        }
    }

    // إرسال رسالة ترحيب
    sendWelcomeMessage($customer);

    // إضافة إلى برنامج الولاء
    enrollInLoyaltyProgram($customerId, [
        'starting_points' => 100,
        'welcome_bonus': true
    ]);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function sendWelcomeMessage($customer) {
    $email = $customer['email'] ?? '';
    $phone = $customer['phone'] ?? '';
    $name = $customer['name'];

    // إرسال بريد ترحيبي
    if ($email) {
        sendEmail($email, [
            'subject' => 'مرحباً بك في متجرنا!',
            'template' => 'welcome',
            'data' => ['name' => $name]
        ]);
    }

    // إرسال رسالة SMS
    if ($phone) {
        sendSMS($phone, 'مرحباً ' . $name . '! شكراً لتسجيلك في متجرنا');
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

async function handleCustomerCreate(customer) {
    const { id, name, email, phone, addresses, tags } = customer;

    // إضافة إلى CRM بشكل متوازي مع أنظمة أخرى
    const tasks = await Promise.allSettled([
        // إضافة إلى CRM
        crm.createContact({
            external_id: id,
            name: name,
            email: email,
            phone: phone,
            source: 'Zid Store',
            tags: ['new_customer', ...tags]
        }),

        // إضافة لقائمة البريد الإلكتروني
        emailList.addSubscriber({
            email: email,
            name: name,
            tags: ['new_customer']
        }),

        // إضافة لـ WhatsApp Business
        whatsapp.addContact({
            phone: phone,
            name: name,
            source: 'store_registration'
        }),

        // إضافة لنظام التوصيل
        shipping.createProfile({
            customer_id: id,
            addresses: addresses
        }),

        // التسجيل في برنامج الولاء
        loyalty.enroll({
            customer_id: id,
            name: name,
            phone: phone,
            email: email,
            welcome_points: 100
        })
    ]);

    // تسجيل الأخطاء
    tasks.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`Task ${index} failed:`, result.reason);
        }
    });

    // حفظ التطابق في قاعدة البيانات
    await db.customer_mapping.create({
        zid_customer_id: id,
        synced_at: new Date()
    });

    // إرسال رسالة ترحيب
    await sendWelcomeMessage(customer);

    console.log(`Customer ${id} created and synced`);
}

async function sendWelcomeMessage(customer) {
    const { email, phone, name } = customer;

    const channels = [];

    // بريد ترحيبي
    if (email) {
        channels.push(emailService.send({
            to: email,
            template: 'welcome',
            data: { name }
        }));
    }

    // رسالة WhatsApp
    if (phone) {
        channels.push(whatsappService.send({
            to: phone,
            message: `مرحباً ${name}! 🎉\nشكراً لتسجيلك في متجرنا. احصل على خصم 10% على طلبك الأول بكود: WELCOME10`
        }));
    }

    await Promise.allSettled(channels);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'customer.create') {
        handleCustomerCreate(data.data)
            .catch(error => console.error('Customer create error:', error));
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

async def handle_customer_create(customer):
    """معالجة إنشاء عميل جديد"""
    customer_id = customer.get('id')
    name = customer.get('name')
    email = customer.get('email', '')
    phone = customer.get('phone', '')
    addresses = customer.get('addresses', [])
    tags = customer.get('tags', [])

    # تجميع المهام
    tasks = []

    # إضافة لـ CRM
    tasks.append(crm.create_contact({
        'external_id': customer_id,
        'name': name,
        'email': email,
        'phone': phone,
        'source': 'Zid Store',
        'tags': ['new_customer'] + tags
    }))

    # إضافة لقائمة البريد
    if email:
        tasks.append(email_service.add_subscriber({
            'email': email,
            'name': name,
            'tags': ['new_customer']
        }))

    # إضافة لـ WhatsApp
    if phone:
        tasks.append(whatsapp.add_contact({
            'phone': phone,
            'name': name,
            'source': 'store_registration'
        }))

    # التسجيل في برنامج الولاء
    tasks.append(loyalty.enroll({
        'customer_id': customer_id,
        'name': name,
        'phone': phone,
        'email': email,
        'welcome_points': 100
    }))

    # تنفيذ المهام
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # تسجيل الأخطاء
    for result in results:
        if isinstance(result, Exception):
            print(f"Task error: {result}")

    # حفظ التطابق
    await db.customer_mappings.insert_one({
        'zid_customer_id': customer_id,
        'synced_at': datetime.utcnow()
    })

    # إرسال رسالة ترحيب
    await send_welcome_message(customer)

async def send_welcome_message(customer):
    """إرسال رسالة ترحيب"""
    email = customer.get('email', '')
    phone = customer.get('phone', '')
    name = customer.get('name')

    # إرسال البريد
    if email:
        await email_service.send({
            'to': email,
            'template': 'welcome',
            'data': {'name': name}
        })

    # إرسال WhatsApp
    if phone:
        await whatsapp.send({
            'to': phone,
            'message': f'مرحباً {name}! 🎉\nشكراً لتسجيلك في متجرنا'
        })

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'customer.create':
        asyncio.create_task(handle_customer_create(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: البريد الإلكتروني غير موجود
**الحل:** تحقق من وجود حقل `email` قبل إضافته لقوائم البريد

### مشكلة: رقم الهاتف بصيغة مختلفة
**الحل:** استخدم `phone_country_code` و `phone_number` للحصول على رقم موحد

### مشكلة: العميل مسجل بالفعل
**الحل:** استخدم idempotency key بناءً على `customer.id`

## Use Cases (حالات الاستخدام)
- إضافة العملاء لـ CRM
- تسجيل العملاء في قوائم التسويق
- إضافة لـ WhatsApp Business API
- التسجيل في برنامج الولاء
- إنشاء ملف تعريف في نظام الشحن
- إرسال رسالة ترحيب
- تصنيف العملاء الجدد

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد يكون `email` أو `phone` فارغين
- تأكد من عدم إرسال رسائل ترحيب مكررة

## Related Events (أحداث ذات صلة)
- `customer.update` - عند تحديث بيانات العميل
- `customer.login` - عند تسجيل دخول العميل
- `customer.merchant.update` - عند تحديث بيانات التاجر للعميل

## SEO Keywords
Zid webhook, customer.create, إنشاء عميل, customer created webhook, زد webhook, عميل جديد, تسجيل عميل, إضافة عميل, أحداث العملاء
