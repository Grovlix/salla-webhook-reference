# invoice.paid - دفع الفاتورة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند دفع الفاتورة بنجاح.

**English:** This event is triggered when invoice is successfully paid.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إكمال دفع الفاتورة
- **English:** When invoice payment is completed

## Payload Schema (هيكل البيانات)

```json
{
  "event": "invoice.paid",
  "store_id": "123456789",
  "data": {
    "id": 88888,
    "invoice_number": "INV-2024-001",
    "amount": 230.00,
    "currency": "SAR",
    "payment_method": "visa",
    "paid_at": "2024-01-03T10:00:00Z"
  },
  "created_at": "2024-01-03T10:00:00Z"
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
    if ($payload['event'] === 'invoice.paid') {
        $invoice = $payload['data'];

        // تحديث حالة الفاتورة
        markInvoiceAsPaid($invoice['id']);

        // إرسال إشعار الدفع
        sendPaymentConfirmation($invoice);

        // مزامنة مع نظام المحاسبة
        syncPaymentToAccounting($invoice);
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

async function handleInvoicePaid(invoice) {
    // تحديث حالة الفاتورة
    await db.invoices.updateOne(
        { invoice_id: invoice.id },
        { $set: { status: 'paid', paid_at: new Date() } }
    );

    // إرسال تأكيد
    await sendPaymentConfirmation(invoice);

    // مزامنة مع المحاسبة
    await accounting.recordPayment(invoice);

    console.log(`Invoice paid: ${invoice.invoice_number}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'invoice.paid') {
            await handleInvoicePaid(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, invoice.paid event, invoice payment webhook

**العربية:** ويب هوك سلة، حدث دفع الفاتورة، إشعار دفع الفاتورة

## Related Events (أحداث ذات صلة)

- [invoice.created](./invoice.created.md) - إنشاء فاتورة
- [payment.paid](../payment/payment.paid.md) - دفع ناجح

---

*Last Updated: مارس 2026*
