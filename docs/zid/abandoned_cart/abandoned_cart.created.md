# abandoned_cart.created - إنشاء سلة متروكة

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند إضافة عميل لمنتجات في السلة ثم مغادرته المتجر دون إتمام عملية الشراء.

**English:** This event is triggered when a customer adds items to their cart but leaves the store without completing the purchase.

## When Triggered (متى يتم إطلاقه)
- عند مغادرة العميل للمتجر بعد إضافة منتجات للسلة
- بعد فترة زمنية محددة من عدم النشاط على السلة
- عند إغلاق المتصفح مع وجود منتجات في السلة
- **ملاحظة:** الوقت المحدد لإطلاق الحدث يعتمد على إعدادات المتجر

## Payload Schema (هيكل البيانات)
```json
{
  "event": "abandoned_cart.created",
  "data": {
    "id": "cart_789",
    "customer": {
      "id": 5678,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+966501234567"
    },
    "items": [
      {
        "id": 123,
        "product_id": 456,
        "product_name": "قميص رجالي أبيض",
        "sku": "SHIRT-001",
        "quantity": 2,
        "price": 149.00,
        "total": 298.00,
        "image": "https://cdn.zid.sa/product/image.jpg",
        "url": "https://store.zid.sa/products/white-shirt"
      }
    ],
    "totals": {
      "subtotal": 298.00,
      "shipping": 30.00,
      "discount": 0.00,
      "tax": 0.00,
      "total": 328.00,
      "currency": "SAR"
    },
    "cart_url": "https://store.zid.sa/cart?token=abc123",
    "recovery_url": "https://store.zid.sa/cart/recover?cart_id=cart_789",
    "created_at": "2024-03-25T14:00:00Z",
    "abandoned_at": "2024-03-25T14:30:00Z",
    "expires_at": "2024-03-26T14:30:00Z"
  },
  "timestamp": "2024-03-25T14:30:00Z"
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

if ($data['event'] === 'abandoned_cart.created') {
    $cart = $data['data'];

    $cartId = $cart['id'];
    $customer = $cart['customer'];
    $items = $cart['items'] ?? [];
    $totals = $cart['totals'] ?? [];
    $cartUrl = $cart['cart_url'] ?? '';
    $recoveryUrl = $cart['recovery_url'] ?? '';
    $abandonedAt = $cart['abandoned_at'];

    $customerId = $customer['id'] ?? null;
    $customerEmail = $customer['email'] ?? '';
    $customerPhone = $customer['phone'] ?? '';
    $customerName = $customer['name'] ?? '';

    // حفظ السلة المهملة في قاعدة البيانات
    saveAbandonedCart([
        'cart_id' => $cartId,
        'customer_id' => $customerId,
        'customer_email' => $customerEmail,
        'customer_phone' => $customerPhone,
        'items' => json_encode($items),
        'total' => $totals['total'] ?? 0,
        'cart_url' => $cartUrl,
        'recovery_url' => $recoveryUrl,
        'abandoned_at' => $abandonedAt,
        'status' => 'pending',
        'reminders_sent' => 0
    ]);

    // جدولة إرسال التذكيرات
    scheduleCartReminder($cartId, [
        'delay' => '1 hour',
        'type' => 'first_reminder'
    ]);

    scheduleCartReminder($cartId, [
        'delay' => '24 hours',
        'type' => 'second_reminder',
        'include_discount' => true,
        'discount_code' => 'CART10',
        'discount_value' => '10%'
    ]);

    scheduleCartReminder($cartId, [
        'delay' => '72 hours',
        'type' => 'final_reminder',
        'include_discount' => true,
        'discount_code' => 'CART15',
        'discount_value' => '15%'
    ]);

    // إضافة العميل لقائمة "السلة المهملة" في CRM
    addCustomerToList($customerId, 'abandoned_cart_customers');

    // تحليل المنتجات المتروكة
    $abandonedProducts = array_map(function($item) {
        return $item['product_id'];
    }, $items);
    updateAbandonedProductStats($abandonedProducts);

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function scheduleCartReminder($cartId, $options) {
    // جدولة تذكير السلة
    $delay = $options['delay'];
    $type = $options['type'];

    // إضافة لقائمة الانتظار
    queueJob('cart_reminder', [
        'cart_id' => $cartId,
        'type' => $type,
        'include_discount' => $options['include_discount'] ?? false,
        'discount_code' => $options['discount_code'] ?? null,
        'discount_value' => $options['discount_value'] ?? null,
        'scheduled_at' => calculateDelayTime($delay)
    ]);
}

function sendCartReminder($cartId, $type, $options = []) {
    $cart = getAbandonedCart($cartId);
    if (!$cart || $cart['status'] === 'recovered') {
        return; // السلة تم استردادها بالفعل
    }

    $customerEmail = $cart['customer_email'];
    $customerPhone = $cart['customer_phone'];
    $items = json_decode($cart['items'], true);

    // إرسال تذكير بالبريد الإلكتروني
    if ($customerEmail) {
        sendEmail($customerEmail, [
            'subject' => getReminderSubject($type),
            'template' => 'cart_reminder_' . $type,
            'data' => [
                'items' => $items,
                'cart_url' => $cart['recovery_url'],
                'discount_code' => $options['discount_code'] ?? null,
                'discount_value' => $options['discount_value'] ?? null,
                'expires_at' => $cart['expires_at']
            ]
        ]);
    }

    // إرسال تذكير WhatsApp
    if ($customerPhone && $type === 'first_reminder') {
        sendWhatsAppMessage($customerPhone, getWhatsAppMessage($cart));
    }

    // تحديث عدد التذكيرات المرسلة
    updateReminderCount($cartId);
}

function getReminderSubject($type) {
    $subjects = [
        'first_reminder' => 'لقد نسيت شيئاً في سلتك!',
        'second_reminder' => 'خصم خاص لك - أكمل شراءك الآن',
        'final_reminder' => 'آخر فرصة - سلتك بانتظارك'
    ];
    return $subjects[$type] ?? 'تذكير بالسلة';
}
```

