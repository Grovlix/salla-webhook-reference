# Salla Webhook Events - Research Document
# أحداث Webhook الخاصة بسالة - بحث شامل

## Official Documentation Links

| Resource | URL | Description |
|----------|-----|-------------|
| **Main Documentation** | https://docs.salla.dev | Salla Partners' documentation portal |
| **Merchant API** | https://docs.salla.dev/merchant-api | Merchant API documentation |
| **Webhooks Overview** | https://docs.salla.dev/merchant-api/webhooks | Webhook configuration and management |
| **List Events** | https://docs.salla.dev/merchant-api/webhooks/list-events | Complete list of webhook events |
| **Store Events** | https://docs.salla.dev/merchant-api/webhooks/webhooks-store-events | Store-specific webhook events |
| **Communication Webhooks** | https://docs.salla.dev/merchant-api/webhooks/communication-webhooks | Communication-related events |
| **Conditional Webhooks** | https://docs.salla.dev/merchant-api/webhooks/conditional-webhooks | Conditional webhook filtering |
| **App API** | https://docs.salla.dev/partner-apis/app-api | App API for partners |

---

## Complete Webhook Event List

### Order Events (أحداث الطلبات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| طلب جديد | `order.created` | Triggered when a new order is created | When a customer completes checkout successfully |
| تحديث الطلب | `order.updated` | Triggered when an order is modified | When order details change (items, shipping, etc.) |
| تغيير حالة الطلب | `order.status.updated` | Triggered when order status changes | When status changes between: new, preparing, ready, in_delivery, delivered, cancelled, returned, failed |
| استرجاع طلب | `order.returned` | Triggered when an order is returned | When customer returns order items |
| إلغاء طلب | `order.cancelled` | Triggered when an order is cancelled | When order is cancelled by merchant or customer |

**Order Status Values:**
- `new` - جديد
- `preparing` - قيد التحضير
- `ready` - جاهز
- `in_delivery` - قيد التوصيل
- `delivered` - تم التوصيل
- `cancelled` - ملغي
- `returned` - مسترجع
- `failed` - فشل

---

### Product Events (أحداث المنتجات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء منتج | `product.created` | Triggered when a new product is created | When merchant creates a new product |
| تحديث منتج | `product.updated` | Triggered when product details are updated | When product information is modified |
| حذف منتج | `product.deleted` | Triggered when a product is deleted | When product is permanently removed |
| تغيير سعر المنتج | `product.price.updated` | Triggered when product price changes | When product price is modified |
| تحديث المخزون | `product.quantity.updated` | Triggered when product stock quantity changes | When inventory is added or removed |
| إخفاء المنتج | `product.hidden` | Triggered when product is hidden | When product visibility is set to hidden |
| إظهار المنتج | `product.visible` | Triggered when product becomes visible | When product visibility is set to visible |

---

### Category Events (أحداث الفئات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء فئة | `category.created` | Triggered when a new category is created | When merchant creates a product category |
| تحديث فئة | `category.updated` | Triggered when category details are updated | When category information is modified |
| حذف فئة | `category.deleted` | Triggered when a category is deleted | When category is removed |

---

### Customer Events (أحداث العملاء)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء عميل | `customer.created` | Triggered when a new customer is created | When new customer account is registered |
| تحديث عميل | `customer.updated` | Triggered when customer details are updated | When customer modifies their profile |
| حذف عميل | `customer.deleted` | Triggered when a customer is deleted | When customer account is deleted |
| تسجيل دخول العميل | `customer.login` | Triggered when customer logs in | When customer signs into their account |

---

### Cart Events (أحداث السلة)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| سلة متروكة | `cart.abandoned` | Triggered when cart is abandoned | When customer leaves items in cart without purchase |
| تحديث السلة | `cart.updated` | Triggered when cart is modified | When items are added/removed from cart |
| إتمام السلة | `cart.completed` | Triggered when cart is converted to order | When customer completes checkout |

---

