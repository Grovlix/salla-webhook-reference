---
title: coupon.applied webhook
description: "Salla coupon.applied webhook: Triggered when a coupon is applied."
---

# `coupon.applied`

Triggered when a coupon is applied.

<p dir="rtl" lang="ar">يُرسل عند تطبيق كوبون خصم.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Abandoned cart and coupon](./index.md) |
| Payload model | Coupon Applied Webhook Event Model |
| JSON Schema | [`schemas/salla/coupon.applied.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/coupon.applied.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/carts](https://docs.salla.dev/webhook-events/carts) |

## Example payload

```json
{
  "event": "coupon.applied",
  "merchant": 847769313,
  "created_at": "Wed Jan 26 2022 22:38:30 GMT+0300",
  "data": {
    "cart": {
      "id": 746780865,
      "total": {
        "amount": 2910,
        "currency": "SAR"
      },
      "subtotal": {
        "amount": 3000,
        "currency": "SAR"
      },
      "total_discount": {
        "amount": 100,
        "currency": "SAR"
      },
      "checkout_url": "https://robbama.com/checkout/746780865",
      "age_in_minutes": 3517,
      "created_at": {
        "date": "2022-01-24 12:01:24.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      },
      "updated_at": {
        "date": "2022-01-26 22:38:30.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      },
      "customer": {
        "id": 1448307086,
        "name": "Nabil Mohammed",
        "mobile": "+251944130250",
        "avatar": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
        "country": "السعودية",
        "city": "جدة"
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
          "id": 2093591642,
          "product_id": 91502809,
          "quantity": 2
        }
      ]
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | A label or title used to identify a specific event. One of: `coupon.applied`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | The date and time when a particular event was created or initiated. |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `cart` | object |  |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/carts), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=coupon.applied).
