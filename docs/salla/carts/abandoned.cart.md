---
title: abandoned.cart webhook
description: "Salla abandoned.cart webhook: Triggered when an abandoned cart is created."
---

# `abandoned.cart`

Triggered when an abandoned cart is created.

<p dir="rtl" lang="ar">يُرسل عند ظهور سلة متروكة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Abandoned cart and coupon](./index.md) |
| Payload model | Abandoned Cart Webhook Event Model (shared with [`abandoned.cart.update`](./abandoned.cart.update.md)) |
| JSON Schema | [`schemas/salla/abandoned.cart.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/abandoned.cart.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/carts](https://docs.salla.dev/webhook-events/carts) |

## Example payload

```json
{
  "event": "abandoned.cart",
  "merchant": 1305146709,
  "created_at": "Tue Jan 21 2025 18:00:32 GMT+0300",
  "data": {
    "id": 1097962121,
    "total": {
      "amount": 100,
      "currency": "SAR"
    },
    "subtotal": {
      "amount": 60,
      "currency": "SAR"
    },
    "total_discount": {
      "amount": 10,
      "currency": "SAR"
    },
    "checkout_url": "https://salla.sa/dev-wofftr4xsra5xtlv/checkout/1097962121",
    "age_in_minutes": 83,
    "created_at": {
      "date": "2025-01-21 17:09:39.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "updated_at": {
      "date": "2025-01-21 17:09:39.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "customer": {
      "id": 225167971,
      "name": "User Name",
      "mobile": "+977612917082",
      "email": "customer@email.com",
      "avatar": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
      "country": "السعودية",
      "city": "الرياض"
    },
    "coupon": {
      "id": 2036833834,
      "code": "wizefriend",
      "status": "active",
      "type": "percentage",
      "amount": 20,
      "minimum_amount": 0,
      "expiry_date": "2025-04-13 00:00:00",
      "start_date": null,
      "created_at": "Tue Jan 21 2025 17:00:00 GMT+0300",
      "free_shipping": true
    },
    "items": [
      {
        "id": 1793843311,
        "product_id": 401511871,
        "quantity": 2
      },
      {
        "id": 239847784,
        "product_id": 64738276,
        "quantity": 1
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

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/carts), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=abandoned.cart).
