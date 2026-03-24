# abandoned_cart.completed - إتمام السلة المتروكة

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند عودة العميل لإكمال شراء منتجات كانت في السلة المتروكة، إما من خلال رابط الاسترداد أو بشكل طبيعي.

**English:** This event is triggered when a customer returns to complete the purchase of products that were in the abandoned cart, either through the recovery link or naturally.

## When Triggered (متى يتم إطلاقه)
- عند عودة العميل عبر رابط الاسترداد (recovery link)
- عند إتمام الشراء لنفس المنتجات في السلة المتروكة
- عند إنشاء طلب جديد يحتوي على نفس المنتجات
- عند تحويل السلة المتروكة لطلب

## Payload Schema (هيكل البيانات)
```json
{
  "event": "abandoned_cart.completed",
  "data": {
    "id": "cart_789",
    "customer": {
      "id": 5678,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+966501234567"
    },
    "order": {
      "id": 12345,
      "reference_number": "ORD-2024-001",
      "status": "new",
      "total_amount": 328.00,
      "currency": "SAR"
    },
    "items": [
      {
        "id": 123,
        "product_id": 456,
        "product_name": "قميص رجالي أبيض",
        "sku": "SHIRT-001",
        "quantity": 2,
        "price": 149.00,
        "total": 298.00
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
    "recovery_method": "email_link",
    "time_to_recover": {
      "hours": 25,
      "minutes": 30
    },
    "reminders_sent": 2,
    "discount_used": {
      "code": "CART10",
      "amount": 32.80
    },
    "completed_at": "2024-03-26T15:30:00Z",
    "created_at": "2024-03-25T14:00:00Z"
  },
  "timestamp": "2024-03-26T15:30:00Z"
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

if ($data['event'] === 'abandoned_cart.completed') {
    $cart = $data['data'];

    $cartId = $cart['id'];
    $customer = $cart['customer'];
    $order = $cart['order'];
    $recoveryMethod = $cart['recovery_method'] ?? '';
    $timeToRecover = $cart['time_to_recover'] ?? [];
    $remindersSent = $cart['reminders_sent'] ?? 0;
    $discountUsed = $cart['discount_used'] ?? null;
    $completedAt = $cart['completed_at'];

    $customerId = $customer['id'] ?? null;
    $customerEmail = $customer['email'] ?? '';
    $customerName = $customer['name'] ?? '';
    $orderId = $order['id'] ?? null;
    $orderTotal = $order['total_amount'] ?? 0;

    // تحديث حالة السلة المهملة
    updateAbandonedCartStatus($cartId, 'recovered', [
        'order_id' => $orderId,
        'recovered_at' => $completedAt,
        'recovery_method' => $recoveryMethod,
        'reminders_sent' => $remindersSent
    ]);

    // تحليل فعالية حملات استرداد السلة
    $recoveryHours = $timeToRecover['hours'] ?? 0;
    $recoveryMinutes = $timeToRecover['minutes'] ?? 0;
    $totalTimeInMinutes = ($recoveryHours * 60) + $recoveryMinutes;

    logRecoveryMetrics([
        'cart_id' => $cartId,
        'customer_id' => $customerId,
        'time_to_recover_minutes' => $totalTimeInMinutes,
        'recovery_method' => $recoveryMethod,
        'reminders_sent' => $remindersSent,
        'discount_used' => $discountUsed ? $discountUsed['code'] : null,
        'discount_amount' => $discountUsed ? $discountUsed['amount'] : 0,
        'order_value' => $orderTotal
    ]);

    // إزالة العميل من قائمة السلات المتروكة
    removeCustomerFromList($customerId, 'abandoned_cart_customers');

    // إضافة لقائمة العملاء النشطين
    addCustomerToList($customerId, 'active_customers');

    // إرسال تأكيد استرداد السلة (إذا لم يتم إرسال تأكيد الطلب)
    if ($recoveryMethod === 'email_link') {
        sendRecoveryConfirmation($customerEmail, [
            'order_id' => $orderId,
            'customer_name' => $customerName,
            'total' => $orderTotal
        ]);
    }

    // تحديث إحصائيات السلات المتروكة
    updateAbandonedCartStats([
        'recovered' => 1,
        'recovery_method' => $recoveryMethod,
        'reminders_sent' => $remindersSent
    ]);

    // تحليل الأداء
    if ($totalTimeInMinutes <= 60) {
        // استرداد سريع - حملة فعالة
        tagCustomer($customerId, 'يستجيب بسرعة');
    } elseif ($remindersSent === 1) {
        // استرداد بعد تذكير واحد
        updateCampaignStats('first_reminder', 'success');
    }

    // حساب العائد على الاستثمار للحملة
    if ($discountUsed) {
        $campaignROI = calculateCampaignROI($cartId, $orderTotal, $discountUsed['amount']);
        logCampaignROI($cartId, $campaignROI);
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
}

function sendRecoveryConfirmation($email, $data) {
    sendEmail($email, [
        'subject' => 'شكراً لإتمام طلبك!',
        'template' => 'recovery_confirmation',
        'data' => [
            'order_id' => $data['order_id'],
            'customer_name' => $data['customer_name'],
            'total' => $data['total']
        ]
    ]);
}

function updateCampaignStats($reminderType, $status) {
    // تحديث إحصائيات الحملة
    $campaignFile = 'abandoned_cart_stats.json';
    $stats = json_decode(file_get_contents($campaignFile), true);

    $stats[$reminderType][$status]++;
    $stats[$reminderType]['conversion_rate'] =
        ($stats[$reminderType]['success'] / $stats[$reminderType]['total']) * 100;

    file_put_contents($campaignFile, json_encode($stats));
}

function calculateCampaignROI($cartId, $orderValue, $discountAmount) {
    $netRevenue = $orderValue - $discountAmount;
    $campaignCost = calculateCampaignCost($cartId);

    if ($campaignCost > 0) {
        return (($netRevenue - $campaignCost) / $campaignCost) * 100;
    }
    return 0;
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

async function handleAbandonedCartCompleted(cart) {
    const {
        id,
        customer,
        order,
        recovery_method,
        time_to_recover,
        reminders_sent,
        discount_used,
        completed_at
    } = cart;

    const customerId = customer?.id;
    const customerEmail = customer?.email;
    const customerName = customer?.name;
    const orderId = order?.id;
    const orderTotal = order?.total_amount || 0;

    // تحديث حالة السلة
    await db.abandoned_carts.update(
        { cart_id: id },
        {
            status: 'recovered',
            order_id: orderId,
            recovered_at: new Date(completed_at),
            recovery_method: recovery_method,
            reminders_sent: reminders_sent
        }
    );

    // حساب الوقت للاسترداد
    const timeInMinutes = (time_to_recover?.hours || 0) * 60 +
                         (time_to_recover?.minutes || 0);

    // تسجيل مقاييس الاسترداد
    await analytics.track('cart_recovered', {
        cart_id: id,
        customer_id: customerId,
        time_to_recover_minutes: timeInMinutes,
        recovery_method: recovery_method,
        reminders_sent: reminders_sent,
        discount_used: discount_used?.code,
        discount_amount: discount_used?.amount || 0,
        order_value: orderTotal
    });

    // تحديث قوائم العملاء
    if (customerId) {
        await crm.removeFromList(customerId, 'abandoned_cart_customers');
        await crm.addToList(customerId, 'active_customers');

        // إضافة وسوم بناءً على الأداء
        if (timeInMinutes <= 60) {
            await crm.addTag(customerId, 'يستجيب بسرعة');
        }
    }

    // تحديث إحصائيات الحملة
    await updateCampaignStats({
        reminder_type: reminders_sent === 1 ? 'first' :
                      reminders_sent === 2 ? 'second' : 'final',
        status: 'recovered',
        recovery_method: recovery_method
    });

    // حساب ROI
    if (discount_used) {
        const campaignCost = await calculateCampaignCost(id);
        const netRevenue = orderTotal - discount_used.amount;
        const roi = campaignCost > 0 ? ((netRevenue - campaignCost) / campaignCost) * 100 : 0;

        await db.campaign_metrics.insert_one({
            cart_id: id,
            roi,
            net_revenue: netRevenue,
            campaign_cost: campaignCost,
            discount_amount: discount_used.amount,
            calculated_at: new Date()
        });
    }

    // إرسال تأكيد (إذا لزم الأمر)
    if (recovery_method === 'email_link') {
        await emailService.send({
            to: customerEmail,
            template: 'recovery_confirmation',
            data: {
                order_id: orderId,
                customer_name: customerName,
                total: orderTotal
            }
        });
    }

    console.log(`Cart ${id} recovered via ${recovery_method}`);
}

async function updateCampaignStats(data) {
    const reminderType = data.reminder_type;
    const status = data.status;

    await db.campaign_stats.updateOne(
        { type: reminder_type },
        {
            $inc: {
                'total': 1,
                'recovered': status === 'recovered' ? 1 : 0
            }
        },
        { upsert: true }
    );

    // إعادة حساب معدل التحويل
    const stats = await db.campaign_stats.findOne({ type: reminder_type });
    const conversionRate = (stats.recovered / stats.total) * 100;

    await db.campaign_stats.updateOne(
        { type: reminder_type },
        { $set: { conversion_rate: conversionRate } }
    );
}

async function calculateCampaignCost(cartId) {
    // حساب تكلفة الحملة (رسائل البريد، WhatsApp، إلخ)
    const cart = await db.abandoned_carts.findOne({ cart_id: cartId });
    const remindersSent = cart?.reminders_sent || 0;

    // تكلفة كل بريد: 0.01 ريال، كل رسالة WhatsApp: 0.05 ريال
    const emailCost = remindersSent * 0.01;
    const whatsappCost = (remindersSent > 0 ? 1 : 0) * 0.05;

    return emailCost + whatsappCost;
}

// Express endpoint
app.post('/webhooks/zid', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'abandoned_cart.completed') {
        handleAbandonedCartCompleted(data.data)
            .catch(error => console.error('Abandoned cart completed error:', error));
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

async def handle_abandoned_cart_completed(cart):
    """معالجة إتمام السلة المتروكة"""
    cart_id = cart.get('id')
    customer = cart.get('customer', {})
    order = cart.get('order', {})
    recovery_method = cart.get('recovery_method', '')
    time_to_recover = cart.get('time_to_recover', {})
    reminders_sent = cart.get('reminders_sent', 0)
    discount_used = cart.get('discount_used')
    completed_at = cart.get('completed_at')

    customer_id = customer.get('id')
    customer_email = customer.get('email', '')
    customer_name = customer.get('name', '')
    order_id = order.get('id')
    order_total = order.get('total_amount', 0)

    # تحديث حالة السلة
    await db.abandoned_carts.update_one(
        {'cart_id': cart_id},
        {
            '$set': {
                'status': 'recovered',
                'order_id': order_id,
                'recovered_at': datetime.fromisoformat(completed_at.replace('Z', '+00:00')),
                'recovery_method': recovery_method,
                'reminders_sent': reminders_sent
            }
        }
    )

    # حساب الوقت للاسترداد
    time_in_minutes = (time_to_recover.get('hours', 0) * 60) + \
                     time_to_recover.get('minutes', 0)

    # تسجيل المقاييس
    await analytics.track('cart_recovered', {
        'cart_id': cart_id,
        'customer_id': customer_id,
        'time_to_recover_minutes': time_in_minutes,
        'recovery_method': recovery_method,
        'reminders_sent': reminders_sent,
        'discount_used': discount_used.get('code') if discount_used else None,
        'discount_amount': discount_used.get('amount', 0) if discount_used else 0,
        'order_value': order_total
    })

    # تحديث قوائم العملاء
    if customer_id:
        await crm.remove_from_list(customer_id, 'abandoned_cart_customers')
        await crm.add_to_list(customer_id, 'active_customers')

        # إضافة وسوم الأداء
        if time_in_minutes <= 60:
            await crm.add_tag(customer_id, 'يستجيب بسرعة')

    # تحديث إحصائيات الحملة
    reminder_type = 'first' if reminders_sent == 1 else \
                    'second' if reminders_sent == 2 else 'final'

    await update_campaign_stats(reminder_type, 'recovered', recovery_method)

    # حساب ROI
    if discount_used:
        campaign_cost = await calculate_campaign_cost(cart_id, reminders_sent)
        net_revenue = order_total - discount_used.get('amount', 0)
        roi = ((net_revenue - campaign_cost) / campaign_cost * 100) if campaign_cost > 0 else 0

        await db.campaign_metrics.insert_one({
            'cart_id': cart_id,
            'roi': roi,
            'net_revenue': net_revenue,
            'campaign_cost': campaign_cost,
            'discount_amount': discount_used.get('amount', 0),
            'calculated_at': datetime.utcnow()
        })

async def update_campaign_stats(reminder_type, status, recovery_method):
    """تحديث إحصائيات الحملة"""
    await db.campaign_stats.update_one(
        {'type': reminder_type},
        {
            '$inc': {
                'total': 1,
                'recovered': 1 if status == 'recovered' else 0
            }
        },
        upsert=True
    )

    # إعادة حساب معدل التحويل
    stats = await db.campaign_stats.find_one({'type': reminder_type})
    if stats:
        conversion_rate = (stats.get('recovered', 0) / stats.get('total', 1)) * 100
        await db.campaign_stats.update_one(
            {'type': reminder_type},
            {'$set': {'conversion_rate': conversion_rate}}
        )

async def calculate_campaign_cost(cart_id, reminders_sent):
    """حساب تكلفة الحملة"""
    # تكلفة البريد: 0.01 ريال، WhatsApp: 0.05 ريال
    email_cost = reminders_sent * 0.01
    whatsapp_cost = 0.05 if reminders_sent > 0 else 0
    return email_cost + whatsapp_cost

@app.route('/webhooks/zid', methods=['POST'])
def handle_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'abandoned_cart.completed':
        asyncio.create_task(handle_abandoned_cart_completed(data.get('data', {})))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: استلام الحدث بعد معالجة `order.create`
**الحل:** استخدم `order_id` لربط الحدثين وتجنب المعالجة المزدوجة

### مشكلة: عدم وجود `time_to_recover`
**الحل:** تعامل مع هذا الحقل كاختياري وقم بحسابه من الفارق الزمني

### مشكلة: حساب ROI خاطئ
**الحل:** احسب جميع التكاليف بما في ذلك رسوم البريد و WhatsApp

## Use Cases (حالات الاستخدام)
- قياس فعالية حملات استرداد السلة
- حساب العائد على الاستثمار
- تحليل أفضل قناة استرداد
- تحسين حملات التذكير
- إزالة العملاء من قوائم الاستهداف
- تحليل سلوك العملاء

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions)
- قد يصل مع `order.create` لنفس العملية
- استخدم `recovery_method` لتحليل القنوات الأكثر فعالية

## Related Events (أحداث ذات صلة)
- `abandoned_cart.created` - عند إنشاء السلة المهملة
- `order.create` - عند إنشاء طلب جديد

## SEO Keywords
Zid webhook, abandoned_cart.completed, إتمام السلة المتروكة, abandoned cart recovered webhook, زد webhook, استرداد السلة, إكمال الشراء, سلة مستردة
