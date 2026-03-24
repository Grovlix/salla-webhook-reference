# customer.deleted - حذف عميل

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند حذف حساب عميل من المتجر. يحتوي هذا الحدث على معرف العميل المحذوف.

**English:** This event is triggered when a customer account is deleted from the store. This event contains the deleted customer ID.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند حذف العميل لحسابه
- **English:** When customer deletes their account
- **العربية:** عند حذف حساب من قبل التاجر
- **English:** When merchant deletes an account
- **العربية:** عند حذف حساب غير نشط تلقائياً
- **English:** When inactive account is auto-deleted

## Payload Schema (هيكل البيانات)

```json
{
  "event": "customer.deleted",
  "store_id": "123456789",
  "data": {
    "id": 98765,
    "email": "deleted@example.com",
    "deleted_at": "2024-01-02T10:00:00Z",
    "reason": "customer_request"
  },
  "created_at": "2024-01-02T10:00:00Z"
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
    if ($payload['event'] === 'customer.deleted') {
        $data = $payload['data'];
        $customerId = $data['id'];
        $customerEmail = $data['email'];

        // أرشفة بيانات العميل قبل الحذف
        archiveCustomerData($customerId);

        // حذف من قاعدة البيانات المحلية
        deleteCustomerFromDatabase($customerId);

        // إزالة من CRM
        removeFromCRM($customerEmail);

        // إزالة من قوائم التسويق
        unsubscribeFromMarketingLists($customerEmail);

        error_log("Customer deleted: ID {$customerId}");
    }

    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}

function archiveCustomerData($customerId) {
    // أرشفة البيانات للامتثال للوائح الخصوصية
    global $pdo;

    $stmt = $pdo->prepare("
        INSERT INTO customers_archive
        SELECT *, NOW() as archived_at
        FROM customers WHERE salla_id = ?
    ");

    $stmt->execute([$customerId]);
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

async function handleCustomerDeleted(data) {
    const { id, email } = data;

    // أرشفة البيانات
    const customer = await db.customers.findOne({ salla_id: id });
    if (customer) {
        await db.customers_archive.insert({
            ...customer,
            archived_at: new Date()
        });
    }

    // حذف من قاعدة البيانات
    await db.customers.deleteOne({ salla_id: id });

    // إزالة من CRM
    await crm.deleteContact(email);

    // إزالة من قوائم التسويق
    await marketing.unsubscribe(email);

    console.log(`Customer deleted: ID ${id}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'customer.deleted') {
            await handleCustomerDeleted(req.body.data);
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

def handle_customer_deleted(data):
    customer_id = data['id']
    email = data['email']

    # أرشفة البيانات
    archive_customer_data(customer_id)

    # حذف من قاعدة البيانات
    delete_customer_from_db(customer_id)

    # إزالة من CRM
    remove_from_crm(email)

    # إلغاء الاشتراك من التسويق
    unsubscribe_from_marketing(email)

    print(f"Customer deleted: ID {customer_id}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'customer.deleted':
            handle_customer_deleted(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## Common Issues (مشاكل شائعة)

### Issue 1: فقدان البيانات

**العربية:** قد تحتاج للاحتفاظ ببيانات العميل للامتثال الضريبي أو القانوني.

**English:** You might need to keep customer data for tax or legal compliance.

**الحل (Solution):** قم دائماً بأرشفة البيانات قبل الحذف:

```php
archiveCustomerData($customerId);
deleteCustomerFromDatabase($customerId);
```

## Best Practices (أفضل الممارسات)

- **العربية:** قم بأرشفة بيانات العميل قبل حذفها
- **English:** Always archive customer data before deletion
- **العربية:** أزل العميل من جميع أنظمة التسويق
- **English:** Remove customer from all marketing systems
- **العربية:** احترم خصوصية البيانات والامتثال للوائح
- **English:** Respect data privacy and comply with regulations

## SEO Keywords

**English:** Salla webhook, customer.deleted event, customer deletion webhook, e-commerce customer management, Salla customer API

**العربية:** ويب هوك سلة، حدث حذف عميل، إشعار حذف العميل، إدارة العملاء، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [customer.created](./customer.created.md) - إنشاء عميل
- [customer.updated](./customer.updated.md) - تحديث عميل

---

*Last Updated: مارس 2026*