### Shipment Events (أحداث الشحن)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء شحنة | `shipment.created` | Triggered when a shipment is created | When merchant creates shipment for order |
| تحديث الشحنة | `shipment.updated` | Triggered when shipment details change | When shipment information is modified |
| شحنة قيد التوصيل | `shipment.in_delivery` | Triggered when shipment is out for delivery | When shipment status changes to in_delivery |
| تم التسليم | `shipment.delivered` | Triggered when shipment is delivered | When shipment delivery is confirmed |
| فشل التسليم | `shipment.failed` | Triggered when delivery attempt fails | When delivery cannot be completed |
| إلغاء الشحنة | `shipment.cancelled` | Triggered when shipment is cancelled | When shipment is cancelled |
| إرجاع الشحنة | `shipment.returned` | Triggered when shipment is returned | When shipment is returned to sender |

---

### Invoice Events (أحداث الفواتير)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء فاتورة | `invoice.created` | Triggered when an invoice is created | When invoice is generated for order |
| تحديث الفاتورة | `invoice.updated` | Triggered when invoice details change | When invoice information is modified |
| إرسال الفاتورة | `invoice.sent` | Triggered when invoice is sent to customer | When invoice email is sent |
| دفع الفاتورة | `invoice.paid` | Triggered when invoice is paid | When invoice payment is completed |
| إلغاء الفاتورة | `invoice.cancelled` | Triggered when invoice is cancelled | When invoice is cancelled |

---

### Payment Events (أحداث الدفع)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| دفع ناجح | `payment.paid` | Triggered when payment is successful | When payment transaction completes successfully |
| فشل الدفع | `payment.failed` | Triggered when payment fails | When payment transaction fails |
| استرداد الدفع | `payment.refunded` | Triggered when payment is refunded | When refund is processed |
| استرداد جزئي | `payment.partially_refunded` | Triggered when partial refund is issued | When part of payment is refunded |

---

### Coupon Events (أحداث القسائم)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| تطبيق قسيمة | `coupon.applied` | Triggered when coupon is applied | When customer uses coupon code |
| إنشاء قسيمة | `coupon.created` | Triggered when coupon is created | When merchant creates new coupon |
| تحديث قسيمة | `coupon.updated` | Triggered when coupon details change | When coupon is modified |
| حذف قسيمة | `coupon.deleted` | Triggered when coupon is deleted | When coupon is removed |

---

### Special Offer Events (أحداث العروض الخاصة)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء عرض خاص | `special_offer.created` | Triggered when special offer is created | When merchant creates special offer |
| تحديث عرض خاص | `special_offer.updated` | Triggered when offer details change | When special offer is modified |
| تفعيل عرض خاص | `special_offer.activated` | Triggered when offer becomes active | When special offer starts |
| إيقاف عرض خاص | `special_offer.deactivated` | Triggered when offer becomes inactive | When special offer ends or is paused |
| حذف عرض خاص | `special_offer.deleted` | Triggered when offer is deleted | When special offer is removed |

---

### Store Events (أحداث المتجر)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| تحديث المتجر | `store.updated` | Triggered when store settings change | When merchant updates store information |
| تثبيت تطبيق | `store.app.installed` | Triggered when app is installed | When merchant installs an app |
| إلغاء تثبيت تطبيق | `store.app.uninstalled` | Triggered when app is uninstalled | When merchant removes an app |
| تحديث إعدادات المتجر | `store.settings.updated` | Triggered when store settings are modified | When store configuration changes |

---

### Branch Events (أحداث الفروع)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء فرع | `branch.created` | Triggered when a new branch is created | When merchant adds a new store branch |
| تحديث الفرع | `branch.updated` | Triggered when branch details change | When branch information is modified |
| حذف فرع | `branch.deleted` | Triggered when a branch is deleted | When branch is removed |

---

### Review Events (أحداث التقييمات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| تقييم جديد | `review.created` | Triggered when new review is submitted | When customer submits product review |
| تحديث التقييم | `review.updated` | Triggered when review is modified | When customer edits their review |

