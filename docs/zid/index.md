---
title: Zid webhook events
---

# Zid webhook events

<p dir="rtl" lang="ar">جميع أحداث الويب هوك في زد</p>

28 events, taken from Zid's [official documentation](https://docs.zid.sa/webhooks). Each page shows the official example payload, the field list from Zid's schema, and a JSON Schema you can validate against.

## Order | الطلبات

| Event | Description | الوصف |
| --- | --- | --- |
| [`order.create`](./orders/order.create.md) | Triggered when a new order is created. | يُرسل عند إنشاء طلب جديد. |
| [`order.status.update`](./orders/order.status.update.md) | Triggered when an order's status is updated. | يُرسل عند تحديث حالة الطلب. |
| [`order.payment_status.update`](./orders/order.payment_status.update.md) | Triggered when an order's payment status changes to `paid` or `unpaid`. `unpaid` covers `pending`, `refunded` and `voided`. | يُرسل عند تغيّر حالة الدفع إلى `paid` أو `unpaid`، وتشمل `unpaid` الحالات `pending` و`refunded` و`voided`. |

## Product | المنتجات

| Event | Description | الوصف |
| --- | --- | --- |
| [`product.create`](./products/product.create.md) | Triggered when a new product is created. | يُرسل عند إضافة منتج جديد. |
| [`product.update`](./products/product.update.md) | Triggered when a product's details are updated. | يُرسل عند تحديث بيانات منتج. |
| [`product.publish`](./products/product.publish.md) | Triggered when a product is published. | يُرسل عند نشر منتج. |
| [`product.delete`](./products/product.delete.md) | Triggered when a product is deleted. | يُرسل عند حذف منتج. |

## Abandoned cart | السلات المتروكة

| Event | Description | الوصف |
| --- | --- | --- |
| [`abandoned_cart.created`](./abandoned-carts/abandoned_cart.created.md) | Triggered when a shopping cart is abandoned. | يُرسل عند ترك العميل سلة التسوق دون إتمام الشراء. |
| [`abandoned_cart.completed`](./abandoned-carts/abandoned_cart.completed.md) | Triggered when an abandoned cart is completed. | يُرسل عند إتمام شراء سلة متروكة. |

## Customer | العملاء

| Event | Description | الوصف |
| --- | --- | --- |
| [`customer.create`](./customers/customer.create.md) | Triggered when a new customer account is created. | يُرسل عند إنشاء حساب عميل جديد. |
| [`customer.update`](./customers/customer.update.md) | Triggered when a customer's details are updated. | يُرسل عند تحديث بيانات عميل. |
| [`customer.merchant.update`](./customers/customer.merchant.update.md) | Triggered when the merchant updates details related to a customer. | يُرسل عندما يعدّل التاجر بيانات متعلقة بالعميل. |
| [`customer.login`](./customers/customer.login.md) | Triggered when a customer logs in. | يُرسل عند تسجيل دخول العميل. |

## Product category | التصنيفات

| Event | Description | الوصف |
| --- | --- | --- |
| [`category.create`](./categories/category.create.md) | Triggered when a new category is created. | يُرسل عند إنشاء تصنيف. |
| [`category.update`](./categories/category.update.md) | Triggered when a category's details are updated. | يُرسل عند تحديث تصنيف. |
| [`category.delete`](./categories/category.delete.md) | Triggered when a category is deleted. | يُرسل عند حذف تصنيف. |

## App and subscription | التطبيق والاشتراكات

| Event | Description | الوصف |
| --- | --- | --- |
| [`app.market.application.authorized`](./app/app.market.application.authorized.md) | Triggered when a merchant grants your app its permissions, before installing. | يُرسل عندما يمنح التاجر تطبيقك الصلاحيات قبل التثبيت. |
| [`app.market.application.install`](./app/app.market.application.install.md) | Triggered when a merchant installs your app. | يُرسل عند تثبيت التاجر لتطبيقك. |
| [`app.market.application.uninstall`](./app/app.market.application.uninstall.md) | Triggered when a merchant removes your app. Zid revokes your tokens for that store at the same time, so this is the only reliable uninstall signal. | يُرسل عند إزالة التاجر لتطبيقك. تلغي زد رموز الوصول لهذا المتجر في الوقت نفسه، لذا هذا الحدث هو الطريقة الموثوقة الوحيدة لمعرفة الإزالة. |
| [`app.market.application.rated`](./app/app.market.application.rated.md) | Triggered when a merchant rates or reviews your app. | يُرسل عند تقييم التاجر لتطبيقك أو كتابة مراجعة. |
| [`app.market.private.plan.request`](./app/app.market.private.plan.request.md) | Triggered when a merchant requests a private plan. | يُرسل عند طلب التاجر خطة خاصة. |
| [`app.market.subscription.active`](./app/app.market.subscription.active.md) | Triggered when a subscription becomes active after payment. | يُرسل عند تفعيل الاشتراك بعد الدفع. |
| [`app.market.subscription.warning`](./app/app.market.subscription.warning.md) | Triggered 3 days before a recurring subscription ends, or 30 days after a usage-based charge is left unpaid. | يُرسل قبل انتهاء الاشتراك الدوري بثلاثة أيام، أو بعد 30 يومًا من بقاء رسوم الاستخدام دون دفع. |
| [`app.market.subscription.suspended`](./app/app.market.subscription.suspended.md) | Triggered 1 day after a recurring subscription ends. | يُرسل بعد يوم واحد من انتهاء الاشتراك الدوري. |
| [`app.market.subscription.expired`](./app/app.market.subscription.expired.md) | Triggered 5 days after a recurring subscription ends, or 30 days after a usage-based charge became overdue. | يُرسل بعد 5 أيام من انتهاء الاشتراك الدوري، أو بعد 30 يومًا من تأخر دفع رسوم الاستخدام. |
| [`app.market.subscription.renew`](./app/app.market.subscription.renew.md) | Triggered after a renewal or extension completes. Also fires on free-plan renewal, when a paused subscription resumes, and when a usage-based charge is paid. | يُرسل بعد اكتمال التجديد أو التمديد، وكذلك عند تجديد الخطة المجانية واستئناف الاشتراك المتوقف ودفع رسوم الاستخدام. |
| [`app.market.subscription.upgrade`](./app/app.market.subscription.upgrade.md) | Triggered when a merchant moves to a different plan. | يُرسل عند انتقال التاجر إلى خطة أخرى. |
| [`app.market.subscription.refunded`](./app/app.market.subscription.refunded.md) | Triggered when a payment is refunded to the merchant. | يُرسل عند استرداد مبلغ مدفوع للتاجر. |
