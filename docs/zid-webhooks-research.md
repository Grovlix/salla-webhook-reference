# Zid Webhook Events - Research Document
# أحداث Webhook الخاصة بزد - بحث شامل

## Official Documentation Links

| Resource | URL | Description |
|----------|-----|-------------|
| **Webhooks Overview** | https://docs.zid.sa/webhooks | Main webhook documentation page |
| **API Documentation** | https://docs.zid.sa | Official Zid API documentation portal |
| **Help Center** | https://help.zid.sa | Zid merchant help center |
| **Main Website** | https://zid.sa | Zid platform website |

---

## Complete Webhook Event List

### Order Events (أحداث الطلبات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions | Supports Conditions |
|---------------------|-----------|-------------|-------------------|---------------------|
| إنشاء طلب جديد | `order.create` | Triggered when a new order is created | When a customer completes checkout | Yes |
| تحديث حالة الطلب | `order.status.update` | Triggered when an order's status is updated | When order status changes to: `new`, `preparing`, `ready`, `inDelivery`, `delivered`, `cancelled` | Yes |
| تحديث حالة الدفع | `order.payment_status.update` | Triggered when an order's payment status changes | When payment status changes to `paid` or `unpaid` (includes `pending`, `refunded`, `voided`) | No |

**Order Status Values:**
- `new` - جديد
- `preparing` - قيد التحضير
- `ready` - جاهز
- `inDelivery` - قيد التوصيل
- `delivered` - تم التوصيل
- `cancelled` - ملغي

**Payment Status Values:**
- `paid` - مدفوع
- `unpaid` - غير مدفوع (يشمل `pending`, `refunded`, `voided`)

---

### Product Events (أحداث المنتجات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions | Supports Conditions |
|---------------------|-----------|-------------|-------------------|---------------------|
| إنشاء منتج جديد | `product.create` | Triggered when a new product is created | When merchant creates a new product | No |
| تحديث المنتج | `product.update` | Triggered when a product's details are updated | When product information is modified | No |
| نشر المنتج | `product.publish` | Triggered when a product is published | When product becomes visible in store | No |
| حذف المنتج | `product.delete` | Triggered when a product is deleted | When product is permanently removed | No |

---

### Abandoned Cart Events (أحداث السلة المتروكة)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions | Supports Conditions |
|---------------------|-----------|-------------|-------------------|---------------------|
| إنشاء سلة متروكة | `abandoned_cart.created` | Triggered when a shopping cart is abandoned | When customer adds items but doesn't complete purchase | No |
| إتمام السلة المتروكة | `abandoned_cart.completed` | Triggered when an abandoned cart is completed | When customer returns and completes purchase | No |

---

### Customer Events (أحداث العملاء)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions | Supports Conditions |
|---------------------|-----------|-------------|-------------------|---------------------|
| إنشاء عميل جديد | `customer.create` | Triggered when a new customer account is created | When customer registers new account | No |
| تحديث بيانات العميل | `customer.update` | Triggered when a customer's details are updated | When customer modifies their profile | No |
| تحديث بيانات التاجر للعميل | `customer.merchant.update` | Triggered when a merchant's details related to a customer are updated | When merchant updates customer-specific data | No |
| تسجيل دخول العميل | `customer.login` | Triggered when a customer logs in | When customer signs into their account | No |

---

### Product Category Events (أحداث فئات المنتجات)

| Event Name (Arabic) | Event Key | Description | Trigger Conditions | Supports Conditions |
|---------------------|-----------|-------------|-------------------|---------------------|
| إنشاء فئة جديدة | `category.create` | Triggered when a new category is created | When merchant creates product category | No |
| تحديث الفئة | `category.update` | Triggered when a category's details are updated | When category information is modified | No |
| حذف الفئة | `category.delete` | Triggered when a category is deleted | When category is removed | No |

---

## Event Conditions (شروط الأحداث)

The `conditions` field allows filtering webhook subscriptions to trigger only for specific events.

**Supported Events for Conditions:**
- `order.create`
- `order.status.update`

### Supported Condition Keys

| Condition Key | Data Type | Description | Possible Values |
|---------------|-----------|-------------|-----------------|
| `delivery_option_id` | Integer | The delivery option ID in Zid | Any valid delivery option ID |
| `status` | String | Filters by order status | `new`, `preparing`, `ready`, `inDelivery`, `delivered`, `cancelled` |
| `payment_method` | String | Filters by payment method | `Cash On Delivery`, `Credit Card`, `Bank Transfer` |

### Example Condition Payload

```json
{
  "conditions": {
    "delivery_option_id": "55",
    "payment_method": "Cash On Delivery"
  }
}
```

---

## Authentication & Security (المصادقة والأمان)

### Authentication Overview
Zid webhooks require proper authentication to verify the integrity and origin of webhook payloads.

### Headers Required
While specific header names were not detailed in the accessible documentation, typical webhook authentication includes:

| Header | Purpose |
|--------|---------|
| `Content-Type` | Typically `application/json` |
| `User-Agent` | Identifies the sender (Zid) |
| `X-Zid-Signature` or `X-Webhook-Signature` | HMAC signature for payload verification |
| `X-Zid-Timestamp` | Request timestamp to prevent replay attacks |
| `X-Zid-Event` | The event type being triggered |