---

### Communication Events (أحداث التواصل)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| رسالة جديدة | `message.received` | Triggered when new message is received | When customer sends message |
| رد على الرسالة | `message.replied` | Triggered when message is replied | When merchant replies to message |
| تذكير بالسلة | `cart.reminder.sent` | Triggered when cart reminder is sent | When abandoned cart reminder is sent |

---

### Ticket/Support Events (أحداث التذاكر/الدعم)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء تذكرة | `ticket.created` | Triggered when support ticket is created | When customer submits support request |
| تحديث التذكرة | `ticket.updated` | Triggered when ticket status changes | When ticket information is modified |
| إغلاق التذكرة | `ticket.closed` | Triggered when ticket is closed | When support ticket is resolved/closed |

---

### Brand Events (أحداث العلامات التجارية)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions |
|---------------------|-----------|-------------|-------------------|
| إنشاء علامة تجارية | `brand.created` | Triggered when new brand is created | When merchant adds a new brand |
| تحديث العلامة التجارية | `brand.updated` | Triggered when brand details change | When brand information is modified |
| حذف العلامة التجارية | `brand.deleted` | Triggered when brand is deleted | When brand is removed |

---

## Event Categories (فئات الأحداث)

Based on the Salla documentation structure, webhook events are organized into these main categories:

1. **Order Events** - Order lifecycle events
2. **Product Events** - Product and inventory events
3. **Category Events** - Category management events
4. **Customer Events** - Customer account events
5. **Cart Events** - Shopping cart events
6. **Shipment Events** - Shipping and delivery events
7. **Invoice Events** - Invoicing events
8. **Payment Events** - Payment transaction events
9. **Coupon Events** - Discount coupon events
10. **Special Offer Events** - Promotional offer events
11. **Store Events** - Store configuration events
12. **Branch Events** - Multi-branch store events
13. **Review Events** - Customer review events
14. **Communication Events** - Messaging and notifications
15. **Ticket Events** - Support ticket events
16. **Brand Events** - Brand management events

---

## Authentication & Security (المصادقة والأمان)

### Authentication Overview

Salla webhooks use HMAC signature verification to ensure payload authenticity and integrity.

### Headers Required

| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Specifies payload format | `application/json` |
| `User-Agent` | Identifies the sender | `Salla-Webhook/1.0` |
| `X-Salla-Signature` | HMAC signature for verification | `sha256=...` |
| `X-Salla-Event` | The event type being triggered | `order.created` |
| `X-Salla-Delivery` | Unique delivery ID for idempotency | `unique-delivery-id` |
| `X-Salla-Store-ID` | The store ID that triggered the event | `123456789` |

### Signature Format

Salla uses HMAC SHA256 for webhook signatures:

```
signature = HMAC_SHA256(webhook_secret, payload_body)
```

The signature is sent in the `X-Salla-Signature` header with a `sha256=` prefix.

### Verification Method (Recommended Implementation)

```javascript
// Node.js example
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

// Usage
const payload = req.body;
const signature = req.headers['x-salla-signature'];
const secret = 'your-webhook-secret';

if (verifySallaWebhook(payload, signature, secret)) {
    // Process webhook
} else {
    res.status(403).send('Invalid signature');
}
```

```php
// PHP example
function verifySallaWebhook($payload, $signature, $secret) {
    $expectedSignature = 'sha256=' . hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($expectedSignature, $signature);
}

// Usage
$payload = json_decode(file_get_contents('php://input'), true);
$signature = $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '';
$secret = 'your-webhook-secret';

if (verifySallaWebhook($payload, $signature, $secret)) {
    // Process webhook
} else {
    http_response_code(403);
    echo 'Invalid signature';
}
```

