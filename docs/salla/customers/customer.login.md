---
title: customer.login webhook
description: "Salla customer.login webhook: Triggered when a customer logs in to their account."
---

# `customer.login`

Triggered when a customer logs in to their account.

<p dir="rtl" lang="ar">يُرسل عند تسجيل دخول العميل إلى حسابه.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Customer](./index.md) |
| Payload model | Customer Webhook Events Model (shared with [`customer.created`](./customer.created.md), [`customer.updated`](./customer.updated.md)) |
| JSON Schema | [`schemas/salla/customer.login.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/customer.login.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/customers](https://docs.salla.dev/webhook-events/customers) |

## Example payload

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
    },
    "groups": [],
    "source": {
      "device": "desktop",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      "ip": "127.0.0.1"
    },
    "is_notifications_enabled": true
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

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/customers), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=customer.login).
