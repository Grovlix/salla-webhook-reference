# payment.failed - فشل الدفع

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند فشل محاولة الدفع. قد يكون بسبب نقص في الرصيد أو بيانات غير صحيحة أو مشاكل تقنية.

**English:** This event is triggered when payment attempt fails. Could be due to insufficient funds, incorrect details, or technical issues.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند رفض البطاقة من البنك
- **English:** When card is declined by bank
- **العربية:** عند انتهاء مهلة الدفع
- **English:** When payment timeout expires
- **العربية:** عند إدخال بيانات خاطئة
- **English:** When incorrect details are entered

## Payload Schema (هيكل البيانات)

```json
{
  "event": "payment.failed",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "order_id": 12345,
    "amount": 200.00,
    "currency": "SAR",
    "payment_method": "visa",
    "gateway": "checkout",
    "error_code": "insufficient_funds",
    "error_message": "Insufficient funds in account",
    "failed_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

## Error Codes (رموز الخطأ)

| Code (الرمز) | Description (الوصف) |
|--------------|---------------------|
| `insufficient_funds` | رصيد غير كافٍ |
| `card_declined` | رفض البطاقة |
| `expired_card` | البطاقة منتهية |
| `incorrect_cvc` | رمز CVC غير صحيح |
| `timeout` | انتهت مهلة العملية |
| `technical_error` | خطأ تقني |

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
    if ($payload['event'] === 'payment.failed') {
        $payment = $payload['data'];
        $orderId = $payment['order_id'];
        $errorCode = $payment['error_code'];
        $errorMessage = $payment['error_message'];

        // تحديث حالة الطلب
        updateOrderStatus($orderId, 'payment_failed');

        // إخطار العميل
        notifyPaymentFailed($orderId, $errorMessage);

        // تسجيل الخطأ للتحليل
        logPaymentError($payment);

        error_log("Payment failed: Order {$orderId}, Error: {$errorCode}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function notifyPaymentFailed($orderId, $errorMessage) {
    // إرسال براء إلكتروني للعميل بخطأ الدفع
    global $pdo;

    $stmt = $pdo->prepare("SELECT customer_email FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $customerEmail = $stmt->fetchColumn();

    $subject = "فشل عملية الدفع - حاول مرة أخرى";
    $message = "
        <html>
        <body>
            <h1>عذراً، فشلت عملية الدفع</h1>
            <p>حدث خطأ أثناء محاولة الدفع: {$errorMessage}</p>
            <p><a href='https://store.salla.dev/checkout/{$orderId}'>حاول مرة أخرى</a></p>
        </body>
        </html>
    ";

    mail($customerEmail, $subject, $message, "Content-type: text/html\r\n");
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

async function handlePaymentFailed(payment) {
    const { order_id, error_code, error_message } = payment;

    // تحديث حالة الطلب
    await db.orders.updateOne(
        { order_id: order_id },
        { $set: { status: 'payment_failed', payment_error: error_message } }
    );

    // إخطار العميل
    await emailService.send({
        template: 'payment_failed',
        to: await getCustomerEmail(order_id),
        data: {
            order_id: order_id,
            error_message: error_message,
            retry_url: `https://store.salla.dev/checkout/${order_id}`
        }
    });

    // تسجيل للتحليل
    await analytics.track({
        event: 'payment_failed',
        order_id: order_id,
        error_code: error_code,
        timestamp: new Date()
    });

    console.log(`Payment failed: Order ${order_id}, Error: ${error_code}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'payment.failed') {
            await handlePaymentFailed(req.body.data);
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

def handle_payment_failed(payment):
    order_id = payment['order_id']
    error_code = payment['error_code']
    error_message = payment['error_message']

    # تحديث حالة الطلب
    update_order_status(order_id, 'payment_failed')

    # إخطار العميل
    notify_payment_failed(order_id, error_message)

    print(f"Payment failed: Order {order_id}, Error: {error_code}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'payment.failed':
            handle_payment_failed(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: عدم وجود رسالة خطأ واضحة

**العربية:** قد لا تكون رسالة الخطأ مفيدة للعميل.

**English:** Error message might not be helpful to customer.

**الحل (Solution):** قم بترجمة رموز الخطأ لرسائل واضحة:

```php
$errorMessages = [
    'insufficient_funds' => 'رصيد غير كافٍ في البطاقة',
    'expired_card' => 'البطاقة منتهية الصلاحية',
    'incorrect_cvc' => 'رمز الأمان غير صحيح'
];

$userMessage = $errorMessages[$errorCode] ?? $errorMessage;
```

## Best Practices (أفضل الممارسات)

- **العربية:** أرسل رسالة خطأ واضحة ومفيدة للعميل
- **English:** Send clear and helpful error message to customer
- **العربية:** قدم رابطاً لإعادة محاولة الدفع
- **English:** Provide link to retry payment
- **العربية:** تتبع معدلات فشل الدفع للتحليل
- **English:** Track payment failure rates for analysis

## SEO Keywords

**English:** Salla webhook, payment.failed event, payment failure webhook, e-commerce payment errors

**العربية:** ويب هوك سلة، حدث فشل الدفع، إشعار فشل الدفع، أخطاء الدفع الإلكتروني

## Related Events (أحداث ذات صلة)

- [payment.paid](./payment.paid.md) - دفع ناجح
- [order.cancelled](../order/order.cancelled.md) - إلغاء طلب

---

*Last Updated: مارس 2026*
