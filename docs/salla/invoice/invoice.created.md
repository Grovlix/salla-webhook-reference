# invoice.created - إنشاء فاتورة

## Description (الوصف)

**العربية:** يتم إطلاق هذا الحدث عند إنشاء فاتورة جديدة لطلب. الفاتورة تحتوي على تفاصيل الطلب والمبالغ المستحقة.

**English:** This event is triggered when a new invoice is created for an order. The invoice contains order details and amounts due.

## When Triggered (متى يتم إطلاقه)

- **العربية:** عند إنشاء فاتورة للطلب
- **English:** When invoice is generated for order
- **العربية:** عند إنشاء فاتورة متكررة
- **English:** When recurring invoice is created

## Payload Schema (هيكل البيانات)

```json
{
  "event": "invoice.created",
  "store_id": "123456789",
  "data": {
    "id": 88888,
    "order_id": 12345,
    "invoice_number": "INV-2024-001",
    "customer": {
      "name": "اسم العميل",
      "email": "customer@example.com"
    },
    "items": [
      {
        "name": "اسم المنتج",
        "quantity": 2,
        "unit_price": 100.00,
        "total": 200.00
      }
    ],
    "subtotal": 200.00,
    "tax": 30.00,
    "total": 230.00,
    "currency": "SAR",
    "status": "pending",
    "due_date": "2024-01-15T23:59:59Z",
    "created_at": "2024-01-01T12:00:00Z"
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
    if ($payload['event'] === 'invoice.created') {
        $invoice = $payload['data'];

        // حفظ الفاتورة في قاعدة البيانات
        saveInvoice($invoice);

        // مزامنة مع نظام المحاسبة
        syncToAccountingSystem($invoice);

        error_log("Invoice created: {$invoice['invoice_number']}");
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

async function handleInvoiceCreated(invoice) {
    // حفظ في قاعدة البيانات
    await db.invoices.insert({ ...invoice, created_at: new Date() });

    // مزامنة مع نظام المحاسبة
    await accounting.createInvoice(invoice);

    console.log(`Invoice created: ${invoice.invoice_number}`);
}

app.post('/webhook', express.json({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        if (req.body.event === 'invoice.created') {
            await handleInvoiceCreated(req.body.data);
        }
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## SEO Keywords

**English:** Salla webhook, invoice.created event, invoice generation webhook

**العربية:** ويب هوك سلة، حدث إنشاء فاتورة، إشعار إنشاء الفاتورة

## Related Events (أحداث ذات صلة)

- [invoice.paid](./invoice.paid.md) - دفع الفاتورة
- [invoice.sent](./invoice.sent.md) - إرسال الفاتورة
- [order.created](../order/order.created.md) - طلب جديد

---

*Last Updated: مارس 2026*
