# Salla Webhooks Documentation
# دليل Webhooks الخاص بسلة

## Overview (نظرة عامة)

**English:** Salla webhooks enable real-time notifications for events occurring in your Salla store. This documentation covers all available webhook events, their payloads, and implementation examples.

**العربية:** تمكنك Webhooks الخاصة بسلة من الحصول على إشعارات فورية للأحداث التي تحدث في متجرك. يغطي هذا الدليل جميع أحداث Webhook المتاحة وحمولاتها وأمثلة التنفيذ.

## Table of Contents (فهرس المحتويات)

### [Order Events (أحداث الطلبات)](order/)
- [order.created - طلب جديد](order/order.created.md)
- [order.updated - تحديث الطلب](order/order.updated.md)
- [order.status.updated - تغيير حالة الطلب](order/order.status.updated.md)
- [order.returned - استرجاع طلب](order/order.returned.md)
- [order.cancelled - إلغاء طلب](order/order.cancelled.md)

### [Product Events (أحداث المنتجات)](product/)
- [product.created - إنشاء منتج](product/product.created.md)
- [product.updated - تحديث منتج](product/product.updated.md)
- [product.deleted - حذف منتج](product/product.deleted.md)
- [product.price.updated - تغيير سعر المنتج](product/product.price.updated.md)
- [product.quantity.updated - تحديث المخزون](product/product.quantity.updated.md)
- [product.hidden - إخفاء المنتج](product/product.hidden.md)
- [product.visible - إظهار المنتج](product/product.visible.md)

### [Customer Events (أحداث العملاء)](customer/)
- [customer.created - إنشاء عميل](customer/customer.created.md)
- [customer.updated - تحديث عميل](customer/customer.updated.md)
- [customer.deleted - حذف عميل](customer/customer.deleted.md)
- [customer.login - تسجيل دخول العميل](customer/customer.login.md)

### [Cart Events (أحداث السلة)](cart/)
- [cart.abandoned - سلة متروكة](cart/cart.abandoned.md)
- [cart.updated - تحديث السلة](cart/cart.updated.md)
- [cart.completed - إتمام السلة](cart/cart.completed.md)

### [Shipment Events (أحداث الشحن)](shipment/)
- [shipment.created - إنشاء شحنة](shipment/shipment.created.md)
- [shipment.updated - تحديث الشحنة](shipment/shipment.updated.md)
- [shipment.in_delivery - شحنة قيد التوصيل](shipment/shipment.in_delivery.md)
- [shipment.delivered - تم التسليم](shipment/shipment.delivered.md)
- [shipment.failed - فشل التسليم](shipment/shipment.failed.md)
- [shipment.cancelled - إلغاء الشحنة](shipment/shipment.cancelled.md)
- [shipment.returned - إرجاع الشحنة](shipment/shipment.returned.md)

### [Invoice Events (أحداث الفواتير)](invoice/)
- [invoice.created - إنشاء فاتورة](invoice/invoice.created.md)
- [invoice.updated - تحديث الفاتورة](invoice/invoice.updated.md)
- [invoice.sent - إرسال الفاتورة](invoice/invoice.sent.md)
- [invoice.paid - دفع الفاتورة](invoice/invoice.paid.md)
- [invoice.cancelled - إلغاء الفاتورة](invoice/invoice.cancelled.md)

### [Payment Events (أحداث الدفع)](payment/)
- [payment.paid - دفع ناجح](payment/payment.paid.md)
- [payment.failed - فشل الدفع](payment/payment.failed.md)
- [payment.refunded - استرداد الدفع](payment/payment.refunded.md)
- [payment.partially_refunded - استرداد جزئي](payment/payment.partially_refunded.md)

### [Coupon Events (أحداث القسائم)](coupon/)
- [coupon.applied - تطبيق قسيمة](coupon/coupon.applied.md)
- [coupon.created - إنشاء قسيمة](coupon/coupon.created.md)
- [coupon.updated - تحديث قسيمة](coupon/coupon.updated.md)
- [coupon.deleted - حذف قسيمة](coupon/coupon.deleted.md)

### [Special Offer Events (أحداث العروض الخاصة)](special-offer/)
- [special_offer.created - إنشاء عرض خاص](special-offer/special_offer.created.md)
- [special_offer.updated - تحديث عرض خاص](special-offer/special_offer.updated.md)
- [special_offer.activated - تفعيل عرض خاص](special-offer/special_offer.activated.md)
- [special_offer.deactivated - إيقاف عرض خاص](special-offer/special_offer.deactivated.md)
- [special_offer.deleted - حذف عرض خاص](special-offer/special_offer.deleted.md)