### JavaScript (Node.js)
```javascript
const crypto = require('crypto');
const { setTimeout } = require('timers/promises');

function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

async function handleAbandonedCartCreated(cart) {
    const {
        id,
        customer,
        items,
        totals,
        cart_url,
        recovery_url,
        abandoned_at,
        expires_at
    } = cart;

    const customerId = customer?.id;
    const customerEmail = customer?.email;
    const customerPhone = customer?.phone;
    const customerName = customer?.name;

    // حفظ السلة المهملة
    await db.abandoned_carts.create({
        cart_id: id,
        customer_id: customerId,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: items,
        total: totals?.total || 0,
        currency: totals?.currency,
        cart_url,
        recovery_url,
        abandoned_at: new Date(abandoned_at),
        expires_at: new Date(expires_at),
        status: 'pending',
        reminders_sent: 0
    });

    // إضافة لقائمة CRM
    if (customerId) {
        await crm.addToList(customerId, 'abandoned_cart_customers');
    }

    // تحليل المنتجات المتروكة
    const productIds = items.map(item => item.product_id);
    await analytics.trackAbandonedProducts(productIds);

    // جدولة التذكيرات
    await scheduleReminders(id, {
        customerEmail,
        customerPhone,
        customerName,
        items,
        recovery_url,
        totals,
        expires_at
    });

    console.log(`Abandoned cart ${id} saved and reminders scheduled`);
}

async function scheduleReminders(cartId, cartData) {
    const reminders = [
        {
            delay: 60 * 60 * 1000, // 1 ساعة
            type: 'first_reminder',
            template: 'cart_reminder_1'
        },
        {
            delay: 24 * 60 * 60 * 1000, // 24 ساعة
            type: 'second_reminder',
            template: 'cart_reminder_2',
            includeDiscount: true,
            discountCode: 'CART10',
            discountValue: '10%'
        },
        {
            delay: 72 * 60 * 60 * 1000, // 72 ساعة
            type: 'final_reminder',
            template: 'cart_reminder_3',
            includeDiscount: true,
            discountCode: 'CART15',
            discountValue: '15%'
        }
    ];

    for (const reminder of reminders) {
        // إضافة لقائمة الانتظار (استخدم Bull/Agenda/etc.)
        await queue.add('cart_reminder', {
            cartId,
            ...reminder,
            cartData
        }, {
            delay: reminder.delay
        });
    }
}

// معالج التذكير
async function processCartReminder(job) {
    const { cartId, type, cartData, includeDiscount, discountCode, discountValue } = job.data;

    // التحقق من أن السلة لم تتم استعادتها
    const cart = await db.abandoned_carts.findOne({
        where: { cart_id: cartId }
    });

    if (!cart || cart.status === 'recovered') {
        return; // السلة تم استردادها أو محذوفة
    }

    // إرسال التذكير
    await sendCartReminderEmail(cartData.customerEmail, {
        type,
        items: cartData.items,
        recoveryUrl: cartData.recovery_url,
        includeDiscount,
        discountCode,
        discountValue,
        expiresAt: cartData.expires_at,
        total: cartData.totals.total,
        currency: cartData.totals.currency
    });

    // إرسال WhatsApp للتذكير الأول
    if (type === 'first_reminder' && cartData.customerPhone) {
        await whatsappService.send({
            to: cartData.customerPhone,
            message: `مرحباً ${cartData.customerName}! 🛒\nلديك منتجات في سلتك بانتظارك. أكمل شراءك الآن:\n${cartData.recovery_url}`
        });
    }

    // تحديث عدد التذكيرات
    await db.abandoned_carts.update(
        { cart_id: cartId },
        { reminders_sent: cart.reminders_sent + 1 }
    );
}

async function sendCartReminderEmail(email, data) {
    const subjects = {
        first_reminder: 'لقد نسيت شيئاً في سلتك!',
        second_reminder: 'خصم خاص لك - أكمل شراءك الآن',
        final_reminder: 'آخر فرصة - سلتك بانتظارك'
    };

    await emailService.send({
        to: email,
        subject: subjects[data.type],
        template: data.type,
        data: {
            items: data.items,
            recoveryUrl: data.recoveryUrl,
            discountCode: data.discountCode,
            discountValue: data.discountValue,
            total: data.total,
            currency: data.currency,
            expiresAt: data.expiresAt
        }
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

    if (data.event === 'abandoned_cart.created') {
        handleAbandonedCartCreated(data.data)
            .catch(error => console.error('Abandoned cart error:', error));
    }

    res.status(200).json({ received: true });
});

// معالج وظائف قائمة الانتظار
queue.process('cart_reminder', processCartReminder);
```

