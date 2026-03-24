# invoice.cancelled - إلغاء الفاتورة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إلغاء فاتورة.

**English:** This event is triggered when an invoice is cancelled.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إلغاء الفاتورة من قبل التاجر
- **English:** When merchant cancels the invoice

## Payload Schema (هيكل البيانات)

```json
{
  "event": "invoice.cancelled",
  "store_id": "123456789",
  "data": {
    "id": 88888,
    "invoice_number": "INV-2024-001",
    "cancelled_at": "2024-01-03T10:00:00Z"
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
    if ($payload['event'] === 'invoice.cancelled') {
        $invoice = $payload['data'];
        markInvoiceAsCancelled($invoice['id']);
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

async function handleInvoiceCancelled(invoice) {
    await db.invoices.updateOne(
        { invoice_id: invoice.id },
        { $set: { status: 'cancelled', cancelled_at: new Date() } }
    );
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'invoice.cancelled') {
            await handleInvoiceCancelled(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, invoice.cancelled event, invoice cancellation webhook

**العربية:** ويب هوك سلة، حدث إلغاء الفاتورة، إشعار إلغاء الفاتورة

## Related Events (أحداث ذات صلة)

- [invoice.created](./invoice.created.md) - إنشاء فاتورة
- [order.cancelled](../order/order.cancelled.md) - إلغاء طلب

---

*Last Updated: مارس 2026*
