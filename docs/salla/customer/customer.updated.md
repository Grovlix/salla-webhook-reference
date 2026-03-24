# customer.updated - تحديث عميل

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند تحديث بيانات عميل موجود. يشمل ذلك تغيير الاسم أو البريد الإلكتروني أو العنوان أو أي بيانات أخرى.

**English:** This event is triggered when an existing customer's data is updated. This includes changes to name, email, address, or any other customer data.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند تعديل العميل لبياناته الشخصية
- **English:** When customer modifies their personal information
- **العربية:** عند تحديث عنوان العميل
- **English:** When customer address is updated
- **العربية:** عند تغيير رقم الهاتف
- **English:** When phone number is changed

## Payload Schema (هيكل البيانات)

```json
{
  "event": "customer.updated",
  "store_id": "123456789",
  "data": {
    "id": 98765,
    "name": "اسم العميل المحدث",
    "email": "updated@example.com",
    "phone": "+966511111111",
    "city": "Jeddah",
    "country": "Saudi Arabia",
    "updated_at": "2024-01-02T14:30:00Z",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-02T14:30:00Z"
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
    if ($payload['event'] === 'customer.updated') {
        $customer = $payload['data'];
        $customerId = $customer['id'];

        // تحديث البيانات في قاعدة البيانات المحلية
        updateCustomerInDatabase($customer);

        // تحديث البيانات في CRM
        updateCRMContact($customer);

        // تحديث البيانات في نظام التسويق عبر البريد
        syncEmailMarketingData($customer);

        error_log("Customer updated: ID {$customerId}");
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

async function handleCustomerUpdated(customer) {
    const { id, name, email, phone, city } = customer;

    // تحديث قاعدة البيانات
    await db.customers.updateOne(
        { salla_id: id },
        {
            $set: {
                name,
                email,
                phone,
                city,
                updated_at: new Date()
            }
        }
    );

    // تحديث CRM
    await crm.updateContact(id, {
        name,
        email,
        phone,
        city
    });

    console.log(`Customer updated: ${name} (ID: ${id})`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'customer.updated') {
            await handleCustomerUpdated(req.body.data);
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

def handle_customer_updated(customer):
    customer_id = customer['id']

    # تحديث قاعدة البيانات
    update_customer_in_db(customer)

    # تحديث CRM
    update_crm_contact(customer)

    print(f"Customer updated: ID {customer_id}")

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        if payload.get('event') == 'customer.updated':
            handle_customer_updated(payload.get('data'))
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403

if __name__ == '__main__':
    app.run(port=3000)
```

## SEO Keywords

**English:** Salla webhook, customer.updated event, customer update webhook, e-commerce customer data, Salla customer API

**العربية:** ويب هوك سلة، حدث تحديث عميل، إشعار تحديث بيانات العميل، متجر إلكتروني سلة

## Related Events (أحداث ذات صلة)

- [customer.created](./customer.created.md) - إنشاء عميل
- [customer.login](./customer.login.md) - تسجيل دخول العميل
- [customer.deleted](./customer.deleted.md) - حذف عميل

---

*Last Updated: مارس 2026*
