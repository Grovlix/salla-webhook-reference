# order.payment_status.update - تحديث حالة الدفع

## Description (الوصف)
**Arabic:** يتم إطلاق هذا الحدث عند تغيير حالة الدفع للطلب، مثل اكتمال الدفع أو استرداد المبلغ.

**English:** This event is triggered when an order's payment status changes, such as payment completion or refund.

## When Triggered (متى يتم إطلاقه)
- عند اكتمال الدفع وتحويل الحالة إلى "paid"
- عند فشل الدفع وتحويل الحالة إلى "unpaid"
- عند استرداد المبلغ (refund)
- عند إلغاء العملية (void)

## Payment Status Values (قيم حالات الدفع)
| الحالة | بالعربية | الوصف |
|-------|---------|-------|
| `paid` | مدفوع | تم اكتمال الدفع بنجاح |
| `unpaid` | غير مدفوع | الدفع لم يكتمل أو فشل |
| `pending` | قيد الانتظار | الدفع قيد المعالجة |
| `refunded` | مسترد | تم استرداد المبلغ للعميل |
| `voided` | ملغي | تم إلغاء عملية الدفع |

## Payload Schema (هيكل البيانات)
```json
{
  "event": "order.payment_status.update",
  "data": {
    "id": 12345,
    "reference_number": "ORD-2024-001",
    "status": "preparing",
    "payment_status": "paid",
    "previous_payment_status": "pending",
    "currency": "SAR",
    "total_amount": 299.99,
    "paid_amount": 299.99,
    "refund_amount": 0.00,
    "payment_method": "Credit Card",
    "payment_gateway": "tamara",
    "customer": {
      "id": 5678,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+966501234567"
    },
    "transactions": [
      {
        "id": "txn_123456",
        "type": "payment",
        "amount": 299.99,
        "status": "success",
        "created_at": "2024-03-25T10:30:00Z"
      }
    ],
    "updated_at": "2024-03-25T10:35:00Z"
  },
  "timestamp": "2024-03-25T10:35:00Z"
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

if ($data['event'] === 'order.payment_status.update') {
    $order = $data['data'];
    $paymentStatus = $order['payment_status'];
    $previousStatus = $order['previous_payment_status'] ?? null;
    $orderId = $order['id'];
    $amount = $order['total_amount'];
    $paymentMethod = $order['payment_method'];

    // معالجة تغيير حالة الدفع
    switch ($paymentStatus) {
        case 'paid':
            // تفعيل الطلب وإرسال تأكيد
            if ($previousStatus === 'pending' || $previousStatus === 'unpaid') {
                activateOrder($orderId);
                sendPaymentConfirmation($order['customer']['email'], $orderId, $amount);
                //.notify نظام المحاسبة
                updateAccountingSystem($orderId, $amount, 'income');
            }
            break;

        case 'unpaid':
            // تنبيه بشأن الدفع الفاشل
            sendPaymentFailedNotice($order['customer']['email'], $orderId);
            updateOrderStatus($orderId, 'payment_failed');
            break;

        case 'refunded':
            // معالجة الاسترداد
            $refundAmount = $order['refund_amount'] ?? $amount;
            processRefundInAccounting($orderId, $refundAmount);
            sendRefundConfirmation($order['customer']['email'], $orderId, $refundAmount);
            break;

        case 'voided':
            // إلغاء العملية
            voidOrderInAccounting($orderId);
            sendVoidNotice($order['customer']['email'], $orderId);
            break;
    }

    // تسجيل التغيير
    logPaymentStatusChange($orderId, $previousStatus, $paymentStatus, $amount);

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

const paymentStatusHandlers = {
    'paid': async (order) => {
        const { id, customer, total_amount, previous_payment_status } = order;

        // معالجة اكتمال الدفع
        if (['pending', 'unpaid'].includes(previous_payment_status)) {
            await activateOrder(id);
            await sendEmail(customer.email, {
                template: 'payment_confirmation',
                orderId: id,
                amount: total_amount
            });

            // تحديث نظام المحاسبة
            await accounting.recordPayment({
                orderId: id,
                amount: total_amount,
                method: order.payment_method,
                type: 'income'
            });
        }
    },

    'unpaid': async (order) => {
        const { id, customer } = order;

        await sendEmail(customer.email, {
            template: 'payment_failed',
            orderId: id
        });

        await updateOrderFlag(id, 'payment_issue');
    },

    'refunded': async (order) => {
        const { id, customer, refund_amount, total_amount } = order;
        const amount = refund_amount || total_amount;

        await accounting.recordRefund({
            orderId: id,
            amount: amount
        });

        await sendEmail(customer.email, {
            template: 'refund_confirmation',
            orderId: id,
            refundAmount: amount
        });
    },

    'voided': async (order) => {
        const { id, customer } = order;

        await accounting.voidTransaction(id);
        await sendEmail(customer.email, {
            template: 'payment_voided',
            orderId: id
        });
    }
};

async function handlePaymentStatusUpdate(order) {
    const { payment_status, id, total_amount, previous_payment_status } = order;

    const handler = paymentStatusHandlers[payment_status];
    if (handler) {
        await handler(order);
    }

    // تسجيل العملية
    await logPaymentActivity({
        orderId: id,
        fromStatus: previous_payment_status,
        toStatus: payment_status,
        amount: total_amount,
        timestamp: new Date()
    });
}

// Express endpoint
app.post('/webhooks/zid/payment', express.raw({type: 'application/json'}), async (req, res) => {
    const signature = req.headers['x-zid-signature'];
    const secret = 'your_webhook_secret';

    if (!verifyWebhookSignature(req.body, signature, secret)) {
        return res.status(403).json({ error: 'Invalid signature' });
    }

    const data = JSON.parse(req.body);

    if (data.event === 'order.payment_status.update') {
        handlePaymentStatusUpdate(data.data)
            .catch(error => console.error('Payment status error:', error));
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

async def handle_paid_status(order):
    """معالجة اكتمال الدفع"""
    order_id = order.get('id')
    customer = order.get('customer', {})
    amount = order.get('total_amount')
    previous_status = order.get('previous_payment_status')

    if previous_status in ['pending', 'unpaid']:
        # تفعيل الطلب
        await activate_order(order_id)

        # إرسال تأكيد
        await send_email(customer.get('email'), {
            'template': 'payment_confirmation',
            'order_id': order_id,
            'amount': amount
        })

        # تحديث المحاسبة
        await accounting.record_payment({
            'order_id': order_id,
            'amount': amount,
            'type': 'income'
        })

async def handle_refunded_status(order):
    """معالجة استرداد المبلغ"""
    order_id = order.get('id')
    customer = order.get('customer', {})
    refund_amount = order.get('refund_amount') or order.get('total_amount')

    await accounting.record_refund(order_id, refund_amount)
    await send_email(customer.get('email'), {
        'template': 'refund_confirmation',
        'order_id': order_id,
        'refund_amount': refund_amount
    })

PAYMENT_HANDLERS = {
    'paid': handle_paid_status,
    'unpaid': lambda o: send_payment_failed_notice(o),
    'refunded': handle_refunded_status,
    'voided': lambda o: void_payment_transaction(o),
}

@app.route('/webhooks/zid/payment', methods=['POST'])
def handle_payment_webhook():
    signature = request.headers.get('X-Zid-Signature', '')
    secret = 'your_webhook_secret'
    payload = request.get_data(as_text=True)

    if not verify_webhook_signature(payload, signature, secret):
        return jsonify({'error': 'Invalid signature'}), 403

    data = json.loads(payload)

    if data.get('event') == 'order.payment_status.update':
        order = data.get('data', {})
        payment_status = order.get('payment_status')

        handler = PAYMENT_HANDLERS.get(payment_status)
        if handler:
            # المعالجة غير المتزامنة
            asyncio.create_task(handler(order))

    return jsonify({'received': True}), 200
```

