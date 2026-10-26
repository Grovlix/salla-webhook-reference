---
title: product.channels.changed webhook
description: "Salla product.channels.changed webhook: Triggered when the sales channels a product is shown on change."
---

# `product.channels.changed`

Triggered when the sales channels a product is shown on change.

<p dir="rtl" lang="ar">يُرسل عند تغيير قنوات البيع التي يظهر فيها المنتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Products Channel Changed Webhook Event Model |
| JSON Schema | [`schemas/salla/product.channels.changed.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.channels.changed.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

::: info Note
Documented on Salla's product events page but not in the main events table.
:::

## Example payload

```json
{
  "event": "product.channels.changed",
  "merchant": 1328842359,
  "created_at": "Mon Nov 18 2024 13:21:36 GMT+0300",
  "data": {
    "id": 710434693,
    "channels": [
      "app",
      "Vendors"
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `product.channels.changed`. |
| `merchant` | integer | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` | string | Timestamp of the created Event |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | integer | Unique identifier associated with a product. Get a list of product IDs [here](https://docs.salla.dev/5394169e0) |
| `channels` * | array of string | The product to appear in specific channels |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.channels.changed).
