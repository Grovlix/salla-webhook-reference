---
title: Salla webhook events
---

# Salla webhook events

<p dir="rtl" lang="ar">جميع أحداث الويب هوك في سلة</p>

81 events, taken from Salla's [official documentation](https://docs.salla.dev/doc-421119). Each page shows the official example payload, the field list from Salla's schema, and a JSON Schema you can validate against.

## Order | الطلبات

| Event | Description | الوصف |
| --- | --- | --- |
| [`order.created`](./orders/order.created.md) | Triggered when an order is created. | يُرسل عند إنشاء طلب جديد. |
| [`order.updated`](./orders/order.updated.md) | Triggered when an order is updated. | يُرسل عند تحديث بيانات طلب. |
| [`order.status.updated`](./orders/order.status.updated.md) | Triggered when an order's status changes. | يُرسل عند تغيّر حالة الطلب. |
| [`order.cancelled`](./orders/order.cancelled.md) | Triggered when an order is cancelled. | يُرسل عند إلغاء طلب. |
| [`order.refunded`](./orders/order.refunded.md) | Triggered when an order is refunded. | يُرسل عند استرداد مبلغ الطلب. |
| [`order.deleted`](./orders/order.deleted.md) | Triggered when an order is deleted. | يُرسل عند حذف طلب. |
| [`order.products.updated`](./orders/order.products.updated.md) | Triggered when the products in an order are updated. | يُرسل عند تعديل منتجات الطلب. |
| [`order.payment.updated`](./orders/order.payment.updated.md) | Triggered when an order's payment is updated. | يُرسل عند تحديث بيانات الدفع للطلب. |
| [`order.coupon.updated`](./orders/order.coupon.updated.md) | Triggered when the coupon on an order is updated. | يُرسل عند تعديل الكوبون المطبّق على الطلب. |
| [`order.total.price.updated`](./orders/order.total.price.updated.md) | Triggered when an order's total price is updated. | يُرسل عند تغيّر إجمالي سعر الطلب. |
| [`order.shipping.address.updated`](./orders/order.shipping.address.updated.md) | Triggered when an order's shipping address is updated. | يُرسل عند تعديل عنوان الشحن للطلب. |
| [`order.customer.updated`](./orders/order.customer.updated.md) | Triggered when the customer on an order is updated. | يُرسل عند تعديل بيانات العميل في الطلب. |
| [`order.shipment.creating`](./orders/order.shipment.creating.md) | Triggered while an order shipment is being created. | يُرسل أثناء إنشاء شحنة للطلب. |
| [`order.shipment.created`](./orders/order.shipment.created.md) | Triggered when an order shipment is created. | يُرسل بعد إنشاء شحنة للطلب. |
| [`order.shipment.cancelled`](./orders/order.shipment.cancelled.md) | Triggered when an order shipment is cancelled. | يُرسل عند إلغاء شحنة الطلب. |
| [`order.shipment.return.creating`](./orders/order.shipment.return.creating.md) | Triggered while an order return shipment is being created. | يُرسل أثناء إنشاء شحنة إرجاع للطلب. |
| [`order.shipment.return.created`](./orders/order.shipment.return.created.md) | Triggered when an order return shipment is created. | يُرسل بعد إنشاء شحنة إرجاع للطلب. |
| [`order.shipment.return.cancelled`](./orders/order.shipment.return.cancelled.md) | Triggered when an order return shipment is cancelled. | يُرسل عند إلغاء شحنة إرجاع الطلب. |

## Product | المنتجات

