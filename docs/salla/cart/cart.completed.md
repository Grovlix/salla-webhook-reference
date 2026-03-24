# cart.completed - إتمام السلة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إتمام عملية الشراء وتحويل السلة إلى طلب. هذا الحدث يسبق حدث order.created مباشرة.

**English:** This event is triggered when the checkout process is completed and the cart is converted to an order. This event precedes the order.created event directly.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إكمال العميل عملية الدفع بنجاح
- **English:** When customer successfully completes payment
- **العربية:** عند تحويل السلة إلى طلب
- **English:** When cart is converted to order

## Payload Schema (هيكل البيانات)

```json
{
  "event": "cart.completed",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "order_id": 12345,
    "customer": {
      "id": 98765,
      "name": "اسم العميل",
      "email": "customer@example.com"
    },
    "items": [
      {
        "product_id": 222,
        "name": "اسم المنتج",
        "quantity": 2,
        "price": 100.00
      }
    ],
    "total": 200.00,
    "currency": "SAR",
    "completed_at": "2024-01-01T12:00:00Z"
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
    if ($payload['event'] === 'cart.completed') {
        $cart = $payload['data'];
        $orderId = $cart['order_id'];

        // إزالة السلة من قاعدة البيانات المؤقتة
        removeTemporaryCart($cart['id']);

        // إزالة من جمهور إعادة الاستهداف
        removeFromRetargetingAudience($cart['customer']['id']);

        // تتبع التحويل
        trackConversion($cart);

        error_log("Cart completed: Order ID {$orderId}");
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

async function handleCartCompleted(cart) {
    const { id, order_id, customer, items, total } = cart;

    // إزالة السلة المؤقتة
    await db.temporary_carts.deleteOne({ cart_id: id });

    // إزالة من جمهور إعادة الاستهداف
    await ads.removeFromAudience({
        platform: 'facebook',
        audience: 'abandoned_cart',
        customer_id: customer.id
    });

    // تتبع التحويل للتحليلات
    await analytics.track({
        event: 'cart_completed',
        cart_id: id,
        order_id: order_id,
        revenue: total,
        items: items.length
    });

    console.log(`Cart completed: Order ${order_id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'cart.completed') {
            await handleCartCompleted(req.body.data);
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

def handle_cart_completed(cart):
    # إزالة السلة المؤقتة
    remove_temporary_cart(cart['id'])

    # تتبع التحويل
    track_conversion(cart)

    print(f"Cart completed: Order {cart['order_id']}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'cart.completed':
            handle_cart_completed(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## SEO Keywords

**English:** Salla webhook, cart.completed event, cart completion webhook, e-commerce checkout, Salla cart API

**العربية:** ويب هوك سلة، حدث إتمام السلة، إشعار إتمام الشراء، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [cart.abandoned](./cart.abandoned.md) - سلة متروكة
- [cart.updated](./cart.updated.md) - تحديث السلة
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
