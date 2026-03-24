# customer.created - إنشاء عميل

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء حساب عميل جديد في المتجر. يحتوي هذا الحدث على معلومات العميل الأساسية.

**English:** This event is triggered when a new customer account is created in the store. This event contains the customer's basic information.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تسجيل عميل جديد في المتجر
- **English:** When a new customer registers in the store
- **العربية:** عند إنشاء حساب عبر وسائل التواصل الاجتماعي
- **English:** When creating an account via social media
- **العربية:** عند إنشاء حساب أثناء إتمام الطلب
- **English:** When creating an account during checkout

## Payload Schema (هيكل البيانات)

```json
{
  "event": "customer.created",
  "store_id": "123456789",
  "data": {
    "id": 98765,
    "name": "اسم العميل",
    "email": "customer@example.com",
    "phone": "+966500000000",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "date_of_birth": null,
    "gender": null,
    "avatar": "https://cdn.salla.dev/avatar.jpg",
    "status": "active",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `id` | Integer | معرف العميل الفريد |
| `name` | String | اسم العميل |
| `email` | String | البريد الإلكتروني |
| `phone` | String | رقم الهاتف |
| `city` | String | المدينة |
| `country` | String | الدولة |
| `date_of_birth` | DateTime|null | تاريخ الميلاد |
| `gender` | String|null | الجنس |
| `avatar` | String | رابط الصورة الشخصية |
| `status` | String | حالة الحساب |

## Code Examples

### PHP

```php
<?php
function verifySallaWebhook($payload, $signature, $secret) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($expectedSignature, $signature);
}

$payload = json_decode(file_get_contents('php://input'), true);
$signature = $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '';
$secret = 'your-webhook-secret';

if (verifySallaWebhook($payload, $signature, $secret)) {
    if ($payload['event'] === 'customer.created') {
        $customer = $payload['data'];
        $customerId = $customer['id'];
        $customerEmail = $customer['email'];
        $customerName = $customer['name'];

        // حفظ العميل في قاعدة البيانات المحلية
        saveCustomerToDatabase($customer);

        // إضافة لنظام التسويق عبر البريد الإلكتروني
        addToEmailMarketingList($customerEmail, $customerName);

        // إضافة لـ CRM
        addToCRM($customer);

        // إرسال بريد ترحيبي
        sendWelcomeEmail($customerEmail, $customerName);

        // إضافة كمحتمل في إعلانات التواصل الاجتماعي
        addToCustomAudience($customer);

        error_log("Customer created: {$customerName} (ID: {$customerId})");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}
?>
```

### JavaScript (Node.js)

```javascript
const crypto = require('crypto');

function verifySallaWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    const expectedSignature = `sha256=${digest}`;
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

async function handleCustomerCreated(customer) {
    const { id, name, email, phone, city } = customer;

    // حفظ في قاعدة البيانات
    await db.customers.insert({
        salla_id: id,
        name,
        email,
        phone,
        city,
        created_at: new Date()
    });

    // إضافة لنظام التسويق
    await marketing.addSubscriber({
        email,
        name,
        source: 'salla_store'
    });

    // إضافة لـ CRM
    await crm.createContact({
        name,
        email,
        phone,
        source: 'Website Registration'
    });

    // إضافة للجماهير المخصصة للإعلانات
    await ads.addToAudience({
        email,
        phone,
        event: 'new_customer'
    });

    // إرسال رسالة ترحيبية
    await sendWelcomeMessage({
        to: email,
        name: name
    });

    console.log(`Customer created: ${name} (ID: ${id})`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'customer.created') {
            await handleCustomerCreated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

### Python (Flask)

```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

def verify_salla_webhook(payload, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

def handle_customer_created(customer):
    customer_id = customer['id']
    name = customer['name']
    email = customer['email']

    # حفظ في قاعدة البيانات
    save_customer_to_db(customer)

    # إضافة للقائمة البريدية
    add_to_email_list(email, name)

    # إضافة لـ CRM
    add_to_crm(customer)

    # إرسال ترحيب
    send_welcome_email(email, name)

    print(f"Customer created: {name} (ID: {customer_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'customer.created':
            handle_customer_created(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: تكرار البيانات

**العربية:** قد يتم إنشاء العميل عدة مرات في أنظمة خارجية.

**English:** Customer might be created multiple times in external systems.

**الحل (Solution):** تحقق من وجود العميل أولاً:

```php
$existing = findCustomerByEmail($customer['email']);
if (!$existing) {
    saveCustomerToDatabase($customer);
}
```

## SEO Keywords

**English:** Salla webhook, customer.created event, new customer webhook, e-commerce customer registration, Salla customer API

**العربية:** ويب هوك سلة، حدث إنشاء عميل، إشعار عميل جديد، تسجيل عميل، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [customer.updated](./customer.updated.md) - تحديث عميل
- [customer.login](./customer.login.md) - تسجيل دخول العميل
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
