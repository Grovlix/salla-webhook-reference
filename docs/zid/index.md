# Zid Webhooks Documentation - وثائق أحداث Webhook لزد

## Overview (نظرة عامة)

**Arabic:** توفر Zid نظام Webhooks متكامل لإشعارك بالأحداث المهمة في متجرك. يمكنك الاشتراك في الأحداث التي تهمك للحصول على إشعارات فورية.

**English:** Zid provides a comprehensive Webhooks system to notify you of important events in your store. You can subscribe to the events that matter to you for instant notifications.

---

## Official Resources (موارد رسمية)

| Resource (المصدر) | Link (الرابط) |
|-------------------|---------------|
| Webhooks Overview | https://docs.zid.sa/webhooks |
| API Documentation | https://docs.zid.sa |
| Help Center | https://help.zid.sa |
| Main Website | https://zid.sa |

---

## Available Events (الأحداث المتاحة)

### Order Events (أحداث الطلبات) - 3 Events

| Event (الحدث) | Description (الوصف) | Supports Conditions |
|---------------|---------------------|---------------------|
| [order.create](order/order.create.md) | إنشاء طلب جديد | Yes |
| [order.status.update](order/order.status.update.md) | تحديث حالة الطلب | Yes |
| [order.payment_status.update](order/order.payment_status.update.md) | تحديث حالة الدفع | No |

---

### Product Events (أحداث المنتجات) - 4 Events

| Event (الحدث) | Description (الوصف) | Supports Conditions |
|---------------|---------------------|---------------------|
| [product.create](product/product.create.md) | إنشاء منتج جديد | No |
| [product.update](product/product.update.md) | تحديث المنتج | No |
| [product.publish](product/product.publish.md) | نشر المنتج | No |
| [product.delete](product/product.delete.md) | حذف المنتج | No |

---

### Customer Events (أحداث العملاء) - 4 Events

| Event (الحدث) | Description (الوصف) | Supports Conditions |
|---------------|---------------------|---------------------|
| [customer.create](customer/customer.create.md) | إنشاء عميل جديد | No |
| [customer.update](customer/customer.update.md) | تحديث بيانات العميل | No |
| [customer.merchant.update](customer/customer.merchant.update.md) | تحديث التاجر للعميل | No |
| [customer.login](customer/customer.login.md) | تسجيل دخول العميل | No |

---

### Abandoned Cart Events (أحداث السلة المتروكة) - 2 Events

| Event (الحدث) | Description (الوصف) | Supports Conditions |
|---------------|---------------------|---------------------|
| [abandoned_cart.created](abandoned_cart/abandoned_cart.created.md) | إنشاء سلة متروكة | No |
| [abandoned_cart.completed](abandoned_cart/abandoned_cart.completed.md) | إتمام السلة المتروكة | No |

---

### Category Events (أحداث الفئات) - 3 Events

| Event (الحدث) | Description (الوصف) | Supports Conditions |
|---------------|---------------------|---------------------|
| [category.create](category/category.create.md) | إنشاء فئة جديدة | No |
| [category.update](category/category.update.md) | تحديث الفئة | No |
| [category.delete](category/category.delete.md) | حذف الفئة | No |

---

## Event Conditions (شروط الأحداث)

بعض الأحداث تدعم تصفية الإشعارات بناءً على شروط محددة:

### Supported Events (الأحداث المدعومة)
- `order.create`
- `order.status.update`

### Condition Keys (مفاتيح الشروط)

| Key (المفتاح) | Type (النوع) | Description (الوصف) | Values (القيم) |
|---------------|--------------|---------------------|----------------|
| `delivery_option_id` | Integer | تصفية حسب خيار التوصيل | Any valid delivery option ID |
| `status` | String | تصفية حسب حالة الطلب | `new`, `preparing`, `ready`, `inDelivery`, `delivered`, `cancelled` |
| `payment_method` | String | تصفية حسب طريقة الدفع | `Cash On Delivery`, `Credit Card`, `Bank Transfer` |

### Example (مثال)

```json
{
  "conditions": {
    "delivery_option_id": "55",
    "payment_method": "Cash On Delivery"
  }
}
```

---

## Authentication (المصادقة)

### Headers Required (الرؤوس المطلوبة)

| Header (الرأس) | Purpose (الغرض) |
|---------------|-----------------|
| `Content-Type` | نوع المحتوى (عادة `application/json`) |
| `User-Agent` | معرف المرسل (Zid) |
| `X-Zid-Signature` | توقيع HMAC للتحقق من_payload |
| `X-Zid-Timestamp` | طابع زمني لمنع هجمات إعادة التشغيل |
| `X-Zid-Event` | نوع الحدث المشغل |

### Signature Verification (التحقق من التوقيع)

```javascript
// Node.js
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}
```

```php
// PHP
function verifyWebhookSignature($payload, $signature, $secret) {
    $expectedSignature = hash_hmac('sha256', $payload, $secret);
    return hash_equals($expectedSignature, $signature);
}
```

```python
# Python
import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected_signature, signature)
```

---

## Retry Logic (منطق إعادة المحاولة)

| Retry Attempt (محاولة إعادة) | Timing (التوقيت) |
|------------------------------|-----------------|
| 1st retry | بعد حوالي 2 دقيقة |
| 2nd retry | بعد حوالي 10 دقائق من المحاولة الأولى |
| 3rd retry | بعد حوالي 30 دقيقة من المحاولة الثانية |
| 4th retry | بعد حوالي ساعة من المحاولة الثالثة |
| 5th retry | بعد حوالي ساعتين من المحاولة الرابعة |

### Success Response (استجابة النجاح)
- HTTP Status: `200 OK` أو `204 No Content`
- Response body: فارغ أو `{"received": true}`

### Failure Conditions (شروط الفشل)
- Endpoint يعيد HTTP status `4xx` أو `5xx`
- Endpoint ينتهي مهلته (لا استجابة خلال 30 ثانية)
- فشل الاتصال بالشبكة
- Endpoint غير متاح

---

## Best Practices (أفضل الممارسات)

1. **Always verify signatures** - تحقق دائماً من التوقيع
2. **Return responses quickly** - أرجع استجابة بسرعة
3. **Use idempotency keys** - استخدم مفاتيح عدم التكرار
4. **Monitor Webhook Logs** - راقب سجلات Webhook
5. **Handle all error cases** - تعامل مع جميع حالات الخطأ

---

## Summary (ملخص)

- **Total Events:** 18 حدث
- **Order Events:** 3
- **Product Events:** 4
- **Customer Events:** 4
- **Abandoned Cart Events:** 2
- **Category Events:** 3
- **Events Supporting Conditions:** 2 (`order.create`, `order.status.update`)

---

*Last Updated: March 2026*
*آخر تحديث: مارس 2026*

*Documentation based on official Zid documentation at https://docs.zid.sa/webhooks*
*الوثائق مبنية على وثائق زد الرسمية*
