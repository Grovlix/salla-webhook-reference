---
title: abandoned.cart.status.changed webhook
description: "Salla abandoned.cart.status.changed webhook: Triggered when an abandoned cart's status changes."
---

# `abandoned.cart.status.changed`

Triggered when an abandoned cart's status changes.

<p dir="rtl" lang="ar">يُرسل عند تغيّر حالة سلة متروكة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Abandoned cart and coupon](./index.md) |
| Payload model | Abandoned Cart Status Changed Webhook Event Model |
| JSON Schema | [`schemas/salla/abandoned.cart.status.changed.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/abandoned.cart.status.changed.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/carts](https://docs.salla.dev/webhook-events/carts) |

::: info Note
Documented on Salla's cart events page but not in the main events table.
:::

## Example payload

```json
{
  "event": "abandoned.cart.status.changed",
  "merchant": 935918575,
  "created_at": "Tue Mar 25 2025 11:59:37 GMT+0300",
  "data": {
    "id": 1305879817,
    "status": "purchased"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `abandoned.cart.status.changed`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Event Created at Timestamp |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | A unique identifier associated with a shopping cart. |
| `status` | string | Abandoned Cart Status, which can be one of the allowed enum values One of: `active`, `purchased`. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/carts), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=abandoned.cart.status.changed).