| Event | Description | الوصف |
| --- | --- | --- |
| [`product.created`](./products/product.created.md) | Triggered when a product is created. | يُرسل عند إضافة منتج جديد. |
| [`product.updated`](./products/product.updated.md) (deprecated) | Triggered when a product is updated. | يُرسل عند تحديث منتج. |
| [`product.deleted`](./products/product.deleted.md) | Triggered when a product is deleted. | يُرسل عند حذف منتج. |
| [`product.available`](./products/product.available.md) (deprecated) | Triggered when a product comes back in stock. | يُرسل عند توفّر المنتج في المخزون من جديد. |
| [`product.quantity.low`](./products/product.quantity.low.md) | Triggered when a product's stock is low. | يُرسل عند انخفاض كمية المنتج في المخزون. |
| [`product.price.updated`](./products/product.price.updated.md) | Triggered when a product's price is updated. | يُرسل عند تغيير سعر منتج. |
| [`product.status.updated`](./products/product.status.updated.md) | Triggered when a product's status changes. | يُرسل عند تغيير حالة منتج. |
| [`product.image.updated`](./products/product.image.updated.md) | Triggered when a product's images are updated. | يُرسل عند تحديث صور منتج. |
| [`product.category.updated`](./products/product.category.updated.md) | Triggered when a product's categories are updated. | يُرسل عند تغيير تصنيفات منتج. |
| [`product.brand.updated`](./products/product.brand.updated.md) | Triggered when a product's brand is updated. | يُرسل عند تغيير ماركة منتج. |
| [`product.tags.updated`](./products/product.tags.updated.md) | Triggered when a product's tags are updated. | يُرسل عند تحديث وسوم منتج. |
| [`product.channels.changed`](./products/product.channels.changed.md) | Triggered when the sales channels a product is shown on change. | يُرسل عند تغيير قنوات البيع التي يظهر فيها المنتج. |

## Shipment | الشحنات

| Event | Description | الوصف |
| --- | --- | --- |
| [`shipment.creating`](./shipments/shipment.creating.md) | Triggered when a shipment is assigned to a shipping company. | يُرسل عند إسناد شحنة إلى شركة شحن. |
| [`shipment.created`](./shipments/shipment.created.md) | Triggered when the shipping company updates a shipment for the first time. | يُرسل عندما تحدّث شركة الشحن الشحنة لأول مرة. |
| [`shipment.updated`](./shipments/shipment.updated.md) | Triggered when a shipment is updated after creation. | يُرسل عند تحديث الشحنة بعد إنشائها. |
| [`shipment.cancelled`](./shipments/shipment.cancelled.md) | Triggered when a shipment is cancelled. | يُرسل عند إلغاء شحنة. |

## Shipping company and zone | شركات ومناطق الشحن

| Event | Description | الوصف |
| --- | --- | --- |
| [`shipping.zone.created`](./shipping/shipping.zone.created.md) | Triggered when a shipping zone is created for a custom shipping company. | يُرسل عند إنشاء منطقة شحن لشركة شحن مخصّصة. |
| [`shipping.zone.updated`](./shipping/shipping.zone.updated.md) | Triggered when a shipping zone is updated for a custom shipping company. | يُرسل عند تحديث منطقة شحن لشركة شحن مخصّصة. |
| [`shipping.company.created`](./shipping/shipping.company.created.md) | Triggered when a custom shipping company is created. | يُرسل عند إنشاء شركة شحن مخصّصة. |
| [`shipping.company.updated`](./shipping/shipping.company.updated.md) | Triggered when a custom shipping company is updated. | يُرسل عند تحديث شركة شحن مخصّصة. |
| [`shipping.company.deleted`](./shipping/shipping.company.deleted.md) | Triggered when a custom shipping company is deleted. | يُرسل عند حذف شركة شحن مخصّصة. |

## Customer | العملاء

| Event | Description | الوصف |
| --- | --- | --- |
| [`customer.created`](./customers/customer.created.md) | Triggered when a customer is created. | يُرسل عند تسجيل عميل جديد. |
| [`customer.updated`](./customers/customer.updated.md) | Triggered when a customer is updated. | يُرسل عند تحديث بيانات عميل. |
| [`customer.login`](./customers/customer.login.md) | Triggered when a customer logs in to their account. | يُرسل عند تسجيل دخول العميل إلى حسابه. |
| [`customer.otp.request`](./customers/customer.otp.request.md) | Triggered when a customer requests a one-time password. | يُرسل عند طلب العميل رمز تحقق لمرة واحدة (OTP). |

