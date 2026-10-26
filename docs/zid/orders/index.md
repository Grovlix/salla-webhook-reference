---
title: Zid order webhooks
---

# Zid: Order events

<p dir="rtl" lang="ar">أحداث الطلبات في زد</p>

`order.create` and `order.status.update` support subscription conditions on `status`, `payment_method` and `delivery_option_id`. See [Subscribing](/guides/getting-started#zid).

<p dir="rtl" lang="ar">يدعم الحدثان `order.create` و`order.status.update` شروط اشتراك على `status` و`payment_method` و`delivery_option_id`.</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`order.create`](./order.create.md) | Triggered when a new order is created. | يُرسل عند إنشاء طلب جديد. |
| [`order.status.update`](./order.status.update.md) | Triggered when an order's status is updated. | يُرسل عند تحديث حالة الطلب. |
| [`order.payment_status.update`](./order.payment_status.update.md) | Triggered when an order's payment status changes to `paid` or `unpaid`. `unpaid` covers `pending`, `refunded` and `voided`. | يُرسل عند تغيّر حالة الدفع إلى `paid` أو `unpaid`، وتشمل `unpaid` الحالات `pending` و`refunded` و`voided`. |

Official page: [docs.zid.sa/webhook-events-order](https://docs.zid.sa/webhook-events-order)
