---
title: storetax.created webhook
description: "Salla storetax.created webhook: Triggered when a store tax is created."
---

# `storetax.created`

Triggered when a store tax is created.

<p dir="rtl" lang="ar">يُرسل عند إنشاء ضريبة للمتجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Store](./index.md) |
| Payload model | Store Tax Webhook Event Model |
| JSON Schema | [`schemas/salla/storetax.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/storetax.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/store](https://docs.salla.dev/webhook-events/store) |

## Example payload

```json
{
  "event": "storetax.created",
  "merchant": 814202285,
  "created_at": "Tue Aug 03 2021 09:35:16 GMT+0300",
  "data": {
    "id": 5541564,
    "tax": "5",
    "status": "active",
    "country": "All Countries"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | A label or title used to identify a specific event One of: `storetax.created`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | The date and time when a particular Webhook was created or initiated. |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | A unique identifier assigned to a specific store. |
| `tax` | string | Tax amount value. |
| `status` | string | The condition or classification of an entity or transaction with respect to taxation. |
| `country` | string | The specific country or jurisdiction where taxes are levied, collected, and regulated in relation to a particular entity or transaction |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/store), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=storetax.created).