### Python
```python
import hmac
import hashlib
import json
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
from celery import Celery

app = Flask(__name__)
celery = Celery('tasks', broker='redis://localhost:6379')

async def handle_abandoned_cart_created(cart):
    """معالجة إنشاء السلة المهملة"""
    cart_id = cart.get('id')
    customer = cart.get('customer', {})
    items = cart.get('items', [])
    totals = cart.get('totals', {})
    cart_url = cart.get('cart_url', '')
    recovery_url = cart.get('recovery_url', '')
    abandoned_at = cart.get('abandoned_at')
    expires_at = cart.get('expires_at')

    customer_id = customer.get('id')
    customer_email = customer.get('email', '')
    customer_phone = customer.get('phone', '')
    customer_name = customer.get('name', '')

    # حفظ السلة المهملة
    await db.abandoned_carts.insert_one({
        'cart_id': cart_id,
        'customer_id': customer_id,
        'customer_email': customer_email,
        'customer_phone': customer_phone,
        'items': items,
        'total': totals.get('total', 0),
        'currency': totals.get('currency'),
        'cart_url': cart_url,
        'recovery_url': recovery_url,
        'abandoned_at': datetime.fromisoformat(abandoned_at.replace('Z', '+00:00')),
        'expires_at': datetime.fromisoformat(expires_at.replace('Z', '+00:00')),
        'status': 'pending',
        'reminders_sent': 0
    })

    # إضافة لقائمة CRM
    if customer_id:
        await crm.add_to_list(customer_id, 'abandoned_cart_customers')

    # جدولة التذكيرات
    await schedule_reminders.delay(cart_id, {
        'customer_email': customer_email,
        'customer_phone': customer_phone,
        'customer_name': customer_name,
        'items': items,
        'recovery_url': recovery_url,
        'totals': totals,
        'expires_at': expires_at
    })

@celery.task
def schedule_reminders(cart_id, cart_data):
    """جدولة تذكيرات السلة"""
    reminders = [
        {
            'delay': 3600,  # 1 ساعة
            'type': 'first_reminder'
        },
        {
            'delay': 86400,  # 24 ساعة
            'type': 'second_reminder',
            'include_discount': True,
            'discount_code': 'CART10',
            'discount_value': '10%'
        },
        {
            'delay': 259200,  # 72 ساعة
            'type': 'final_reminder',
            'include_discount': True,
            'discount_code': 'CART15',
            'discount_value': '15%'
        }
    ]

    for reminder in reminders:
        send_cart_reminder.apply_async(
            args=[cart_id, cart_data, reminder],
            countdown=reminder['delay']
        )

@celery.task
def send_cart_reminder(cart_id, cart_data, reminder):
    """إرسال تذكير السلة"""
    # التحقق من السلة
    cart = db.abandoned_carts.find_one({'cart_id': cart_id})

    if not cart or cart.get('status') == 'recovered':
        return

    # إرسال البريد الإلكتروني
    if cart_data.get('customer_email'):
        email_service.send({
            'to': cart_data['customer_email'],
            'template': f"cart_reminder_{reminder['type']}",
            'data': {
                'items': cart_data['items'],
                'recovery_url': cart_data['recovery_url'],
                'discount_code': reminder.get('discount_code'),
                'discount_value': reminder.get('discount_value'),
                'total': cart_data['totals'].get('total'),
                'currency': cart_data['totals'].get('currency')
            }
        })

    # تحديث عدد التذكيرات
    db.abandoned_carts.update_one(
        {'cart_id': cart_id},
        {'$inc': {'reminders_sent': 1}}
    )

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'abandoned_cart.created':
        asyncio.create_task(handle_abandoned_cart_created(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: استلام نفس السلة المتروكة عدة مرات
**الحل:** استخدم `cart_id` كمعرف فريد وتحقق من وجوده قبل المعالجة

### مشكلة: إرسال تذكيرات بعد استرداد السلة
**الحل:** تحقق دائماً من حالة السلة قبل إرسال التذكير

### مشكلة: انتهاء صلاحية رابط الاسترداد
**الحل:** تحقق من `expires_at` قبل إرسال التذكيرات

## Use Cases (حالات الاستخدام)
- إرسال تذكيرات بالبريد الإلكتروني
- إرسال رسائل WhatsApp
- تقديم خصومات حصرية
- تحليل المنتجات الأكثر تركاً
- إعادة المشاركة (Retargeting) بالإعلانات
- تحسين معدل التحويل

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- استخدم `recovery_url` لتسهيل عودة العميل
- تحقق من انتهاء صلاحية السلة قبل التذكير

## Related Events (أحداث ذات صلة)
- `abandoned_cart.completed` - عند استرداد السلة
- `customer.login` - عند تسجيل دخول العميل
- `order.create` - عند إنشاء طلب جديد

## SEO Keywords
Zid webhook, abandoned_cart.created, سلة متروكة, abandoned cart webhook, زد webhook, استرداد السلة, تذكير بالسلة, سلة مهملة, استرجاع السلة
