---
title: Salla vs Zid webhooks
description: How Salla and Zid webhooks differ in event names, payloads, verification and retries.
---

# Salla vs Zid webhooks

<p dir="rtl" lang="ar">الفروق بين الويب هوك في سلة وزد: أسماء الأحداث، شكل البيانات، التحقق، وإعادة المحاولة.</p>

| | Salla | Zid |
| --- | --- | --- |
| Store events documented | 68 | 16 |
| App and subscription events | 13 | 12 |
| Event naming | Past tense: `order.created`, `product.deleted` | Present tense: `order.create`, `product.delete` |
| Payload | Envelope with `event`, `merchant`, `created_at`, `data` | The resource itself; app events use `event_name` |
| Subscribe to store events | Partners portal, or `POST /admin/v2/webhooks/subscribe` | `POST /v1/managers/webhooks` |
| Filtering | `rule` expressions such as `payment_method = mada` | `conditions` on `status`, `payment_method`, `delivery_option_id` (two order events only) |
| Verification | HMAC-SHA256 signature (default) or token | Optional Basic auth (`username`, `password`) |
| Retries | 3, about 5 minutes apart | 3, after 1, 5 and 15 minutes |
| Failing endpoints | Not documented | Marked degraded, then broken and paused |
| Payload versions | `1` and `2` (default `2`) | One version |

## Equivalent events

| What happened | Salla | Zid |
| --- | --- | --- |
| Order created | [`order.created`](/salla/orders/order.created.md) | [`order.create`](/zid/orders/order.create.md) |
| Order status changed | [`order.status.updated`](/salla/orders/order.status.updated.md) | [`order.status.update`](/zid/orders/order.status.update.md) |
| Payment changed | [`order.payment.updated`](/salla/orders/order.payment.updated.md) | [`order.payment_status.update`](/zid/orders/order.payment_status.update.md) |
| Product created | [`product.created`](/salla/products/product.created.md) | [`product.create`](/zid/products/product.create.md) |
| Product deleted | [`product.deleted`](/salla/products/product.deleted.md) | [`product.delete`](/zid/products/product.delete.md) |
| Cart abandoned | [`abandoned.cart`](/salla/carts/abandoned.cart.md) | [`abandoned_cart.created`](/zid/abandoned-carts/abandoned_cart.created.md) |
| Abandoned cart bought | [`abandoned.cart.purchased`](/salla/carts/abandoned.cart.purchased.md) | [`abandoned_cart.completed`](/zid/abandoned-carts/abandoned_cart.completed.md) |
| Customer created | [`customer.created`](/salla/customers/customer.created.md) | [`customer.create`](/zid/customers/customer.create.md) |
| Customer logged in | [`customer.login`](/salla/customers/customer.login.md) | [`customer.login`](/zid/customers/customer.login.md) |
| Category created | [`category.created`](/salla/categories/category.created.md) | [`category.create`](/zid/categories/category.create.md) |
| App installed | [`app.installed`](/salla/app/app.installed.md) | [`app.market.application.install`](/zid/app/app.market.application.install.md) |
| App uninstalled | [`app.uninstalled`](/salla/app/app.uninstalled.md) | [`app.market.application.uninstall`](/zid/app/app.market.application.uninstall.md) |
| Subscription started | [`app.subscription.started`](/salla/app/app.subscription.started.md) | [`app.market.subscription.active`](/zid/app/app.market.subscription.active.md) |

Zid has no webhook events for shipments, brands, coupons, reviews, invoices or special offers.
