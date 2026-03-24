# customer.update - تحديث بيانات العميل

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند تحديث العميل لبياناته الشخصية، مثل الاسم، البريد الإلكتروني، رقم الهاتف، أو العناوين.

**English:** This event is triggered when a customer updates their personal information, such as name, email, phone number, or addresses.

## When Triggered (متى يتم إطلاقه)
- عند تعديل العميل لملفه الشخصي
- عند تحديث رقم الهاتف أو البريد الإلكتروني
- عند إضافة أو تعديل عنوان
- عند تغيير صورة الملف الشخصي
- عند تحديث تاريخ الميلاد أو الجنس

## Payload Schema (هيكل البيانات)
```json
{
  "event": "customer.update",
  "data": {
    "id": 5678,
    "name": "أحمد محمد العلي",
    "first_name": "أحمد",
    "last_name": "محمد العلي",
    "email": "ahmed.new@example.com",
    "previous_email": "ahmed@example.com",
    "phone": "+966501234568",
    "previous_phone": "+966501234567",
    "phone_country_code": "+966",
    "phone_number": "501234568",
    "date_of_birth": "1990-01-15",
    "gender": "male",
    "avatar": "https://cdn.zid.sa/customer/new-avatar.jpg",
    "is_active": true,
    "is_verified": true,
    "addresses": [
      {
        "id": 123,
        "type": "home",
        "is_default": true,
        "city": "جدة",
        "district": "الروضة",
        "street": "شارع التحلية",
        "postcode": "23456"
      },
      {
        "id": 124,
        "type": "work",
        "is_default": false,
        "city": "الرياض",
        "district": "العليا",
        "street": "شارع الأمير محمد"
      }
    ],
    "tags": ["عميل VIP"],
    "updated_at": "2024-03-25T17:00:00Z",
    "created_at": "2024-03-20T10:00:00Z"
  },
  "timestamp": "2024-03-25T17:00:00Z"
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

if ($data['event'] === 'customer.update') {
    $customer = $data['data'];

    $customerId = $customer['id'];
    $name = $customer['name'];
    $email = $customer['email'] ?? '';
    $previousEmail = $customer['previous_email'] ?? '';
    $phone = $customer['phone'] ?? '';
    $previousPhone = $customer['previous_phone'] ?? '';
    $addresses = $customer['addresses'] ?? [];

    // البحث عن العميل في CRM
    $crmCustomerId = findCustomerInCRM($customerId);

    if ($crmCustomerId) {
        // تحديث بيانات العميل
        updateCustomerInCRM($crmCustomerId, [
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ]);

        // تحديث البريد الإلكتروني في قوائم التسويق
        if ($previousEmail && $previousEmail !== $email) {
            updateEmailInList($previousEmail, $email);
            logEmailChange($customerId, $previousEmail, $email);
        }

        // تحديث رقم الهاتف في WhatsApp
        if ($previousPhone && $previousPhone !== $phone) {
            updateWhatsAppContact($previousPhone, $phone, $name);
            logPhoneChange($customerId, $previousPhone, $phone);
        }

        // تحديث العناوين في نظام الشحن
        updateShippingAddresses($customerId, $addresses);

    } else {
        // العميل غير موجود - إنشاؤه
        $newCrmId = addToCRM([
            'external_id' => $customerId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone
        ]);
        saveCustomerMapping($customerId, $newCrmId);
    }

    // تحديث برنامج الولاء
    updateLoyaltyProfile($customerId, [
        'name' => $name,
        'phone' => $phone
    ]);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function updateEmailInList($oldEmail, $newEmail) {
    // تحديث البريد في قائمة التسويق
    $emailListService->updateSubscriber($oldEmail, [
        'new_email' => $newEmail
    ]);

    // طلب تأكيد جديد للبريد
    $emailListService->sendConfirmation($newEmail);
}

function updateShippingAddresses($customerId, $addresses) {
    foreach ($addresses as $address) {
        if ($address['is_default']) {
            shippingService()->updateDefaultAddress($customerId, [
                'city' => $address['city'],
                'district' => $address['district'],
                'street' => $address['street'],
                'postcode' => $address['postcode']
            ]);
            break;
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

async function handleCustomerUpdate(customer) {
    const {
        id,
        name,
        email,
        previous_email,
        phone,
        previous_phone,
        addresses
    } = customer;

    // البحث عن العميل في قاعدة البيانات
    const mapping = await db.customer_mapping.findOne({
        where: { zid_customer_id: id }
    });

    if (!mapping) {
        // العميل غير موجود - معالجته كعميل جديد
        return handleCustomerCreate(customer);
    }

    const updateData = { name };

    // تحديث البريد الإلكتروني
    if (previous_email && previous_email !== email) {
        await emailListService.updateSubscriber(previous_email, { email });
        await db.email_change_log.create({
            customer_id: id,
            old_email: previous_email,
            new_email: email,
            changed_at: new Date()
        });
    }

    // تحديث رقم الهاتف
    if (previous_phone && previous_phone !== phone) {
        await whatsappService.updateContact(previous_phone, { phone, name });
        await db.phone_change_log.create({
            customer_id: id,
            old_phone: previous_phone,
            new_phone: phone,
            changed_at: new Date()
        });
    }

    // تحديث في CRM
    await crm.updateContact(mapping.crm_customer_id, {
        name,
        email,
        phone
    });

    // تحديث العناوين
    if (addresses && addresses.length > 0) {
        const defaultAddress = addresses.find(addr => addr.is_default);
        if (defaultAddress) {
            await shippingService.updateAddress(id, {
                city: defaultAddress.city,
                district: defaultAddress.district,
                street: defaultAddress.street,
                postcode: defaultAddress.postcode
            });
        }
    }

    // تحديث برنامج الولاء
    await loyalty.updateProfile(id, { name, phone });

    console.log(`Customer ${id} updated successfully`);
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'customer.update') {
        handleCustomerUpdate(data.data)
            .catch(error => console.error('Customer update error:', error));
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

async def handle_customer_update(customer):
    """معالجة تحديث بيانات العميل"""
    customer_id = customer.get('id')
    name = customer.get('name')
    email = customer.get('email', '')
    previous_email = customer.get('previous_email', '')
    phone = customer.get('phone', '')
    previous_phone = customer.get('previous_phone', '')
    addresses = customer.get('addresses', [])

    # البحث عن العميل
    mapping = await db.customer_mappings.find_one({
        'zid_customer_id': customer_id
    })

    if not mapping:
        # العميل غير موجود - معالجته كجديد
        return await handle_customer_create(customer)

    crm_id = mapping.get('crm_customer_id')

    # تحديث البريد الإلكتروني
    if previous_email and previous_email != email:
        await email_service.update_subscriber(previous_email, {
            'new_email': email
        })
        await db.email_change_log.insert_one({
            'customer_id': customer_id,
            'old_email': previous_email,
            'new_email': email,
            'changed_at': datetime.utcnow()
        })

    # تحديث رقم الهاتف
    if previous_phone and previous_phone != phone:
        await whatsapp.update_contact(previous_phone, {
            'phone': phone,
            'name': name
        })
        await db.phone_change_log.insert_one({
            'customer_id': customer_id,
            'old_phone': previous_phone,
            'new_phone': phone,
            'changed_at': datetime.utcnow()
        })

    # تحديث في CRM
    await crm.update_contact(crm_id, {
        'name': name,
        'email': email,
        'phone': phone
    })

    # تحديث العناوين
    if addresses:
        default_address = next(
            (addr for addr in addresses if addr.get('is_default')),
            None
        )
        if default_address:
            await shipping.update_address(customer_id, {
                'city': default_address.get('city'),
                'district': default_address.get('district'),
                'street': default_address.get('street'),
                'postcode': default_address.get('postcode')
            })

    # تحديث برنامج الولاء
    await loyalty.update_profile(customer_id, {
        'name': name,
        'phone': phone
    })

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'customer.update':
        asyncio.create_task(handle_customer_update(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: عدم وجود previous_email أو previous_phone
**السبب:** قد لا يتم إرسال هذه الحقول دائماً
**الحل:** تعامل معها كحقول اختيارية وتحقق من وجودها

### مشكلة: تحديثات متعددة في وقت قصير
**السبب:** العميل قد يقوم بتعديلات متعددة
**الحل:** استخدم debouncing لتجميع التحديثات

### مشكلة: العميل غير موجود في النظام الخارجي
**السبب:** قد يكون العميل لم تتم مزامنته سابقاً
**الحل:** معالجة الحالة كإنشاء عميل جديد

## Use Cases (حالات الاستخدام)
- تحديث بيانات العملاء في CRM
- تحديث قوائم البريد الإلكتروني
- تحديث جهات اتصال WhatsApp
- تحديث عناوين الشحن
- تحديث برنامج الولاء
- تتبع تغييرات البريد والهاتف

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد لا يحتوي على جميع الحقول
- `previous_email` و `previous_phone` قد يكونان غير موجودين

## Related Events (أحداث ذات صلة)
- `customer.create` - عند إنشاء عميل جديد
- `customer.login` - عند تسجيل الدخول
- `customer.merchant.update` - عند تحديث التاجر

## SEO Keywords
Zid webhook, customer.update, تحديث بيانات العميل, customer updated webhook, زد webhook, تعديل عميل, تغيير بيانات العميل, تحديث الملف الشخصي, أحداث العملاء
