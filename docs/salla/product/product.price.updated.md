# product.price.updated - تغيير سعر المنتج

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تغيير سعر منتج. يشمل ذلك تغيير السعر الأساسي أو سعر الخصم أو فترة الخصم.

**English:** This event is triggered when a product price is changed. This includes changes to the base price, sale price, or sale period.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تحديث السعر الأساسي للمنتج
- **English:** When the product base price is updated
- **العربية:** عند تغيير سعر الخصم
- **English:** When the sale price is changed
- **العربية:** عند بدء أو انتهاء فترة الخصم
- **English:** When sale period starts or ends
- **العربية:** عند تطبيق خصم تلقائي
- **English:** When an automatic discount is applied

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.price.updated",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج",
    "sku": "SKU-12345",
    "price": {
      "old": 150.00,
      "new": 180.00
    },
    "sale_price": {
      "old": 100.00,
      "new": 120.00,
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    },
    "currency": "SAR",
    "updated_at": "2024-01-02T14:30:00Z"
  },
  "created_at": "2024-01-02T14:30:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `price.old` | Decimal | السعر القديم |
| `price.new` | Decimal | السعر الجديد |
| `sale_price.old` | Decimal | سعر الخصم القديم |
| `sale_price.new` | Decimal | سعر الخصم الجديد |
| `sale_price.start` | DateTime | بداية فترة الخصم |
| `sale_price.end` | DateTime | نهاية فترة الخصم |
| `currency` | String | العملة |

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
    if ($payload['event'] === 'product.price.updated') {
        $data = $payload['data'];
        $productId = $data['id'];
        $productName = $data['name'];
        $oldPrice = $data['price']['old'];
        $newPrice = $data['price']['new'];

        // حساب نسبة التغيير
        $priceChange = $newPrice - $oldPrice;
        $percentageChange = (($newPrice - $oldPrice) / $oldPrice) * 100;

        // تحديث السعر في قاعدة البيانات المحلية
        updateProductPrice($productId, $newPrice, $data['sale_price']['new'] ?? null);

        // تحديث السعر في أنظمة البيع المتصلة
        syncPriceToMarketplaces($productId, $newPrice);

        // إرسال إشعار في حالة الزيادة الكبيرة
        if ($percentageChange > 20) {
            sendPriceIncreaseAlert($productName, $oldPrice, $newPrice);
        }

        // إرسال إشعار في حالة انخفاض السعر (للعملاء المهتمين)
        if ($priceChange < 0) {
            notifyPriceDropWatchers($productId, $newPrice);
        }

        // تسجيل التغيير للتقارير
        logPriceChange($productId, $oldPrice, $newPrice);

        error_log("Price updated for {$productName}: {$oldPrice} -> {$newPrice}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function notifyPriceDropWatchers($productId, $newPrice) {
    // إرسال إشعارات للعملاء الذين يراقبون سعر المنتج
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT customer_email FROM price_watchers
        WHERE product_id = ? AND desired_price >= ?
    ");

    $stmt->execute([$productId, $newPrice]);
    $watchers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($watchers as $watcher) {
        sendPriceDropEmail($watcher['customer_email'], $productId, $newPrice);
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

async function handlePriceUpdated(data) {
    const { id, name, price, sale_price, currency } = data;
    const oldPrice = price.old;
    const newPrice = price.new;
    const priceChange = newPrice - oldPrice;
    const percentageChange = ((priceChange / oldPrice) * 100).toFixed(2);

    // تحديث السعر في قاعدة البيانات
    await db.products.updateOne(
        { salla_id: id },
        {
            $set: {
                price: newPrice,
                sale_price: sale_price?.new,
                updated_at: new Date()
            }
        }
    );

    // تحديث سعر المنتج في سلة التسوق
    await updateCartPrices(id, newPrice, sale_price?.new);

    // مزامنة مع منصات البيع الأخرى
    await syncToMarketplaces(id, newPrice);

    // تسجيل التغيير
    await db.price_history.insert({
        product_id: id,
        old_price: oldPrice,
        new_price: newPrice,
        change_amount: priceChange,
        change_percentage: parseFloat(percentageChange),
        currency: currency,
        timestamp: new Date()
    });

    // إشعارات خاصة
    if (priceChange < 0) {
        // انخفاض السعر - إشعار المشاهدين
        await notifyPriceDropWatchers(id, newPrice);
    } else if (percentageChange > 20) {
        // زيادة كبيرة - تنبيه الإدارة
        await sendAdminAlert({
            title: 'زيادة كبيرة في السعر',
            product: name,
            change: `${percentageChange}%`
        });
    }

    console.log(`Price updated for ${name}: ${oldPrice} -> ${newPrice} (${percentageChange}%)`);
}

async function updateCartPrices(productId, newPrice, salePrice) {
    // تحديث أسعار المنتج في السلل النشطة
    const carts = await db.carts.find({
        'items.product_id': productId
    });

    for (const cart of carts) {
        for (const item of cart.items) {
            if (item.product_id === productId) {
                item.price = salePrice || newPrice;
                item.total = item.price * item.quantity;
            }
        }

        // إعادة حساب المجموع
        cart.total = cart.items.reduce((sum, item) => sum + item.total, 0);

        await db.carts.updateOne(
            { _id: cart._id },
            { $set: { items: cart.items, total: cart.total } }
        );
    }
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.price.updated') {
            await handlePriceUpdated(req.body.data);
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

def handle_price_updated(data):
    product_id = data['id']
    name = data['name']
    old_price = data['price']['old']
    new_price = data['price']['new']

    # حساب التغيير
    price_change = new_price - old_price
    percentage_change = ((price_change / old_price) * 100)

    # تحديث قاعدة البيانات
    update_product_price(product_id, new_price, data.get('sale_price', {}).get('new'))

    # مزامنة مع منصات أخرى
    sync_price_to_marketplaces(product_id, new_price)

    # إشعارات
    if price_change < 0:
        notify_price_drop_watchers(product_id, new_price)
    elif percentage_change > 20:
        send_admin_alert(f"زيادة كبيرة في سعر {name}: {percentage_change:.2f}%")

    print(f"Price updated for {name}: {old_price} -> {new_price}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.price.updated':
            handle_price_updated(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: اختلاف أسعار السلة

**العربية:** قد تبقى السلل القديمة بالسعر القديم.

**English:** Old carts might retain old prices.

**الحل (Solution):** قم بتحديث جميع السلل النشطة:

```javascript
await updateCartPrices(productId, newPrice, salePrice);
```

### Issue 2: تغييرات السعر المتكررة

**العربية:** قد يتم إرسال عدة أحداث لتغييرات السعر خلال فترة قصيرة.

**English:** Multiple price change events might be sent in a short period.

**الحل (Solution):** استخدم التجميع (debouncing):

```javascript
const priceUpdateCache = new Map();

function debouncePriceUpdate(productId, callback) {
    if (priceUpdateCache.has(productId)) {
        clearTimeout(priceUpdateCache.get(productId));
    }
    const timeout = setTimeout(callback, 5000);
    priceUpdateCache.set(productId, timeout);
}
```

### Issue 3: عدم تحديث سعر الخصم

**العربية:** قد يكون سعر الخصم (sale_price) غير موجود في بعض الحالات.

**English:** Sale price might not exist in some cases.

**الحل (Solution):** تحقق دائماً من وجوده:

```php
$salePrice = $data['sale_price']['new'] ?? null;
```

## SEO Keywords

**English:** Salla webhook, product.price.updated event, price change webhook, e-commerce pricing, Salla product API

**العربية:** ويب هوك سلة، حدث تغيير السعر، إشعار تغيير سعر المنتج، تسعير المتجر الإلكتروني، سلة

## Related Events (أحداث ذات صلة)

- [product.created](./product.created.md) - إنشاء منتج
- [product.updated](./product.updated.md) - تحديث منتج
- [product.quantity.updated](./product.quantity.updated.md) - تحديث المخزون

---

*Last Updated: مارس 2026*