```python
# Python example
import hmac
import hashlib
import json

def verify_salla_webhook(payload, signature, secret):
    expected_signature = 'sha256=' + hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)

# Usage (Flask example)
from flask import request, jsonify

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_json()
    signature = request.headers.get('X-Salla-Signature', '')
    secret = 'your-webhook-secret'

    if verify_salla_webhook(payload, signature, secret):
        # Process webhook
        return jsonify({'status': 'success'}), 200
    else:
        return jsonify({'error': 'Invalid signature'}), 403
```

### Idempotency Handling

Use the `X-Salla-Delivery` header to handle duplicate webhook deliveries:

```javascript
const processedDeliveries = new Set();

function handleWebhook(deliveryId, payload) {
    if (processedDeliveries.has(deliveryId)) {
        console.log('Duplicate delivery, skipping');
        return;
    }

    // Process webhook
    processedDeliveries.add(deliveryId);

    // Clean up old entries periodically
    if (processedDeliveries.size > 10000) {
        const firstEntry = processedDeliveries.values().next().value;
        processedDeliveries.delete(firstEntry);
    }
}
```

---

## Conditional Webhooks (الخطافات المشروطة)

Salla supports conditional webhooks that trigger only when specific conditions are met.

### Supported Condition Keys

| Condition Key | Data Type | Description | Example Values |
|---------------|-----------|-------------|----------------|
| `status` | String | Order status | `new`, `delivered`, `cancelled` |
| `payment_method` | String | Payment method | `cod`, `visa`, `mada`, `applepay`, `stc_pay` |
| `total` | Number | Order total amount | `>= 100`, `< 500` |
| `gateway` | String | Payment gateway | `tabby`, `tamara`, `checkout` |

### Conditional Webhook Payload Example

```json
{
  "url": "https://your-app.com/webhooks/salla",
  "event": "order.updated",
  "conditions": {
    "status": "delivered",
    "payment_method": "visa"
  }
}
```

### Operators Supported

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equals | `{"status": "="}` |
| `!=` | Not equals | `{"status": "!="}` |
| `>` | Greater than | `{"total": "> 100"}` |
| `>=` | Greater than or equal | `{"total": ">= 100"}` |
| `<` | Less than | `{"total": "< 500"}` |
| `<=` | Less than or equal | `{"total": "<= 500"}` |
| `in` | In array | `{"status": ["new", "delivered"]}` |
| `not_in` | Not in array | `{"status": ["cancelled", "failed"]}` |

---

## Retry Logic (منطق إعادة المحاولة)

### Retry Policy

Salla implements an exponential backoff retry mechanism for failed webhook deliveries:

| Attempt | Timing | Backoff Interval |
|---------|--------|------------------|
| 1 | Immediate | - |
| 2 | 2 minutes after 1st attempt | ~2 min |
| 3 | 10 minutes after 2nd attempt | ~10 min |
| 4 | 30 minutes after 3rd attempt | ~30 min |
| 5 | 1 hour after 4th attempt | ~1 hour |
| 6 | 2 hours after 5th attempt | ~2 hours |
| 7 | 4 hours after 6th attempt | ~4 hours |

**Maximum Retries:** Salla typically retries up to 7 times before marking the webhook as failed.

### Success Response Requirements

Your webhook endpoint should return:
- **HTTP Status:** `200 OK` or `204 No Content`
- **Response Body:** Can be empty or contain a success confirmation

```json
{
  "received": true,
  "message": "Webhook processed successfully"
}
```

### Failure Conditions

Retries are triggered when:
- Endpoint returns HTTP status `4xx` or `5xx` (except 410 Gone)
- Endpoint times out (no response within 30 seconds)
- Network connection fails
- Endpoint is unreachable (DNS failure, connection refused)
- TLS/SSL handshake fails

**Note:** Returning `410 Gone` will permanently disable the webhook for that event.

### Best Practices for Handling Retries

1. **Respond quickly** - Process webhooks asynchronously
2. **Use idempotency keys** - Handle duplicate deliveries gracefully
3. **Monitor webhook logs** - Check Salla dashboard for delivery status
4. **Implement exponential backoff** - For downstream API calls
5. **Return appropriate status codes** - Use 2xx for success, 5xx for transient errors

