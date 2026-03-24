# cart.abandoned - سلة متروكة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عندما يترك العميل منتجات في سلة التسوق دون إتمام الشراء لفترة زمنية محددة. مفيد لإرسال تذكيرات واستعادة المبيعات الضائعة.

**English:** This event is triggered when a customer leaves items in their shopping cart without completing the purchase for a specified time period. Useful for sending reminders and recovering lost sales.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند مرور فترة زمنية محددة على ترك السلة (عادة 30 دقيقة إلى 24 ساعة)
- **English:** When a specified time period passes after cart abandonment (usually 30 minutes to 24 hours)
- **العربية:** عند مغادرة العميل للمتجر بعد إضافة منتجات للسلة
- **English:** When customer leaves the store after adding items to cart

## Payload Schema (هيكل البيانات)

```json
{
  "event": "cart.abandoned",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "customer": {
      "id": 98765,
      "name": "اسم العميل",
      "email": "customer@example.com",
      "phone": "+966500000000"
    },
    "items": [
      {
        "product_id": 222,
        "name": "اسم المنتج",
        "quantity": 1,
        "price": 100.00,
        "image": "https://cdn.salla.dev/product.jpg"
      }
    ],
    "total": 100.00,
    "currency": "SAR",
    "abandoned_at": "2024-01-01T12:00:00Z",
    "recover_url": "https://store.salla.dev/cart/recover/abc123"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

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
    if ($payload['event'] === 'cart.abandoned') {
        $cart = $payload['data'];
        $customerEmail = $cart['customer']['email'];
        $customerPhone = $cart['customer']['phone'];
        $recoverUrl = $cart['recover_url'];

        // إرسال بريد تذكير بالسلة المتروكة
        sendAbandonedCartEmail($customerEmail, $cart);

        // إرسال رسالة SMS تذكيرية
        sendAbandonedCartSMS($customerPhone, $cart);

        // حفظ السلة للمتابعة
        saveAbandonedCart($cart);

        // إضافة كهدف لحملات إعادة الاستهداف
        addToRetargetingAudience($cart['customer']['id']);

        error_log("Cart abandoned: {$cart['id']}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function sendAbandonedCartEmail($email, $cart) {
    $items = $cart['items'];
    $total = $cart['total'];
    $recoverUrl = $cart['recover_url'];

    $subject = "أكمل طلبك واحصل على خصم خاص!";
    $message = "
        <html>
        <head>
            <title>أكمل طلبك</title>
        </head>
        <body>
            <h1>مرحباً!</h1>
            <p>لقد تركت بعض المنتجات في سلتك. أكمل طلبك الآن واحصل على خصم 10%!</p>
            <p><strong>إجمالي السلة:</strong> {$total} {$cart['currency']}</p>
            <p><a href='{$recoverUrl}'>أكمل طلبك الآن</a></p>
        </body>
        </html>
    ";

    mail($email, $subject, $message, "Content-type: text/html\r\n");
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

async function handleCartAbandoned(cart) {
    const { customer, items, total, recover_url } = cart;

    // إرسال بريد تذكير مع خصم
    await emailService.send({
        to: customer.email,
        template: 'abandoned_cart',
        data: {
            customer_name: customer.name,
            items: items,
            total: total,
            recover_url: recover_url,
            discount_code: 'CART10' // رمز خصم خاص
        }
    });

    // إضافة لجمهور إعادة الاستهداف
    await ads.addToAudience({
        platform: 'facebook',
        audience: 'abandoned_cart',
        customer_id: customer.id
    });

    // حفظ السلة للتحليل
    await db.abandoned_carts.insert({
        cart_id: cart.id,
        customer_id: customer.id,
        items: items,
        total: total,
        abandoned_at: new Date()
    });

    console.log(`Cart abandoned: ${cart.id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'cart.abandoned') {
            await handleCartAbandoned(req.body.data);
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

def handle_cart_abandoned(cart):
    customer = cart['customer']
    items = cart['items']
    total = cart['total']
    recover_url = cart['recover_url']

    # إرسال بريد تذكير
    send_abandoned_cart_email(
        customer['email'],
        customer['name'],
        items,
        total,
        recover_url
    )

    # حفظ للتحليل
    save_abandoned_cart(cart)

    print(f"Cart abandoned: {cart['id']}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'cart.abandoned':
            handle_cart_abandoned(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: إرسال تذكيرات متعددة

**العربية:** قد يتم إرسال عدة تذكيرات لنفس السلة.

**English:** Multiple reminders might be sent for the same cart.

**الحل (Solution):** قم بتتبع السلل المتروكة المعالجة:

```php
if (isCartAlreadyReminded($cart['id'])) {
    return;
}
markCartAsReminded($cart['id']);
```

### Issue 2: السلة قد تكون مكتملة لاحقاً

**العربية:** قد يكمل العميل الطلب قبل استلام التذكير.

**English:** Customer might complete the order before receiving reminder.

**الحل (Solution):** تحقق من حالة السلة قبل الإرسال:

```javascript
const cartStatus = await getCartStatus(cart.id);
if (cartStatus === 'completed') {
    return; // لا ترسل التذكير
}
```

## Best Practices (أفضل الممارسات)

- **العربية:** أرسل تذكير واحد فقط خلال 24 ساعة
- **English:** Send only one reminder within 24 hours
- **العربية:** قدم حافزاً مثل خصم أو شحن مجاني
- **English:** Offer an incentive like discount or free shipping
- **العربية:** استخدم القوالب المخصصة لكل عميل
- **English:** Use personalized templates for each customer
- **العربية:** تتبع معدل الاسترداد لقياس النجاح
- **English:** Track recovery rate to measure success

## SEO Keywords

**English:** Salla webhook, cart.abandoned event, abandoned cart webhook, e-commerce cart recovery, Salla cart API

**العربية:** ويب هوك سلة، حدث السلة المتروكة، إشعار السلة المتروكة، استعادة السلة، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [cart.updated](./cart.updated.md) - تحديث السلة
- [cart.completed](./cart.completed.md) - إتمام السلة
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
