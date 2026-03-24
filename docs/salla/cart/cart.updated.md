# cart.updated - تحديث السلة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تعديل محتويات سلة التسوق. يشمل ذلك إضافة أو حذف منتجات أو تغيير الكميات.

**English:** This event is triggered when shopping cart contents are modified. This includes adding or removing products or changing quantities.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إضافة منتج للسلة
- **English:** When a product is added to cart
- **العربية:** عند حذف منتج من السلة
- **English:** When a product is removed from cart
- **العربية:** عند تغيير كمية منتج في السلة
- **English:** When product quantity in cart is changed
- **العربية:** عند تطبيق قسيمة على السلة
- **English:** When a coupon is applied to cart

## Payload Schema (هيكل البيانات)

```json
{
  "event": "cart.updated",
  "store_id": "123456789",
  "data": {
    "id": 99999,
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
        "price": 100.00,
        "total": 200.00
      }
    ],
    "total": 200.00,
    "subtotal": 200.00,
    "discount": 0,
    "currency": "SAR",
    "updated_at": "2024-01-01T12:30:00Z"
  },
  "created_at": "2024-01-01T12:30:00Z"
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
    if ($payload['event'] === 'cart.updated') {
        $cart = $payload['data'];

        // مزامنة السلة مع أنظمة أخرى
        syncCartToCRM($cart);

        // تحديث توصيات المنتجات
        updateProductRecommendations($cart['customer']['id'], $cart['items']);

        error_log("Cart updated: {$cart['id']}");
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

async function handleCartUpdated(cart) {
    const { id, customer, items, total } = cart;

    // تحديث السلة في قاعدة البيانات
    await db.carts.updateOne(
        { cart_id: id },
        {
            $set: {
                items,
                total,
                updated_at: new Date()
            }
        },
        { upsert: true }
    );

    // تحديث التوصيات
    const productIds = items.map(item => item.product_id);
    const recommendations = await getRecommendations(productIds);
    await cache.set(`recommendations:${customer.id}`, recommendations);

    console.log(`Cart updated: ${id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'cart.updated') {
            await handleCartUpdated(req.body.data);
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

def handle_cart_updated(cart):
    # مزامنة السلة
    sync_cart_to_systems(cart)

    print(f"Cart updated: {cart['id']}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'cart.updated':
            handle_cart_updated(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## SEO Keywords

**English:** Salla webhook, cart.updated event, cart update webhook, e-commerce cart tracking, Salla cart API

**العربية:** ويب هوك سلة، حدث تحديث السلة، إشعار تحديث السلة، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [cart.abandoned](./cart.abandoned.md) - سلة متروكة
- [cart.completed](./cart.completed.md) - إتمام السلة
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
