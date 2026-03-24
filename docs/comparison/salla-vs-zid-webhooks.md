# Salla vs Zid Webhooks Comparison
# مقارنة Webhooks سلة وزد

## Overview (نظرة عامة)

**English:** This guide provides a comprehensive comparison between the webhook systems of Salla and Zid, the two leading e-commerce platforms in Saudi Arabia and the MENA region.

**Arabic:** يوفر هذا الدليل مقارنة شاملة بين أنظمة Webhooks في منصتي سلة وزد، وهما المنصتان الرائدتان للتجارة الإلكترونية في المملكة العربية السعودية ومنطقة الشرق الأوسط وشمال أفريقيا.

---

## Platform Comparison (مقارنة المنصات)

| Feature (الميزة) | Salla (سلة) | Zid (زد) |
|------------------|-------------|----------|
| **Official Documentation** | [docs.salla.sa](https://docs.salla.sa) | [docs.zid.sa](https://docs.zid.sa) |
| **Webhook Management** | Dashboard & API | Dashboard Only |
| **Signature Algorithm** | HMAC-SHA256 | HMAC-SHA256 |
| **Retry Mechanism** | Yes (up to 5 retries) | Yes (up to 5 retries) |
| **Event Conditions** | Limited Support | Yes (for select events) |
| **Test Webhooks** | Yes | No |
| **Real-time Logs** | Yes | Yes |

---

## Event Categories (فئات الأحداث)

### Salla Events (أحداث سلة)

| Category (الفئة) | Events Count (عدد الأحداث) |
|------------------|---------------------------|
| Order (الطلبات) | 15+ events |
| Product (المنتجات) | 10+ events |
| Customer (العملاء) | 8+ events |
| Checkout (الدفع) | 5+ events |
| Subscription (الاشتراكات) | 6+ events |
| Invoice (الفواتير) | 4+ events |
| Abandoned Cart (السلة المتروكة) | 3+ events |
| Branch (الفروع) | 4+ events |
| Shipping (الشحن) | 3+ events |
| **Total (المجموع)** | **60+ events** |

### Zid Events (أحداث زد)

| Category (الفئة) | Events Count (عدد الأحداث) |
|------------------|---------------------------|
| Order (الطلبات) | 3 events |
| Product (المنتجات) | 4 events |
| Customer (العملاء) | 4 events |
| Abandoned Cart (السلة المتروكة) | 2 events |
| Category (الفئات) | 3 events |
| **Total (المجموع)** | **18 events** |

---

## Authentication Headers (رؤوس المصادقة)

### Salla Headers (رؤوس سلة)

```http
Content-Type: application/json
User-Agent: Salla-Webhook
Authorization: Bearer {access_token}
X-Salla-Signature: {signature}
X-Salla-Event: order.created
X-Salla-Delivery: {delivery_id}
X-Salla-Merchant-ID: {merchant_id}
```

### Zid Headers (رؤوس زد)

```http
Content-Type: application/json
User-Agent: Zid-Webhook
X-Zid-Signature: {signature}
X-Zid-Timestamp: {timestamp}
X-Zid-Event: order.create
X-Zid-Store-ID: {store_id}
```

---

## Signature Verification (التحقق من التوقيع)

### Salla Implementation (تنفيذ سلة)

```javascript
const crypto = require('crypto');

function verifySallaWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}
```

### Zid Implementation (تنفيذ زد)

```javascript
const crypto = require('crypto');

function verifyZidWebhook(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(`sha256=${digest}`)
    );
}
```

**Key Difference (الفرق الرئيسي):** Zid prefixes the signature with `sha256=`.

---

## Retry Logic (منطق إعادة المحاولة)

### Salla Retry Schedule (جدول إعادة المحاولة - سلة)

| Attempt (المحاولة) | Timing (التوقيت) |
|--------------------|------------------|
| 1st retry | ~1 minute |
| 2nd retry | ~5 minutes |
| 3rd retry | ~30 minutes |
| 4th retry | ~2 hours |
| 5th retry | ~24 hours |

### Zid Retry Schedule (جدول إعادة المحاولة - زد)

| Attempt (المحاولة) | Timing (التوقيت) |
|--------------------|------------------|
| 1st retry | ~2 minutes |
| 2nd retry | ~10 minutes |
| 3rd retry | ~30 minutes |
| 4th retry | ~1 hour |
| 5th retry | ~2 hours |

---

## Event Conditions (شروط الأحداث)

### Salla Conditions (شروط سلة)

Limited condition support. Some events allow filtering by:
- Order status
- Payment method
- Shipping method

### Zid Conditions (شروط زد)

More robust condition support for:
- `order.create` - Filter by delivery option, payment method, status
- `order.status.update` - Filter by status, delivery option
- Condition keys: `delivery_option_id`, `status`, `payment_method`

---

## Response Requirements (متطلبات الاستجابة)

### Both Platforms (كلا المنصتين)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "received": true
}
```

**Important (مهم):** Respond within 30 seconds to avoid timeout.

---

## Use Cases (حالات الاستخدام)

### Choose Salla When (اختر سلة عندما):

- You need more event types (60+ vs 18)
- You require subscription webhooks
- You need invoice/receipt events
- You want API-based webhook management
- You need test webhook functionality
- You require branch/store events

### Choose Zid When (اختر زد عندما):

- You need event filtering/conditions
- You prefer simpler integration
- You have fewer event requirements
- You want detailed abandoned cart events
- You need category management events

---

## Best Practices (أفضل الممارسات)

### For Both Platforms (لكلا المنصتين)

1. **Always verify signatures** - تحقق دائماً من التوقيع
2. **Use HTTPS endpoints** - استخدم نقاط نهاية HTTPS
3. **Implement idempotency** - طبق عدم التكرار
4. **Return quick responses** - أرجع استجابات سريعة
5. **Log all events** - سجل جميع الأحداث
6. **Handle retries gracefully** - تعامل مع إعادة المحاولة بأمان

### Salla-Specific (خاص بسلة)

- Use the API to manage webhooks programmatically
- Leverage test webhooks during development
- Monitor subscription events for recurring payments

### Zid-Specific (خصص لزد)

- Set up event conditions to reduce unnecessary calls
- Use category events for inventory management
- Monitor abandoned cart events for recovery automation

---

## Summary (الملخص)

| Aspect (الجانب) | Salla (سلة) | Zid (زد) |
|-----------------|-------------|----------|
| **Event Variety** | ⭐⭐⭐⭐⭐ (60+) | ⭐⭐⭐ (18) |
| **Condition Support** | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Developer Experience** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Documentation Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **API Management** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Test Tools** | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## Related Resources (موارد ذات صلة)

- [Salla Webhook Documentation](/salla/)
- [Zid Webhook Documentation](/zid/)
- [Getting Started Guide](/guides/getting-started)
- [Security Best Practices](/guides/webhook-security)

---

*Last Updated: March 2026 | آخر تحديث: مارس 2026*

*Part of the [Salla & Zid Webhook Reference](https://grovlix.github.io/salla-webhook-reference/) by [Grovlix](https://grovlix.com)*
