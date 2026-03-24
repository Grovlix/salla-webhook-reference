# customer.login - تسجيل دخول العميل

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند قيام العميل بتسجيل الدخول إلى حسابه في المتجر. مفيد لتتبع نشاط العملاء وتخصيص التجربة.

**English:** This event is triggered when a customer logs into their account in the store. Useful for tracking customer activity and personalizing the experience.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تسجيل الدخول عبر البريد الإلكتروني وكلمة المرور
- **English:** When logging in via email and password
- **العربية:** عند تسجيل الدخول عبر وسائل التواصل الاجتماعي
- **English:** When logging in via social media
- **العربية:** عند تسجيل الدخول عبر رقم الهاتف
- **English:** When logging in via phone number

## Payload Schema (هيكل البيانات)

```json
{
  "event": "customer.login",
  "store_id": "123456789",
  "data": {
    "id": 98765,
    "name": "اسم العميل",
    "email": "customer@example.com",
    "phone": "+966500000000",
    "login_method": "email",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "logged_in_at": "2024-01-02T10:00:00Z"
  },
  "created_at": "2024-01-02T10:00:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `id` | Integer | معرف العميل |
| `name` | String | اسم العميل |
| `email` | String | البريد الإلكتروني |
| `phone` | String | رقم الهاتف |
| `login_method` | String | طريقة تسجيل الدخول |
| `ip_address` | String | عنوان IP |
| `user_agent` | String | متصفح المستخدم |
| `logged_in_at` | DateTime | تاريخ ووقت تسجيل الدخول |

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
    if ($payload['event'] === 'customer.login') {
        $data = $payload['data'];
        $customerId = $data['id'];
        $customerEmail = $data['email'];

        // تحديث آخر زيارة للعميل
        updateLastLogin($customerId, $data['logged_in_at']);

        // تتبع النشاط للتحليلات
        trackCustomerActivity($customerId, 'login', $data);

        // التحقق من وجود سلة متروكة
        $abandonedCart = checkAbandonedCart($customerId);
        if ($abandonedCart) {
            sendCartReminderEmail($customerEmail, $abandonedCart);
        }

        // تخصيص العروض بناءً على النشاط
        $personalizedOffers = getPersonalizedOffers($customerId);
        if ($personalizedOffers) {
            queuePushNotification($customerId, $personalizedOffers);
        }

        error_log("Customer login: ID {$customerId}");
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

async function handleCustomerLogin(data) {
    const { id, email, login_method, logged_in_at } = data;

    // تحديث آخر تسجيل دخول
    await db.customers.updateOne(
        { salla_id: id },
        {
            $set: {
                last_login_at: new Date(logged_in_at),
                last_login_method: login_method
            }
        }
    );

    // تتبع النشاط
    await analytics.track({
        event: 'customer_login',
        customer_id: id,
        method: login_method,
        timestamp: new Date()
    });

    // التحقق من السلة المتروكة
    const cart = await db.carts.findOne({
        customer_id: id,
        status: 'abandoned'
    });

    if (cart) {
        await sendCartReminder({
            email,
            cart_id: cart._id,
            items: cart.items
        });
    }

    console.log(`Customer login: ${email} (ID: ${id})`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'customer.login') {
            await handleCustomerLogin(req.body.data);
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

def handle_customer_login(data):
    customer_id = data['id']
    email = data['email']

    # تحديث آخر تسجيل دخول
    update_last_login(customer_id, data['logged_in_at'])

    # تتبع النشاط
    track_activity(customer_id, 'login', data)

    # التحقق من السلة المتروكة
    abandoned_cart = check_abandoned_cart(customer_id)
    if abandoned_cart:
        send_cart_reminder(email, abandoned_cart)

    print(f"Customer login: {email} (ID: {customer_id})")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'customer.login':
            handle_customer_login(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: عدد كبير من الأحداث

**العربية:** قد يتسبب في عدد كبير جدًا من الأحداث للعملاء النشطين.

**English:** May cause a very large number of events for active customers.

**الحل (Solution):** فكر في استخدام التجميع أو التصفية:

```javascript
// معالجة أحداث تسجيل الدخول بشكل دوري فقط
const loginCache = new Map();
function shouldProcessLogin(customerId) {
    const lastProcessed = loginCache.get(customerId) || 0;
    const now = Date.now();
    if (now - lastProcessed > 3600000) { // ساعة واحدة
        loginCache.set(customerId, now);
        return true;
    }
    return false;
}
```

## Best Practices (أفضل الممارسات)

- **العربية:** استخدم هذا الحدث لتتبع نشاط العملاء وتحليل سلوكهم
- **English:** Use this event to track customer activity and analyze behavior
- **العربية:** قم بإرسال تذكير بالسلة المتروكة إذا وجدت
- **English:** Send abandoned cart reminder if found
- **العربية:** قم بتخصيص العروض بناءً على النشاط
- **English:** Personalize offers based on activity

## SEO Keywords

**English:** Salla webhook, customer.login event, customer login webhook, e-commerce customer tracking, Salla customer API

**العربية:** ويب هوك سلة، حدث تسجيل دخول، إشعار دخول العميل، تتبع العملاء، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [customer.created](./customer.created.md) - إنشاء عميل
- [customer.updated](./customer.updated.md) - تحديث عميل
- [cart.abandoned](../cart/cart.abandoned.md) - سلة متروكة

---

*Last Updated: مارس 2026*