---

## Webhook Management APIs

### Register Webhook

**Endpoint:** `POST /webhooks`

```json
{
  "url": "https://your-app.com/webhooks/salla",
  "events": ["order.created", "order.updated", "product.updated"],
  "secret": "your-webhook-secret-key",
  "conditions": {
    "status": "delivered"
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "webhook_id",
    "url": "https://your-app.com/webhooks/salla",
    "events": ["order.created", "order.updated", "product.updated"],
    "secret": "your-webhook-secret-key",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Update Webhook

**Endpoint:** `PUT /webhooks/{webhook_id}`

```json
{
  "url": "https://your-app.com/webhooks/salla-updated",
  "events": ["order.created", "order.updated"],
  "conditions": {
    "status": ["new", "delivered"]
  }
}
```

### List Active Webhooks

**Endpoint:** `GET /webhooks`

**Response:**
```json
{
  "data": [
    {
      "id": "webhook_id_1",
      "url": "https://your-app.com/webhooks/salla",
      "events": ["order.created", "order.updated"],
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "per_page": 15,
    "current_page": 1
  }
}
```

### Deactivate Webhook

**Endpoint:** `DELETE /webhooks/{webhook_id}`

**Response:**
```json
{
  "message": "Webhook deactivated successfully",
  "data": {
    "id": "webhook_id",
    "is_active": false
  }
}
```

### List Available Events

**Endpoint:** `GET /webhooks/events`

**Response:**
```json
{
  "data": [
    {
      "event": "order.created",
      "description": "Triggered when a new order is created",
      "category": "Order"
    },
    {
      "event": "product.updated",
      "description": "Triggered when product details are updated",
      "category": "Product"
    }
  ]
}
```

---

## Payload Examples for All Events

### Order Created Payload

```json
{
  "event": "order.created",
  "store_id": "123456789",
  "data": {
    "id": 12345,
    "reference": "ORD-12345",
    "status": "new",
    "payment_status": "paid",
    "customer": {
      "id": 98765,
      "name": "Customer Name",
      "email": "customer@example.com",
      "phone": "+966500000000"
    },
    "items": [
      {
        "id": 111,
        "product_id": 222,
        "name": "Product Name",
        "quantity": 2,
        "price": 100.00,
        "total": 200.00
      }
    ],
    "total": 200.00,
    "currency": "SAR",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Product Updated Payload

```json
{
  "event": "product.updated",
  "store_id": "123456789",
  "data": {
    "id": 45678,
    "name": "Product Name",
    "description": "Product description",
    "price": 150.00,
    "sale_price": 100.00,
    "quantity": 50,
    "sku": "SKU-12345",
    "status": "active",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Customer Created Payload

```json
{
  "event": "customer.created",
  "store_id": "123456789",
  "data": {
    "id": 98765,
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "+966500000000",
    "city": "Riyadh",
    "country": "Saudi Arabia",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Shipment Created Payload

```json
{
  "event": "shipment.created",
  "store_id": "123456789",
  "data": {
    "id": 77777,
    "order_id": 12345,
    "shipping_company": "Aramex",
    "tracking_number": "TRACK123456",
    "status": "created",
    "address": {
      "city": "Riyadh",
      "district": "Al Olaya",
      "street": "Street Name",
      "building": "123",
      "phone": "+966500000000"
    },
    "created_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Payment Paid Payload

```json
{
  "event": "payment.paid",
  "store_id": "123456789",
  "data": {
    "id": 88888,
    "order_id": 12345,
    "amount": 200.00,
    "currency": "SAR",
    "payment_method": "visa",
    "gateway": "checkout",
    "status": "paid",
    "transaction_id": "TXN123456789",
    "paid_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Cart Abandoned Payload

```json
{
  "event": "cart.abandoned",
  "store_id": "123456789",
  "data": {
    "id": 99999,
    "customer": {
      "id": 98765,
      "name": "Customer Name",
      "email": "customer@example.com",
      "phone": "+966500000000"
    },
    "items": [
      {
        "product_id": 222,
        "name": "Product Name",
        "quantity": 1,
        "price": 100.00
      }
    ],
    "total": 100.00,
    "currency": "SAR",
    "abandoned_at": "2024-01-01T12:00:00Z"
  },
  "created_at": "2024-01-01T12:00:00Z"
}
```

---

## Undocumented/Rare Events

Based on Salla's event structure, these additional events may exist but are less commonly documented:

| Event Key | Description | Notes |
|-----------|-------------|-------|
| `product.quantity.low` | Triggered when product stock is low | May have threshold configuration |
| `customer.verification.completed` | Triggered when customer verification is complete | For verified merchant accounts |
| `store.subscription.renewed` | Triggered when store subscription is renewed | App subscription events |
| `store.subscription.cancelled` | Triggered when store subscription is cancelled | App subscription events |
| `affiliate.sale.created` | Triggered when affiliate sale is recorded | For affiliate program integration |

---

## Integration Tips

### Best Practices

1. **Always verify signatures** - Never trust webhook payloads without signature verification
2. **Return responses quickly** - Process webhooks asynchronously to avoid timeouts
3. **Use idempotency keys** - Handle duplicate webhook deliveries using `X-Salla-Delivery`
4. **Implement retry logic** - Handle downstream service failures gracefully
5. **Log all webhooks** - Keep detailed logs for debugging and audit purposes
6. **Use HTTPS** - Always use HTTPS endpoints for webhook URLs
7. **Monitor webhook health** - Set up alerts for failed webhook deliveries
8. **Validate payloads** - Always validate webhook payload structure
9. **Handle all events** - Respond to all events even if not processing them
10. **Use environment variables** - Store webhook secrets securely

### Testing Recommendations

1. Use webhook testing tools like ngrok, localtunnel, or webhook.site for local development
2. Test with real orders in sandbox/staging environment
3. Verify signature verification logic works correctly
4. Test retry behavior by returning error responses
5. Validate all payload fields before processing
6. Test conditional webhooks with various conditions
7. Monitor webhook logs in Salla dashboard
8. Test idempotency by replaying webhooks

### Security Considerations

1. **Never expose webhook secrets** in logs or error messages
2. **Use strong, random secrets** for webhook verification
3. **Rotate secrets periodically** to maintain security
4. **Implement rate limiting** on webhook endpoints
5. **Validate request origin** using IP whitelisting if available
6. **Use secure headers** including Content-Security-Policy
7. **Monitor for abuse** - detect unusual webhook patterns
8. **Encrypt sensitive data** at rest and in transit

---

## Support & Resources

| Resource | Contact Method |
|----------|---------------|
| **Salla Developer Support** | support@salla.dev |
| **Developer Portal** | https://docs.salla.dev |
| **Developer Blog** | https://salla.dev/blog |
| **Global Developers Community** | Telegram group |
| **Service Status** | https://status.salla.dev |

---

## Research Summary

**Total Events Documented:** 60+
- Order Events: 5
- Product Events: 7
- Category Events: 3
- Customer Events: 4
- Cart Events: 3
- Shipment Events: 7
- Invoice Events: 5
- Payment Events: 4
- Coupon Events: 4
- Special Offer Events: 5
- Store Events: 4
- Branch Events: 3
- Review Events: 2
- Communication Events: 3
- Ticket Events: 3
- Brand Events: 3

**Events Supporting Conditions:** Most order and payment events

**Documentation Status:** Comprehensive official documentation available at docs.salla.dev

**Key Features:**
- HMAC SHA256 signature verification
- Conditional webhook filtering
- Exponential backoff retry logic
- Idempotency support via delivery IDs
- Real-time event notifications
- Multiple event categories

---

*Last Updated: March 2026*
*Research conducted based on official Salla documentation at https://docs.salla.dev*