## Category | التصنيفات

| Event | Description | الوصف |
| --- | --- | --- |
| [`category.created`](./categories/category.created.md) | Triggered when a category is created. | يُرسل عند إنشاء تصنيف. |
| [`category.updated`](./categories/category.updated.md) | Triggered when a category is updated. | يُرسل عند تحديث تصنيف. |

## Brand | الماركات

| Event | Description | الوصف |
| --- | --- | --- |
| [`brand.created`](./brands/brand.created.md) | Triggered when a brand is created. | يُرسل عند إنشاء ماركة. |
| [`brand.updated`](./brands/brand.updated.md) | Triggered when a brand is updated. | يُرسل عند تحديث ماركة. |
| [`brand.deleted`](./brands/brand.deleted.md) | Triggered when a brand is deleted. | يُرسل عند حذف ماركة. |

## Store | المتجر

| Event | Description | الوصف |
| --- | --- | --- |
| [`store.branch.created`](./store/store.branch.created.md) | Triggered when a store branch is created. | يُرسل عند إنشاء فرع للمتجر. |
| [`store.branch.updated`](./store/store.branch.updated.md) | Triggered when a store branch is updated. | يُرسل عند تحديث فرع للمتجر. |
| [`store.branch.setDefault`](./store/store.branch.setDefault.md) | Triggered when a store branch is set as the default branch. | يُرسل عند تعيين فرع كفرع افتراضي. |
| [`store.branch.activated`](./store/store.branch.activated.md) | Triggered when a store branch is activated. | يُرسل عند تفعيل فرع للمتجر. |
| [`store.branch.deleted`](./store/store.branch.deleted.md) | Triggered when a store branch is deleted. | يُرسل عند حذف فرع للمتجر. |
| [`storetax.created`](./store/storetax.created.md) | Triggered when a store tax is created. | يُرسل عند إنشاء ضريبة للمتجر. |
| [`store.owner.changed`](./store/store.owner.changed.md) | Triggered when store ownership moves to another user. | يُرسل عند نقل ملكية المتجر إلى مستخدم آخر. |

## Abandoned cart and coupon | السلات المتروكة والكوبونات

| Event | Description | الوصف |
| --- | --- | --- |
| [`abandoned.cart`](./carts/abandoned.cart.md) | Triggered when an abandoned cart is created. | يُرسل عند ظهور سلة متروكة. |
| [`abandoned.cart.update`](./carts/abandoned.cart.update.md) | Triggered when an abandoned cart is updated. | يُرسل عند تحديث سلة متروكة. |
| [`abandoned.cart.status.changed`](./carts/abandoned.cart.status.changed.md) | Triggered when an abandoned cart's status changes. | يُرسل عند تغيّر حالة سلة متروكة. |
| [`abandoned.cart.purchased`](./carts/abandoned.cart.purchased.md) | Triggered when an abandoned cart is purchased (status set to `purchased`). | يُرسل عند إتمام شراء سلة متروكة (تصبح حالتها `purchased`). |
| [`coupon.applied`](./carts/coupon.applied.md) | Triggered when a coupon is applied. | يُرسل عند تطبيق كوبون خصم. |

## Invoice | الفواتير

| Event | Description | الوصف |
| --- | --- | --- |
| [`invoice.created`](./invoices/invoice.created.md) | Triggered when an order's status becomes `completed` or `restored`. | يُرسل عندما تصبح حالة الطلب `completed` أو `restored`. |

## Special offer | العروض الخاصة

