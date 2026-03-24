# invoice.sent - إرسال الفاتورة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إرسال الفاتورة للعميل عبر البريد الإلكتروني.

**English:** This event is triggered when invoice is sent to customer via email.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إرسال الفاتورة للعميل
- **English:** When invoice is sent to customer

## Payload Schema (هيكل البيانات)

```json
{
  "event": "invoice.sent",
  "store_id": "123456789",
  "data": {
    "id": 88888,
    "invoice_number": "INV-2024-001",
    "customer_email": "customer@example.com",
    "sent_at": "2024-01-02T10:00:00Z"
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
    if ($payload['event'] === 'invoice.sent') {
        $invoice = $payload['data'];
        markInvoiceAsSent($invoice['id']);
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

async function handleInvoiceSent(invoice) {
    await db.invoices.updateOne(
        { invoice_id: invoice.id },
        { $set: { sent_at: new Date(), status: 'sent' } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'invoice.sent') {
            await handleInvoiceSent(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, invoice.sent event, invoice sent webhook

**العربية:** ويب هوك سلة، حدث إرسال الفاتورة، إشعار إرسال الفاتورة

## Related Events (أحداث ذات صلة)

- [invoice.created](./invoice.created.md) - إنشاء فاتورة
- [invoice.paid](./invoice.paid.md) - دفع الفاتورة

---

*Last Updated: مارس 2026*