## Common Issues (مشاكل شائعة)

### مشكلة: استلام إشعار الدفع قبل تأكيد البنك
**الحل:** تعامل مع حالة `pending` كحالة وسيطة ولا تفعّل الطلب حتى تصل الحالة `paid`.

### مشكلة: استرداد جزئي للدفع
**الحل:** تحقق من حقل `refund_amount` فقد يكون أقل من `total_amount` في حالات الاسترداد الجزئي.

### مشكلة: تكرار إشعات الدفع
**الحل:** استخدم combination من `order.id` و `payment_status` و `timestamp` لتحديد العمليات الفريدة.

## Important Notes (ملاحظات مهمة)
- هذا الحدث **لا يدعم** الشروط (conditions) عند الاشتراك
- تأكد من معالجة حالة `paid` بأولوية قصوى
- احتفظ بسجل لجميع تغييرات حالة الدفع لغرض المراجعة المحاسبية
- قد يصل هذا الـ webhook قبل أو بعد `order.status.update`

## Use Cases (حالات الاستخدام)
- تفعيل الطلب عند اكتمال الدفع
- إرسال إيصالات الدفع للعملاء
- تحديث أنظمة المحاسبة
- معالجة الاستردادات وإشعاراتها
- مزامنة مع بوابات الدفع الخارجية
- إنشاء فواتير تلقائياً

## SEO Keywords
Zid webhook, order.payment_status.update, تحديث حالة الدفع, payment status webhook, زد webhook, حالة الدفع, استرداد المبلغ, اكتمال الدفع, أحداث الدفع
