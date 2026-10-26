---
title: abandoned.cart.purchased webhook
description: "Salla abandoned.cart.purchased webhook: Triggered when an abandoned cart is purchased (status set to `purchased`)."
---

# `abandoned.cart.purchased`

Triggered when an abandoned cart is purchased (status set to `purchased`).

<p dir="rtl" lang="ar">يُرسل عند إتمام شراء سلة متروكة (تصبح حالتها `purchased`).</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Abandoned cart and coupon](./index.md) |
| Payload model | Abandoned Cart Purchased Webhook Event Model |
| JSON Schema | [`schemas/salla/abandoned.cart.purchased.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/abandoned.cart.purchased.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/carts](https://docs.salla.dev/webhook-events/carts) |

::: info Note
Documented on Salla's cart events page but not in the main events table.
:::

## Example payload

```json
{
  "event": "abandoned.cart.purchased",
  "merchant": 935918575,
  "created_at": "Tue Mar 25 2025 11:59:37 GMT+0300",
  "data": {
    "id": 1305879817,
    "status": "purchased",
    "currency": "SAR",
    "total": 34.99,
    "subtotal": 30.43,
    "total_discount": 0
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `abandoned.cart.purchased`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Event Created at Timestamp |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | A unique identifier associated with a shopping cart. |
| `total` | number | The sum of the prices of all the items in a cart. |
| `subtotal` | number | The sub-total cost of items in a cart. |
| `total_discount` | number | Cumulative reduction in price applied to the items in a cart. |
| `status` | string | Abandoned Cart Status, which can be one of the allowed enum values One of: `active`, `purchased`. |
| `currency` | string | Abandoned Cart Currency value |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/carts), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=abandoned.cart.purchased).
