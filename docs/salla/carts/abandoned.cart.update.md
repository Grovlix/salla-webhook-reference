---
title: abandoned.cart.update webhook
description: "Salla abandoned.cart.update webhook: Triggered when an abandoned cart is updated."
---

# `abandoned.cart.update`

Triggered when an abandoned cart is updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث سلة متروكة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Abandoned cart and coupon](./index.md) |
| Payload model | Abandoned Cart Webhook Event Model (shared with [`abandoned.cart`](./abandoned.cart.md)) |
| JSON Schema | [`schemas/salla/abandoned.cart.update.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/abandoned.cart.update.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/carts](https://docs.salla.dev/webhook-events/carts) |

::: info Note
Listed in the `event` enum of Salla's abandoned cart schema but not in the main events table.
:::

## Example payload

Salla publishes one example for this payload model, shown here for `abandoned.cart`. `abandoned.cart.update` uses the same structure.

```json
{
  "event": "abandoned.cart",
  "merchant": 1305146709,
  "created_at": "Tue Jan 25 2022 13:00:27 GMT+0300",
  "data": {
    "id": 1097962121,
    "total": {
      "amount": 80.5,
      "currency": "SAR"
    },
    "subtotal": {
      "amount": 70,
      "currency": "SAR"
    },
    "total_discount": {
      "amount": 0,
      "currency": "SAR"
    },
    "checkout_url": "https://salla.sa/dev-wofftr4xsra5xtlv/checkout/1097962121",
    "age_in_minutes": 83,
    "created_at": {
      "date": "2022-01-25 11:37:24.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "updated_at": {
      "date": "2022-01-25 11:37:24.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "customer": {
      "id": 225167971,
      "name": "User Name",
      "mobile": "+977612917082",
      "avatar": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
      "country": "السعودية",
      "city": "الرياض"
    },
    "coupon": {
      "id": 2036833834,
      "code": "wizefriend",
      "status": "active",
      "type": "percentage",
      "amount": {
        "amount": 20,
        "currency": "SAR"
      },
      "minimum_amount": {
        "amount": 0,
        "currency": "SAR"
      },
      "expiry_date": "2022-04-13 00:00:00",
      "created_at": {
        "date": "2022-01-24 13:47:47.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      }
    },
    "items": [
      {
        "id": 1793843311,
        "product_id": 401511871,
        "quantity": 2
      }
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `abandoned.cart`, `abandoned.cart.update`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object (AbandonedCartWebhook) |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | number | A unique identifier associated with a shopping cart. |
| `total` * | object | The sum of the prices of all the items in a cart. |
| `subtotal` * | object | The sub-total cost of items in a shopping cart. |
| `total_discount` * | object | Cumulative reduction in price applied to the items in a cart. |
| `checkout_url` * | string | A web link or address that directs a user to a specific page or interface where they can proceed with the final steps of a purchase or transaction. |
| `age_in_minutes` * | number | The age of cart, aka the time difference between cart's `created_at` and time now in minutes. |
| `created_at` * | object |  |
| `updated_at` * | object |  |
| `customer` * | object |  |
| `coupon` * | object |  |
| `items` * | array of object |  |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/carts), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=abandoned.cart.update).
