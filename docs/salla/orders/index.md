---
title: Salla order webhooks
---

# Salla: Order events

<p dir="rtl" lang="ar">أحداث الطلبات في سلة</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`order.created`](./order.created.md) | Triggered when an order is created. | يُرسل عند إنشاء طلب جديد. |
| [`order.updated`](./order.updated.md) | Triggered when an order is updated. | يُرسل عند تحديث بيانات طلب. |
| [`order.status.updated`](./order.status.updated.md) | Triggered when an order's status changes. | يُرسل عند تغيّر حالة الطلب. |
| [`order.cancelled`](./order.cancelled.md) | Triggered when an order is cancelled. | يُرسل عند إلغاء طلب. |
| [`order.refunded`](./order.refunded.md) | Triggered when an order is refunded. | يُرسل عند استرداد مبلغ الطلب. |
| [`order.deleted`](./order.deleted.md) | Triggered when an order is deleted. | يُرسل عند حذف طلب. |
| [`order.products.updated`](./order.products.updated.md) | Triggered when the products in an order are updated. | يُرسل عند تعديل منتجات الطلب. |
| [`order.payment.updated`](./order.payment.updated.md) | Triggered when an order's payment is updated. | يُرسل عند تحديث بيانات الدفع للطلب. |
| [`order.coupon.updated`](./order.coupon.updated.md) | Triggered when the coupon on an order is updated. | يُرسل عند تعديل الكوبون المطبّق على الطلب. |
| [`order.total.price.updated`](./order.total.price.updated.md) | Triggered when an order's total price is updated. | يُرسل عند تغيّر إجمالي سعر الطلب. |
| [`order.shipping.address.updated`](./order.shipping.address.updated.md) | Triggered when an order's shipping address is updated. | يُرسل عند تعديل عنوان الشحن للطلب. |
| [`order.customer.updated`](./order.customer.updated.md) | Triggered when the customer on an order is updated. | يُرسل عند تعديل بيانات العميل في الطلب. |
| [`order.shipment.creating`](./order.shipment.creating.md) | Triggered while an order shipment is being created. | يُرسل أثناء إنشاء شحنة للطلب. |
| [`order.shipment.created`](./order.shipment.created.md) | Triggered when an order shipment is created. | يُرسل بعد إنشاء شحنة للطلب. |
| [`order.shipment.cancelled`](./order.shipment.cancelled.md) | Triggered when an order shipment is cancelled. | يُرسل عند إلغاء شحنة الطلب. |
| [`order.shipment.return.creating`](./order.shipment.return.creating.md) | Triggered while an order return shipment is being created. | يُرسل أثناء إنشاء شحنة إرجاع للطلب. |
| [`order.shipment.return.created`](./order.shipment.return.created.md) | Triggered when an order return shipment is created. | يُرسل بعد إنشاء شحنة إرجاع للطلب. |
| [`order.shipment.return.cancelled`](./order.shipment.return.cancelled.md) | Triggered when an order return shipment is cancelled. | يُرسل عند إلغاء شحنة إرجاع الطلب. |

Official page: [docs.salla.dev/webhook-events/orders](https://docs.salla.dev/webhook-events/orders)
