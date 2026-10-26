---
title: customer.updated webhook
description: "Salla customer.updated webhook: Triggered when a customer is updated."
---

# `customer.updated`

Triggered when a customer is updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث بيانات عميل.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Customer](./index.md) |
| Payload model | Customer Webhook Events Model (shared with [`customer.created`](./customer.created.md), [`customer.login`](./customer.login.md)) |
| JSON Schema | [`schemas/salla/customer.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/customer.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/customers](https://docs.salla.dev/webhook-events/customers) |

## Example payload

Salla publishes one example for this payload model, shown here for `customer.login`. `customer.updated` uses the same structure.

```json
{
  "event": "customer.login",
  "merchant": 1305146709,
  "created_at": "Tue Jan 25 2022 12:36:49 GMT+0300",
  "data": {
    "id": 225167971,
    "first_name": "User",
    "last_name": "Mohammed",
    "mobile": 555555555,
    "mobile_code": "+966",
    "email": "test@gmail.com",
    "urls": {
      "customer": "https://salla.sa/dev-wofftr4xsra5xtlv/profile",
      "admin": "https://s.salla.sa/customers/l7mYBdgXA9xJwWZRZK8WD42GNkZbjvRO"
    },
    "avatar": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
    "gender": "female",
    "birthday": {
      "date": "1997-06-03 00:00:00.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "city": "الرياض",
    "country": "السعودية",
    "country_code": "SA",
    "currency": "AED",
    "location": "14",
    "updated_at": {
      "date": "2022-01-24 14:26:55.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `customer.created`, `customer.updated`, `customer.login`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of the created Event |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `source` | object | Customer source information |
| `is_notifications_enabiled` * | boolean | Customer has enabled notifications or not |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/customers), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=customer.updated).
