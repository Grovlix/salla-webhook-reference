# product.quantity.updated - تحديث المخزون

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تغيير كمية منتج في المخزون. يشمل ذلك إضافة أو خصم الكميات عند استلام البضائع أو بيع المنتجات.

**English:** This event is triggered when product inventory quantity changes. This includes adding or deducting quantities when receiving goods or selling products.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند استلام مخزون جديد
- **English:** When new inventory is received
- **العربية:** عند بيع منتج (خصم من المخزون)
- **English:** When a product is sold (inventory deduction)
- **العربية:** عند إرجاع منتج (إضافة للمخزون)
- **English:** When a product is returned (inventory addition)
- **العربية:** عند تعديل المخزون يدوياً
- **English:** When inventory is manually adjusted
- **العربية:** عند إجراء جرد مخزوني
- **English:** During inventory count

## Payload Schema (هيكل البيانات)

```json
{
  "event": "product.quantity.updated",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "اسم المنتج",
    "sku": "SKU-12345",
    "quantity": {
      "old": 50,
      "new": 45,
      "change": -5
    },
    "reason": "order_completed",
    "branch_id": null,
    "updated_at": "2024-01-02T14:30:00Z"
  },
  "created_at": "2024-01-02T14:30:00Z"
}
```

## Field Descriptions (وصف الحقول)

| Field (الحقل) | Type (النوع) | Description (الوصف) |
|---------------|--------------|---------------------|
| `quantity.old` | Integer | الكمية القديمة |
| `quantity.new` | Integer | الكمية الجديدة |
| `quantity.change` | Integer | التغيير (سالب للخصم، موجب للإضافة) |
| `reason` | String | سبب التغيير |
| `branch_id` | Integer|null | معرف الفرع (للمتاجر متعددة الفروع) |

## Quantity Update Reasons (أسباب تحديث الكمية)