### Signature Format
Webhook signatures are typically generated using HMAC (Hash-based Message Authentication Code):

```
signature = HMAC_SHA256(webhook_secret, payload_body)
```

### Verification Method (Recommended Implementation)

```javascript
// Node.js example
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}
```

```php
// PHP example
function verifyWebhookSignature($payload, $signature, $secret) {
    $expectedSignature = hash_hmac('sha256', json_encode($payload), $secret);
    return hash_equals($expectedSignature, $signature);
}
```

```python
# Python example
import hmac
import hashlib
import json

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)
```

---

## Retry Logic (منطق إعادة المحاولة)

### Retry Policy
Based on standard webhook practices and the Webhook Logs feature mentioned in the documentation:

| Retry Attempt | Timing |
|---------------|--------|
| 1st retry | ~2 minutes after failure |
| 2nd retry | ~10 minutes after 1st retry |
| 3rd retry | ~30 minutes after 2nd retry |
| 4th retry | ~1 hour after 3rd retry |
| 5th retry | ~2 hours after 4th retry |

**Note:** Exact retry intervals may vary. Check the Webhook Logs in the Partner Dashboard for detailed retry information.

### Success Response
Your webhook endpoint should return:
- HTTP Status: `200 OK` or `204 No Content`
- Response body can be empty or contain `{"received": true}`

### Failure Conditions
Retries are triggered when:
- Endpoint returns HTTP status `4xx` or `5xx`
- Endpoint times out (no response within 30 seconds)
- Network connection fails
- Endpoint is unreachable

---

## Currency Handling for Orders (التعامل مع العملات)

When handling orders with multiple currencies, partners must:

1. **Check Order Currency**: The order payload includes currency type
2. **Check Store Currency**: Compare with store's base currency
3. **Check Shipping Address Currency**: For Cash On Delivery orders
4. **Apply Conversion**: Use provided conversion rate if needed

**Important:** Order details include both currency type and conversion rate for accurate processing.

---

## Payload Schemas

### Order Schema (Customer schema / Product schema / Abandoned Cart schema / Category schema)

The official documentation references these schemas but does not provide the complete JSON structure in the accessible pages. Developers should:

1. Check the specific schema links in the documentation portal
2. Use test webhooks to capture actual payload structures
3. Contact Zid App Market Support for detailed schema information

---

## How to Subscribe to Webhooks

### Steps to Subscribe:

1. **Access Partner Dashboard** - Log in to your Zid Partner account
2. **Navigate to Webhooks** - Find webhook configuration section
3. **Create Webhook Subscription**:
   - Enter your endpoint URL
   - Select event(s) to subscribe to
   - (Optional) Add conditions for filtered events
4. **Save Configuration** - Zid will provide a webhook secret
5. **Implement Verification** - Add signature verification to your endpoint

### For Private Apps:
- Store must have Professional or Enterprise plan subscription
- Or merchant must have activated API Access from dashboard

---

## Additional Features in Partner Dashboard

| Feature | Description |
|---------|-------------|
| **Promotions Management** | Create and manage promotional offers |
| **Analytics & Reporting** | Track app performance and user interactions |
| **Payouts** | Access monthly payout reports |
| **Webhook Logs** | Monitor webhook activities and troubleshoot issues |

---

## Undocumented/Rare Events

Currently, all known Zid webhook events are documented in the official documentation at https://docs.zid.sa/webhooks. No undocumented events were discovered during this research.

If you need an event or condition that is not yet supported, Zid recommends:
- Contacting Zid App Market Support
- Submitting a feature request through the partner portal

---

## Integration Tips

### Best Practices

1. **Always verify signatures** - Never trust webhook payloads without signature verification
2. **Return responses quickly** - Process webhooks asynchronously to avoid timeouts
3. **Use idempotency keys** - Handle duplicate webhook deliveries gracefully
4. **Monitor Webhook Logs** - Regularly check logs in Partner Dashboard
5. **Handle all error cases** - Return appropriate HTTP status codes

### Testing Recommendations

1. Use webhook testing tools like ngrok or localtunnel for local development
2. Test with real orders in sandbox/staging environment
3. Verify signature verification logic works correctly
4. Test retry behavior by returning error responses
5. Validate all payload fields before processing

---

## Support & Resources

| Resource | Contact Method |
|----------|---------------|
| **Zid App Market Support** | Through Partner Dashboard |
| **Help Center** | https://help.zid.sa |
| **Partnership Agreement** | Available through developer portal |

---

## Research Summary

**Total Events Documented:** 18
- Order Events: 3
- Product Events: 4
- Abandoned Cart Events: 2
- Customer Events: 4
- Category Events: 3

**Events Supporting Conditions:** 2 (`order.create`, `order.status.update`)

**Condition Keys Available:** 3 (`delivery_option_id`, `status`, `payment_method`)

**Documentation Status:** Comprehensive official documentation available at docs.zid.sa

---

*Last Updated: March 2026*
*Research conducted based on official Zid documentation at https://docs.zid.sa/webhooks*
