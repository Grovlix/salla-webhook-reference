# customer.login - تسجيل دخول العميل

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند قيام العميل بتسجيل الدخول إلى حسابه في المتجر.

**English:** This event is triggered when a customer logs into their account in the store.

## When Triggered (متى يتم إطلاقه)
- عند تسجيل العميل دخوله بالبريد الإلكتروني وكلمة المرور
- عند تسجيل الدخول عبر وسائل التواصل الاجتماعي
- عند تسجيل الدخول عبر رقم الهاتف
- عند تجلس الجلسة (session renewal)

## Payload Schema (هيكل البيانات)
```json
{
  "event": "customer.login",
  "data": {
    "id": 5678,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+966501234567",
    "login_method": "email",
    "login_timestamp": "2024-03-25T19:00:00Z",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "device_info": {
      "type": "mobile",
      "os": "iOS",
      "browser": "Safari"
    },
    "is_first_login": false,
    "last_login": "2024-03-24T10:30:00Z"
  },
  "timestamp": "2024-03-25T19:00:00Z"
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

if ($data['event'] === 'customer.login') {
    $customer = $data['data'];

    $customerId = $customer['id'];
    $name = $customer['name'];
    $email = $customer['email'] ?? '';
    $phone = $customer['phone'] ?? '';
    $loginMethod = $customer['login_method'] ?? '';
    $ipAddress = $customer['ip_address'] ?? '';
    $isFirstLogin = $customer['is_first_login'] ?? false;
    $lastLogin = $customer['last_login'] ?? null;

    // تسجيل عملية الدخول
    logCustomerLogin($customerId, [
        'method' => $loginMethod,
        'ip' => $ipAddress,
        'timestamp' => $customer['login_timestamp']
    ]);

    // تحديث آخر تسجيل دخول في CRM
    updateLastLoginInCRM($customerId, $customer['login_timestamp']);

    // التحقق من الأمان
    if (isSuspiciousLogin($customerId, $ipAddress)) {
        // إرسال تنبيه أمان
        sendSecurityAlert($email, [
            'ip' => $ipAddress,
            'time' => $customer['login_timestamp']
        ]);
    }

    // إذا كان أول تسجيل دخول
    if ($isFirstLogin) {
        sendFirstLoginGuidance($email, $name);
    }

    // عرض العروض المتاحة
    $availableOffers = getAvailableOffersForCustomer($customerId);
    if (!empty($availableOffers)) {
        sendOffersNotification($customerId, $availableOffers);
    }

    // تحديث السلة المهملة
    $abandonedCart = getAbandonedCart($customerId);
    if ($abandonedCart) {
        sendCartReminder($customerId, $abandonedCart);
    }

    // تحديث نقاط الولاء
    updateLoyaltyPointsOnLogin($customerId);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function isSuspiciousLogin($customerId, $ipAddress) {
    // التحقق من أن تسجيل الدخول ليس مشبوهاً
    $lastIPs = getLastLoginIPs($customerId, 5); // آخر 5 عناوين IP

    foreach ($lastIPs as $lastIP) {
        // إذا كان IP من نفس الدولة أو المنطقة، فليس مشبوهاً
        if (getIPCountry($ipAddress) === getIPCountry($lastIP['ip'])) {
            return false;
        }
    }

    // إذا كان IP من دولة مختلفة تماماً
    return true;
}

function sendFirstLoginGuidance($email, $name) {
    sendEmail($email, [
        'subject' => 'مرحباً بك في متجرنا! دليل البدء',
        'template' => 'first_login_guide',
        'data' => [
            'name' => $name,
            'guide_url' => 'https://store.zid.sa/guide'
        ]
    ]);
}

function sendCartReminder($customerId, $cart) {
    $customer = getCustomerDetails($customerId);

    $message = "لقد تركت بعض المنتجات في سلتك. أكمل شراءها الآن واحصل على خصم 5%!";
    $discountCode = "CART5";

    // إرسال تذكير عبر البريد
    if (!empty($customer['email'])) {
        sendEmail($customer['email'], [
            'subject' => 'أكمل شراءك!',
            'template' => 'cart_reminder',
            'data' => [
                'cart_items' => $cart['items'],
                'discount_code' => $discountCode,
                'cart_url' => $cart['url']
            ]
        ]);
    }

    // إرسال تذكير عبر WhatsApp
    if (!empty($customer['phone'])) {
        sendWhatsAppMessage($customer['phone'], $message);
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

async function handleCustomerLogin(customer) {
    const {
        id,
        name,
        email,
        phone,
        login_method,
        ip_address,
        is_first_login,
        last_login,
        login_timestamp,
        device_info
    } = customer;

    // تسجيل عملية الدخول
    await db.customer_login_log.create({
        customer_id: id,
        method: login_method,
        ip_address: ip_address,
        device_info: device_info,
        logged_in_at: new Date(login_timestamp)
    });

    // تحديث آخر تسجيل دخول في CRM
    await crm.updateLastLogin(id, new Date(login_timestamp));

    // التحقق من الأمان
    const isSuspicious = await checkSuspiciousLogin(id, ip_address);
    if (isSuspicious) {
        await sendSecurityAlert(email, { ip: ip_address, time: login_timestamp });
    }

    // معالجة أول تسجيل دخول
    if (is_first_login) {
        await sendFirstLoginGuidance(email, name);
        await onboarding.start(id);
    }

    // إعادة المشاركة (Engagement) - العروض المتاحة
    const availableOffers = await offers.getAvailableForCustomer(id);
    if (availableOffers.length > 0) {
        await sendOffersNotification(id, availableOffers);
    }

    // استرجاع السلة المهملة
    const abandonedCart = await cart.getAbandoned(id);
    if (abandonedCart && abandonedCart.items.length > 0) {
        await sendCartReminder(id, abandonedCart);
    }

    // تحديث نقاط الولاء
    await loyalty.updateActivity(id, { last_login: new Date() });

    // التخصيص بناءً على الجهاز
    if (device_info && device_info.type === 'mobile') {
        await mobileEngagement.track(id, 'login');
    }

    console.log(`Customer ${id} logged in at ${login_timestamp}`);
}

async function checkSuspiciousLogin(customerId, ipAddress) {
    // التحقق من عدم وجود تسجيل دخول مشبوه
    const recentLogins = await db.customer_login_log.findAll({
        where: { customer_id: customerId },
        order: [['logged_in_at', 'DESC']],
        limit: 10
    });

    if (recentLogins.length === 0) {
        return false; // أول تسجيل دخول - ليس مشبوهاً
    }

    const lastIP = recentLogins[0].ip_address;
    const lastCountry = getIPCountry(lastIP);
    const currentCountry = getIPCountry(ipAddress);

    // إذا كان من دولة مختلفة
    if (lastCountry !== currentCountry) {
        return true;
    }

    return false;
}

async function sendCartReminder(customerId, cart) {
    const customer = await getCustomerDetails(customerId);

    const message = {
        email: customer.email ? {
            template: 'cart_reminder',
            data: {
                name: customer.name,
                items: cart.items,
                total: cart.total,
                discount_code: 'CART5',
                cart_url: cart.url
            }
        } : null,
        whatsapp: customer.phone ? {
            message: `مرحباً ${customer.name}! 🛒\nلديك ${cart.items.length} منتجات في سلتك. أكمل شراءها الآن واحصل على خصم 5% مع كود: CART5\n${cart.url}`
        } : null
    };

    // إرسال عبر القنوات المتاحة
    if (message.email) {
        await emailService.send(customer.email, message.email);
    }
    if (message.whatsapp) {
        await whatsappService.send(customer.phone, message.whatsapp);
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

    if (data.event === 'customer.login') {
        handleCustomerLogin(data.data)
            .catch(error => console.error('Customer login error:', error));
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

async def handle_customer_login(customer):
    """معالجة تسجيل دخول العميل"""
    customer_id = customer.get('id')
    name = customer.get('name')
    email = customer.get('email', '')
    phone = customer.get('phone', '')
    login_method = customer.get('login_method', '')
    ip_address = customer.get('ip_address', '')
    is_first_login = customer.get('is_first_login', False)
    login_timestamp = customer.get('login_timestamp')
    device_info = customer.get('device_info', {})

    # تسجيل عملية الدخول
    await db.customer_login_log.insert_one({
        'customer_id': customer_id,
        'method': login_method,
        'ip_address': ip_address,
        'device_info': device_info,
        'logged_in_at': datetime.fromisoformat(login_timestamp.replace('Z', '+00:00'))
    })

    # تحديث آخر تسجيل دخول في CRM
    await crm.update_last_login(customer_id, datetime.utcnow())

    # التحقق من الأمان
    is_suspicious = await check_suspicious_login(customer_id, ip_address)
    if is_suspicious:
        await send_security_alert(email, {'ip': ip_address})

    # معالجة أول تسجيل دخول
    if is_first_login:
        await send_first_login_guidance(email, name)

    # استرجاع السلة المهملة
    abandoned_cart = await cart.get_abandoned(customer_id)
    if abandoned_cart and abandoned_cart.get('items'):
        await send_cart_reminder(customer_id, abandoned_cart)

    # تحديث نشاط الولاء
    await loyalty.update_activity(customer_id, {
        'last_login': datetime.utcnow()
    })

async def check_suspicious_login(customer_id, ip_address):
    """التحقق من تسجيل الدخول المشبوه"""
    recent_logins = await db.customer_login_log.find({
        'customer_id': customer_id
    }).sort('logged_in_at', -1).limit(10).to_list(None)

    if not recent_logins:
        return False

    last_ip = recent_logins[0].get('ip_address')
    last_country = get_ip_country(last_ip)
    current_country = get_ip_country(ip_address)

    return last_country != current_country

async def send_cart_reminder(customer_id, cart):
    """إرسال تذكير بالسلة المهملة"""
    customer = await get_customer_details(customer_id)

    if customer.get('email'):
        await email_service.send({
            'to': customer['email'],
            'template': 'cart_reminder',
            'data': {
                'name': customer.get('name'),
                'items': cart.get('items', []),
                'total': cart.get('total'),
                'discount_code': 'CART5',
                'cart_url': cart.get('url', '')
            }
        })

    if customer.get('phone'):
        await whatsapp.send({
            'to': customer['phone'],
            'message': f'لديك منتجات في سلتك. أكمل الشراء الآن!'
        })

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'customer.login':
        asyncio.create_task(handle_customer_login(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: عدد كبير جداً من أحداث تسجيل الدخول
**السبب:** قد يتم إطلاق الحدث عند كل تجديد للجلسة
**الحل:** استخدم throttling لتجنب المعالجة الزائدة

### مشكلة: تنبيهات أمان كاذبة
**السبب:** تغيير IP بشكل طبيعي (مثل استخدام VPN)
**الحل:** استخدم قائمة بيضاء (whitelist) للـ IPs المعروفة

### مشكلة: إرسال رسائل مكررة
**السبب:** تسجيل دخول متكرر من نفس العميل
**الحل:** استخدم rate limiting للرسائل

## Use Cases (حالات الاستخدام)
- تتبع نشاط العملاء
- إرسال تنبيهات الأمان
- استرجاع السلة المهملة
- عرض عروض مخصصة
- تحديث نشاط الولاء
- تخصيص التجربة بناءً على الجهاز
- تحليل سلوك العملاء

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد يتم إطلاقه بشكل متكرر للعميل نفسه
- استخدمه بحذر لتجنب إرسال رسائل مزعجة

## Related Events (أحداث ذات صلة)
- `customer.create` - عند إنشاء عميل جديد
- `customer.update` - عند تحديث بيانات العميل
- `abandoned_cart.created` - عند إنشاء سلة مهملة

## SEO Keywords
Zid webhook, customer.login, تسجيل دخول العميل, customer login webhook, زد webhook, دخول العميل, تتبع نشاط العملاء, أمان الحساب, أحداث العملاء
