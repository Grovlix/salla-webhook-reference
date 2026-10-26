---
title: shipping.company.created webhook
description: "Salla shipping.company.created webhook: Triggered when a custom shipping company is created."
---

# `shipping.company.created`

Triggered when a custom shipping company is created.

<p dir="rtl" lang="ar">يُرسل عند إنشاء شركة شحن مخصّصة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Shipping company and zone](./index.md) |
| Payload model | Shipping Company Webhook Model (shared with [`shipping.company.updated`](./shipping.company.updated.md), [`shipping.company.deleted`](./shipping.company.deleted.md)) |
| JSON Schema | [`schemas/salla/shipping.company.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/shipping.company.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/shippings](https://docs.salla.dev/webhook-events/shippings) |

## Example payload

Salla publishes one example for this payload model, shown here for `shipping.company.deleted`. `shipping.company.created` uses the same structure.

```json
{
  "event": "shipping.company.deleted",
  "merchant": 1305146709,
  "created_at": "Thu Apr 07 2022 13:48:22 GMT+0300",
  "data": {
    "id": 488260393,
    "name": "شركة سريع",
    "status": false
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `shipping.company.created`, `shipping.company.updated`, `shipping.company.deleted`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Shipping Company ID |
| `name` | string | Shipping Company Name |
| `status` | boolean | Shipping Company Status |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/shippings), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=shipping.company.created).
