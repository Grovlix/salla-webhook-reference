---
title: product.status.updated webhook
description: "Salla product.status.updated webhook: Triggered when a product's status changes."
---

# `product.status.updated`

Triggered when a product's status changes.

<p dir="rtl" lang="ar">يُرسل عند تغيير حالة منتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Status Updated Webhook Events Model |
| JSON Schema | [`schemas/salla/product.status.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.status.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

## Example payload

```json
{
  "event": "product.status.updated",
  "merchant": 546096831,
  "created_at": "Mon Nov 17 2025 15:32:59 GMT+0300",
  "data": {
    "id": 799860060,
    "sku": "SKU122",
    "mpn": "MPN-093",
    "gtin": "88840002",
    "status": "hidden"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event Name One of: `product.status.updated`. |
| `merchant` * | number | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` * | string | Timestamp of the created Event |
| `data` * | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | integer | Unique identifier associated with a product. Get a list of product IDs [here](https://docs.salla.dev/5394169e0) |
| `sku` * | string | Stock Keeping Unit |
| `mpn` * | string | Manufacturer Part Number |
| `gtin` * | string | Global Trade Item Number |
| `status` * | string | Current product status One of: `hidden`, `out`, `sale`, `deleted`. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.status.updated).