| Reason (السبب) | Description (الوصف) |
|----------------|---------------------|
| `order_completed` | بيع منتج (خصم) |
| `order_returned` | إرجاع منتج (إضافة) |
| `manual_adjustment` | تعديل يدوي |
| `inventory_received` | استلام مخزون |
| `inventory_count` | جرد مخزوني |
| `transfer_in` | نقل داخلي (وارد) |
| `transfer_out` | نقل داخلي (صادر) |

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
    if ($payload['event'] === 'product.quantity.updated') {
        $data = $payload['data'];
        $productId = $data['id'];
        $productName = $data['name'];
        $oldQuantity = $data['quantity']['old'];
        $newQuantity = $data['quantity']['new'];
        $change = $data['quantity']['change'];
        $reason = $data['reason'];

        // تحديث الكمية في قاعدة البيانات المحلية
        updateLocalQuantity($productId, $newQuantity);

        // مزامنة مع نظام ERP
        syncQuantityToERP($productId, $newQuantity, $reason);

        // التحقق من المخزون المنخفض
        if ($newQuantity <= getLowStockThreshold($productId)) {
            sendLowStockAlert($productId, $newQuantity);
        }

        // التحقق من نفاد المخزون
        if ($newQuantity === 0 && $oldQuantity > 0) {
            handleOutOfStock($productId);
            notifyWaitingCustomers($productId);
        }

        // إشعار إعادة التوفر
        if ($oldQuantity === 0 && $newQuantity > 0) {
            notifyBackInStock($productId);
        }

        // تسجيل الحركة
        logInventoryMovement($productId, $change, $reason);

        error_log("Quantity updated for {$productName}: {$oldQuantity} -> {$newQuantity} ({$reason})");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function notifyWaitingCustomers($productId) {
    // إشعار العملاء المنتظرين لتوفر المنتج
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT customer_email, customer_name
        FROM stock_notifications
        WHERE product_id = ? AND notified = 0
    ");

    $stmt->execute([$productId]);
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($customers as $customer) {
        sendStockNotificationEmail($customer['customer_email'], $productId);

        // تحديث حالة الإشعار
        $updateStmt = $pdo->prepare("
            UPDATE stock_notifications
            SET notified = 1, notified_at = NOW()
            WHERE product_id = ? AND customer_email = ?
        ");
        $updateStmt->execute([$productId, $customer['customer_email']]);
    }
}

function getLowStockThreshold($productId) {
    // الحصول على حد المخزون المنخفض للمنتج
    // يمكن تخصيصه لكل منتج
    return 10;
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

async function handleQuantityUpdated(data) {
    const { id, name, quantity, reason } = data;
    const oldQuantity = quantity.old;
    const newQuantity = quantity.new;
    const change = quantity.change;

    // تحديث الكمية في قاعدة البيانات
    await db.products.updateOne(
        { salla_id: id },
        {
            $set: {
                quantity: newQuantity,
                updated_at: new Date()
            }
        }
    );

    // مزامنة مع نظام ERP
    await erp.updateInventory(id, newQuantity, reason);

    // تسجيل الحركة
    await db.inventory_log.insert({
        product_id: id,
        old_quantity: oldQuantity,
        new_quantity: newQuantity,
        change: change,
        reason: reason,
        timestamp: new Date()
    });

    // التحقق من المخزون المنخفض
    const threshold = await getLowStockThreshold(id);
    if (newQuantity <= threshold && newQuantity < oldQuantity) {
        await sendLowStockAlert({
            product_id: id,
            product_name: name,
            current_quantity: newQuantity,
            threshold: threshold
        });
    }

    // التعامل مع نفاد المخزون
    if (newQuantity === 0 && oldQuantity > 0) {
        await handleOutOfStock(id);
    }

    // إشعار إعادة التوفر
    if (oldQuantity === 0 && newQuantity > 0) {
        await notifyBackInStock(id);
    }

    console.log(`Quantity updated for ${name}: ${oldQuantity} -> ${newQuantity}`);
}

async function handleOutOfStock(productId) {
    // إخفاء المنتج من المتجر إذا لزم الأمر
    await db.products.updateOne(
        { salla_id: productId },
        { $set: { out_of_stock: true } }
    );

    // إيقاف الإعلانات للمنتج
    await pauseAdsForProduct(productId);

    // إرسال تنبيه للإدارة
    await slack.send({
        text: `نفد المخزون للمنتج ID: ${productId}`,
        color: 'danger'
    });
}

async function notifyBackInStock(productId) {
    // إشعار العملاء الذين طلبوا إشعار عند التوفر
    const watchers = await db.stock_watchers.find({
        product_id: productId,
        notified: false
    });

    for (const watcher of watchers) {
        await sendEmail(watcher.email, 'back_in_stock', {
            product_name: watcher.product_name,
            product_url: watcher.product_url
        });

        // تحديث حالة الإشعار
        await db.stock_watchers.updateOne(
            { _id: watcher._id },
            { $set: { notified: true, notified_at: new Date() } }
        );
    }
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'product.quantity.updated') {
            await handleQuantityUpdated(req.body.data);
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

def handle_quantity_updated(data):
    product_id = data['id']
    name = data['name']
    old_quantity = data['quantity']['old']
    new_quantity = data['quantity']['new']
    change = data['quantity']['change']
    reason = data['reason']

    # تحديث قاعدة البيانات
    update_product_quantity(product_id, new_quantity)

    # مزامنة مع ERP
    sync_quantity_to_erp(product_id, new_quantity, reason)

    # التحقق من المخزون المنخفض
    threshold = get_low_stock_threshold(product_id)
    if new_quantity <= threshold < old_quantity:
        send_low_stock_alert(product_id, name, new_quantity, threshold)

    # نفاد المخزون
    if new_quantity == 0 < old_quantity:
        handle_out_of_stock(product_id)

    # إعادة التوفر
    if old_quantity == 0 < new_quantity:
        notify_back_in_stock(product_id)

    print(f"Quantity updated for {name}: {old_quantity} -> {new_quantity}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'product.quantity.updated':
            handle_quantity_updated(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: تحديثات متكررة

**العربية:** قد يتم إرسال عدة أحداث لكل عملية بيع.

**English:** Multiple events might be sent for each sale.

**الحل (Solution):** استخدم التجميع (debouncing):

```javascript
const updateCache = new Map();

function debounceQuantityUpdate(productId, callback) {
    if (updateCache.has(productId)) {
        clearTimeout(updateCache.get(productId));
    }
    const timeout = setTimeout(callback, 2000);
    updateCache.set(productId, timeout);
}
```

### Issue 2: عدم التزامن مع ERP

**العربية:** قد يكون هناك تأخير في تحديث نظام ERP.

**English:** There might be a delay in updating the ERP system.

**الحل (Solution):** استخدم قائمة انتظار للمعالجة:

```php
queueInventoryUpdate([
    'product_id' => $productId,
    'quantity' => $newQuantity,
    'reason' => $reason
]);
```

### Issue 3: حد المخزون المنخفض

**العربية:** قد يكون الحد الافتراضي غير مناسب لجميع المنتجات.

**English:** The default threshold might not be suitable for all products.

**الحل (Solution):** قم بتخصيص الحد لكل منتج:

```javascript
async function getLowStockThreshold(productId) {
    const product = await db.products.findOne({ salla_id: productId });
    return product.low_stock_threshold || 10;
}
```

## Best Practices (أفضل الممارسات)

- **العربية:** قم بإشعار الإدارة عند انخفاض المخزون
- **English:** Notify admin when inventory is low
- **العربية:** أرسل إشعار للعملاء عند إعادة توفر المنتج
- **English:** Send notification to customers when product is back in stock
- **العربية:** تتبع جميع حركات المخزون للتدقيق
- **English:** Track all inventory movements for auditing
- **العربية:** قم بمزامنة المخزون مع جميع القنوات البيعية
- **English:** Sync inventory across all sales channels

## SEO Keywords

**English:** Salla webhook, product.quantity.updated event, inventory webhook, stock management, e-commerce inventory, Salla product API

**العربية:** ويب هوك سلة، حدث تحديث المخزون، إشعار تغيير الكمية، إدارة المخزون، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [product.created](./product.created.md) - إنشاء منتج
- [product.updated](./product.updated.md) - تحديث منتج
- [order.created](../order/order.created.md) - طلب جديد (يخصم المخزون)
- [order.returned](../order/order.returned.md) - استرجاع طلب (يعيد المخزون)

---

*Last Updated: مارس 2026*
