---
layout: home

hero:
  name: Salla & Zid Webhook Reference
  text: Comprehensive webhook documentation for MENA e-commerce platforms
  tagline: دليل شامل لأحداث Webhook الخاصة بمنصتي سلة وزد
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: Salla Events
      link: /salla/
    - theme: alt
      text: Zid Events
      link: /zid/
    - theme: alt
      text: View on GitHub
      link: https://github.com/grovlix/salla-webhook-reference

features:
  - title: 🛒 Order Events
    details: Track order creation, updates, cancellations, and returns across both platforms
  - title: 📦 Product Events
    details: Monitor product creation, updates, price changes, and inventory management
  - title: 👥 Customer Events
    details: Stay informed about customer registrations, profile updates, and login activity
  - title: 💳 Payment Events
    details: Handle payment success, failures, refunds, and partial refunds
  - title: 🚚 Shipment Events
    details: Track delivery status from preparation through to final delivery or return
  - title: 🔒 Security First
    details: HMAC signature verification examples in PHP, JavaScript, and Python
  - title: 🌐 Bilingual
    details: Complete documentation in both Arabic and English with RTL support
  - title: 📝 Code Examples
    details: Ready-to-use webhook handlers for Laravel, Express.js, Flask, and FastAPI
  - title: 🔧 JSON Schemas
    details: Validatable JSON schemas and TypeScript definitions for all webhook payloads

---

## Quick Start (بدء سريع)

### Salla Webhook Example

```php
<?php
// Verify Salla webhook signature
$signature = $_SERVER['HTTP_X_SALLA_SIGNATURE'];
$payload = file_get_contents('php://input');
$secret = 'your_webhook_secret';

$expected = hash_hmac('sha256', $payload, $secret);
if (!hash_equals($signature, $expected)) {
    http_response_code(401);
    exit('Invalid signature');
}

// Process the webhook
$event = json_decode($payload, true);
handleWebhook($event);
```

### Zid Webhook Example

```javascript
// Verify Zid webhook signature
import crypto from 'crypto';

function verifyZidWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

## Platforms Covered (المنصات المغطاة)

| Platform | Events | Documentation |
|----------|--------|---------------|
| **[Salla](/salla/)** | 60+ events | [View Docs](/salla/) |
| **[Zid](/zid/)** | 18 events | [View Docs](/zid/) |

## Categories (الفئات)

### Order Events (أحداث الطلبات)
- `order.created` / `order.create` - New order placed
- `order.updated` / `order.status.update` - Order status changed
- `order.cancelled` - Order cancelled by customer or merchant
- `order.returned` - Order returned for refund

### Product Events (أحداث المنتجات)
- `product.created` / `product.create` - New product added
- `product.updated` / `product.update` - Product details modified
- `product.deleted` / `product.delete` - Product removed
- `product.price.updated` - Price changes
- `product.quantity.updated` - Inventory updates

### Customer Events (أحداث العملاء)
- `customer.created` / `customer.create` - New customer registered
- `customer.updated` / `customer.update` - Profile information changed
- `customer.login` - Customer logged into their account

### Payment Events (أحداث الدفع)
- `payment.paid` - Payment successfully completed
- `payment.failed` - Payment declined or failed
- `payment.refunded` - Full refund processed
- `payment.partially_refunded` - Partial refund issued

## Contributing (المساهمة)

We welcome contributions! Please see our [Contributing Guide](https://github.com/grovlix/salla-webhook-reference/blob/master/CONTRIBUTING.md) for details.

## License

Released under the [MIT License](https://github.com/grovlix/salla-webhook-reference/blob/main/LICENSE) | تم الإصدار تحت ترخيص MIT

## Maintained by Grovlix

[Grovlix.com](https://grovlix.com) - Technology solutions provider specializing in e-commerce integrations for the MENA region.

---

<div class="feedback-widget">
  <p>Was this helpful? | هل كان هذا مفيداً؟</p>
  <button class="feedback-yes">👍 Yes</button>
  <button class="feedback-no">👎 No</button>
</div>

<style>
.feedback-widget {
  margin-top: 3rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}
.feedback-widget button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  cursor: pointer;
}
.feedback-widget button:hover {
  background: var(--vp-c-brand);
  color: white;
}
</style>