### [Store Events (أحداث المتجر)](store/)
- [store.updated - تحديث المتجر](store/store.updated.md)
- [store.app.installed - تثبيت تطبيق](store/store.app.installed.md)
- [store.app.uninstalled - إلغاء تثبيت تطبيق](store/store.app.uninstalled.md)
- [store.settings.updated - تحديث إعدادات المتجر](store/store.settings.updated.md)

### [Branch Events (أحداث الفروع)](branch/)
- [branch.created - إنشاء فرع](branch/branch.created.md)
- [branch.updated - تحديث الفرع](branch/branch.updated.md)
- [branch.deleted - حذف فرع](branch/branch.deleted.md)

### [Category Events (أحداث الفئات)](category/)
- [category.created - إنشاء فئة](category/category.created.md)
- [category.updated - تحديث فئة](category/category.updated.md)
- [category.deleted - حذف فئة](category/category.deleted.md)

### [Review Events (أحداث التقييمات)](review/)
- [review.created - تقييم جديد](review/review.created.md)
- [review.updated - تحديث التقييم](review/review.updated.md)

### [Communication Events (أحداث التواصل)](communication/)
- [message.received - رسالة جديدة](communication/message.received.md)
- [message.replied - رد على الرسالة](communication/message.replied.md)
- [cart.reminder.sent - تذكير بالسلة](communication/cart.reminder.sent.md)

### [Ticket Events (أحداث التذاكر)](ticket/)
- [ticket.created - إنشاء تذكرة](ticket/ticket.created.md)
- [ticket.updated - تحديث التذكرة](ticket/ticket.updated.md)
- [ticket.closed - إغلاق التذكرة](ticket/ticket.closed.md)

### [Brand Events (أحداث العلامات التجارية)](brand/)
- [brand.created - إنشاء علامة تجارية](brand/brand.created.md)
- [brand.updated - تحديث العلامة التجارية](brand/brand.updated.md)
- [brand.deleted - حذف العلامة التجارية](brand/brand.deleted.md)

## Authentication & Security (المصادقة والأمان)

### Signature Verification (التحقق من التوقيع)

**English:** Salla uses HMAC SHA256 for webhook signature verification. The signature is sent in the `X-Salla-Signature` header.

**العربية:** تستخدم سالة HMAC SHA256 للتحقق من توقيع Webhook. يتم إرسال التوقيع في الترويسة `X-Salla-Signature`.

### Headers (الترويسات)

| Header (الترويسة) | Description (الوصف) | Example (مثال) |
|-------------------|---------------------|----------------|
| `Content-Type` | نوع البيانات | `application/json` |
| `X-Salla-Signature` | توقيع HMAC للتحقق | `sha256=...` |
| `X-Salla-Event` | نوع الحدث | `order.created` |
| `X-Salla-Delivery` | معرف التسليم الفريد | `unique-delivery-id` |
| `X-Salla-Store-ID` | معرف المتجر | `123456789` |

## Quick Start (البدء السريع)

### PHP Example (مثال PHP)

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
    $event = $_SERVER['HTTP_X_SALLA_EVENT'] ?? '';
    // معالجة الحدث
    http_response_code(200);
    echo json_encode(['received' => true]);
} else {
    http_response_code(403);
    echo 'Invalid signature';
}
```

### JavaScript Example (مثال JavaScript)

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

// Express.js example
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-salla-signature'];
    const secret = process.env.WEBHOOK_SECRET;

    if (verifySallaWebhook(req.body, signature, secret)) {
        const event = req.headers['x-salla-event'];
        // Process webhook
        res.status(200).json({ received: true });
    } else {
        res.status(403).send('Invalid signature');
    }
});
```

## Official Resources (الموارد الرسمية)

| Resource (المورد) | URL |
|-------------------|-----|
| Salla Developer Portal | https://docs.salla.dev |
| Webhooks Overview | https://docs.salla.dev/merchant-api/webhooks |
| List Events | https://docs.salla.dev/merchant-api/webhooks/list-events |
| Developer Support | support@salla.dev |

---

*Last Updated: مارس 2026*
*آخر تحديث: مارس 2026*
