---
title: Salla abandoned cart and coupon webhooks
---

# Salla: Abandoned cart and coupon events

<p dir="rtl" lang="ar">أحداث السلات المتروكة والكوبونات في سلة</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`abandoned.cart`](./abandoned.cart.md) | Triggered when an abandoned cart is created. | يُرسل عند ظهور سلة متروكة. |
| [`abandoned.cart.update`](./abandoned.cart.update.md) | Triggered when an abandoned cart is updated. | يُرسل عند تحديث سلة متروكة. |
| [`abandoned.cart.status.changed`](./abandoned.cart.status.changed.md) | Triggered when an abandoned cart's status changes. | يُرسل عند تغيّر حالة سلة متروكة. |
| [`abandoned.cart.purchased`](./abandoned.cart.purchased.md) | Triggered when an abandoned cart is purchased (status set to `purchased`). | يُرسل عند إتمام شراء سلة متروكة (تصبح حالتها `purchased`). |
| [`coupon.applied`](./coupon.applied.md) | Triggered when a coupon is applied. | يُرسل عند تطبيق كوبون خصم. |

Official page: [docs.salla.dev/webhook-events/carts](https://docs.salla.dev/webhook-events/carts)