| Event | Description | الوصف |
| --- | --- | --- |
| [`specialoffer.created`](./special-offers/specialoffer.created.md) | Triggered when a special offer is created. | يُرسل عند إنشاء عرض خاص. |
| [`specialoffer.updated`](./special-offers/specialoffer.updated.md) | Triggered when a special offer is updated. | يُرسل عند تحديث عرض خاص. |

## Review | التقييمات

| Event | Description | الوصف |
| --- | --- | --- |
| [`review.added`](./reviews/review.added.md) | Triggered when a product review is added. | يُرسل عند إضافة تقييم لمنتج. |

## Customer wallet | محفظة العميل

| Event | Description | الوصف |
| --- | --- | --- |
| [`wallet.action`](./customer-wallet/wallet.action.md) | Triggered when a customer wallet transaction is made. | يُرسل عند تنفيذ عملية على محفظة العميل. |

## Communication apps | تطبيقات التواصل

| Event | Description | الوصف |
| --- | --- | --- |
| [`communication.sms.send`](./communication/communication.sms.send.md) | Triggered when the store sends an SMS message. | يُرسل عندما يرسل المتجر رسالة SMS. |
| [`communication.email.send`](./communication/communication.email.send.md) | Triggered when the store sends an email. | يُرسل عندما يرسل المتجر بريدًا إلكترونيًا. |
| [`communication.whatsapp.send`](./communication/communication.whatsapp.send.md) | Triggered when the store sends a WhatsApp message. | يُرسل عندما يرسل المتجر رسالة واتساب. |

## App and subscription | التطبيق والاشتراكات

| Event | Description | الوصف |
| --- | --- | --- |
| [`app.store.authorize`](./app/app.store.authorize.md) | Triggered when a store authorizes your app's scopes. The payload carries the store's access and refresh tokens. | يُرسل عندما يمنح المتجر تطبيقك الصلاحيات، ويحمل رمزي الوصول والتحديث الخاصين بالمتجر. |
| [`app.installed`](./app/app.installed.md) | Triggered when your app is installed on a store. | يُرسل عند تثبيت تطبيقك في متجر. |
| [`app.updated`](./app/app.updated.md) | Triggered when your app is updated. | يُرسل عند تحديث تطبيقك. |
| [`app.uninstalled`](./app/app.uninstalled.md) | Triggered when your app is uninstalled from a store. | يُرسل عند إزالة تطبيقك من متجر. |
| [`app.trial.started`](./app/app.trial.started.md) | Triggered when a store starts a trial of your app. | يُرسل عند بدء فترة تجريبية لتطبيقك في متجر. |
| [`app.trial.expired`](./app/app.trial.expired.md) | Triggered when a store's trial of your app expires. | يُرسل عند انتهاء الفترة التجريبية لتطبيقك في متجر. |
| [`app.trial.canceled`](./app/app.trial.canceled.md) | Triggered when a store's trial of your app is cancelled. | يُرسل عند إلغاء الفترة التجريبية لتطبيقك في متجر. |
| [`app.subscription.started`](./app/app.subscription.started.md) | Triggered when a subscription to your app or one of its add-ons starts. | يُرسل عند بدء اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.subscription.expired`](./app/app.subscription.expired.md) | Triggered when a subscription to your app or one of its add-ons ends. | يُرسل عند انتهاء اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.subscription.canceled`](./app/app.subscription.canceled.md) | Triggered when a subscription to your app or one of its add-ons is cancelled. | يُرسل عند إلغاء اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.subscription.renewed`](./app/app.subscription.renewed.md) | Triggered when a subscription to your app or one of its add-ons is renewed. | يُرسل عند تجديد اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.feedback.created`](./app/app.feedback.created.md) | Triggered when a merchant leaves feedback on your app. | يُرسل عندما يضيف التاجر ملاحظة أو تقييمًا لتطبيقك. |
| [`app.settings.updated`](./app/app.settings.updated.md) | Triggered when a merchant activates or updates your app's settings. | يُرسل عندما يفعّل التاجر إعدادات تطبيقك أو يعدّلها. |
