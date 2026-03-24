# payment.paid - دفع ناجح

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إتمام عملية الدفع بنجاح. هذا الحدث مهم لconfirm الطلبات وتحديث المخزون.

**English:** This event is triggered when payment is successfully completed. This event is important for confirming orders and updating inventory.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إتمام الدفع عبر البطاقة
- **English:** When payment is completed via card
- **العربية:** عند الدفع عبر Apple Pay أو STC Pay
- **English:** When paying via Apple Pay or STC Pay
- **العربية:** عند تأكيد الدفع النقدي
- **English:** When cash payment is confirmed

## Payload Schema (هيكل البيانات)

```json
{
  "event": "payment.paid",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "order_id": 12345,
    "amount": 200.00,
    "currency": "SAR",
    "payment_method": "visa",
    "gateway": "checkout",
    "transaction_id": "TXN123456789",
    "status": "paid",
    "paid_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

## Payment Methods (طرق الدفع)

| Method | Description (الوصف) |
|--------|---------------------|
| `visa` | Visa/Mastercard |
| `mada` | Mada |
| `applepay` | Apple Pay |
| `stc_pay` | STC Pay |
| `cod` | الدفع عند الاستلام |
| `tabby` | Tabby Installments |
| `tamara` | Tamara Installments |
| `checkout` | Checkout.com |

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
    if ($payload['event'] === 'payment.paid') {
        $payment = $payload['data'];
        $orderId = $payment['order_id'];
        $amount = $payment['amount'];
        $transactionId = $payment['transaction_id'];

        // تأكيد الطلب
        confirmOrder($orderId);

        // خصم المخزون
        deductInventory($orderId);

        // إرسال إشعار الدفع
        sendPaymentConfirmationEmail($orderId, $amount, $transactionId);

        // تسجيل المعاملة
        logTransaction($payment);

        error_log("Payment received: Order {$orderId}, Amount: {$amount}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function confirmOrder($orderId) {
    // تأكيد الطلب في النظام
    global $pdo;

    $stmt = $pdo->prepare("UPDATE orders SET status = 'confirmed' WHERE order_id = ?");
    $stmt->execute([$orderId]);
}

function deductInventory($orderId) {
    // خصم المخزون للمنتجات في الطلب
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT product_id, quantity FROM order_items WHERE order_id = ?
    ");
    $stmt->execute([$orderId]);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($items as $item) {
        $updateStmt = $pdo->prepare("
            UPDATE products SET quantity = quantity - ? WHERE id = ?
        ");
        $updateStmt->execute([$item['quantity'], $item['product_id']]);
    }
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

async function handlePaymentPaid(payment) {
    const { order_id, amount, transaction_id, payment_method } = payment;

    // تأكيد الطلب
    await db.orders.updateOne(
        { order_id: order_id },
        { $set: { status: 'confirmed', payment_status: 'paid' } }
    );

    // خصم المخزون
    const items = await db.order_items.find({ order_id: order_id });
    for (const item of items) {
        await db.products.updateOne(
            { id: item.product_id },
            { $inc: { quantity: -item.quantity } }
        );
    }

    // إرسال تأكيد
    await emailService.send({
        template: 'payment_confirmation',
        to: await getCustomerEmail(order_id),
        data: { order_id, amount, transaction_id }
    });

    // تسجيل المعاملة
    await db.transactions.insert({
        ...payment,
        created_at: new Date()
    });

    console.log(`Payment received: Order ${order_id}, Amount: ${amount}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'payment.paid') {
            await handlePaymentPaid(req.body.data);
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

def handle_payment_paid(payment):
    order_id = payment['order_id']
    amount = payment['amount']
    transaction_id = payment['transaction_id']

    # تأكيد الطلب
    confirm_order(order_id)

    # خصم المخزون
    deduct_inventory(order_id)

    # إرسال تأكيد
    send_payment_confirmation(order_id, amount, transaction_id)

    print(f"Payment received: Order {order_id}, Amount: {amount}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'payment.paid':
            handle_payment_paid(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: دفع مكرر

**العربية:** قد يتم استقبال نفس حدث الدفع مرتين.

**English:** Same payment event might be received twice.

**الحل (Solution):** استخدم معرف المعاملة الفريد:

```php
if (isTransactionAlreadyProcessed($transactionId)) {
    http_response_code(200);
    exit;
}
markTransactionAsProcessed($transactionId);
```

### Issue 2: تأكيد الطلب قبل الدفع الفعلي

**العربية:** قد يتم تأكيد القبل قبل اكتمال الدفع.

**English:** Order might be confirmed before actual payment completion.

**الحل (Solution):** تحقق دائماً من حالة الدفع:

```javascript
if (payment.status === 'paid' && payment.verified) {
    await confirmOrder(orderId);
}
```

## Best Practices (أفضل الممارسات)

- **العربية:** تحقق دائماً من صحة الدفع قبل تأكيد الطلب
- **English:** Always verify payment validity before confirming order
- **العربية:** استخدم معاملات قاعدة البيانات لضمان التناسق
- **English:** Use database transactions to ensure consistency
- **العربية:** احتفظ بسجل لجميع المعاملات
- **English:** Keep a log of all transactions

## SEO Keywords

**English:** Salla webhook, payment.paid event, payment success webhook, e-commerce payment, Salla payment API

**العربية:** ويب هوك سلة، حدث الدفع الناجح، إشعار دفع ناجح، دفع إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [payment.failed](./payment.failed.md) - فشل الدفع
- [payment.refunded](./payment.refunded.md) - استرداد الدفع
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
