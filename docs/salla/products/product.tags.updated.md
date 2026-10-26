---
title: product.tags.updated webhook
description: "Salla product.tags.updated webhook: Triggered when a product's tags are updated."
---

# `product.tags.updated`

Triggered when a product's tags are updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث وسوم منتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Tags Updated Webhook Events Model |
| JSON Schema | [`schemas/salla/product.tags.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.tags.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

## Example payload

```json
{
  "event": "product.tags.updated",
  "merchant": 546096831,
  "created_at": "Wed Nov 19 2025 13:53:50 GMT+0300",
  "data": {
    "id": 1234540307,
    "barcode": null,
    "sku": "P-7337",
    "mpn": "PP8938",
    "gtin": "99987653",
    "tags": [
      {
        "id": 1133150248,
        "name": "tag1"
      },
      {
        "id": 1866255914,
        "name": "tag2"
      }
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event Name One of: `product.tags.updated`. |
| `merchant` * | number | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` * | string | Timestamp of the created Event |
| `data` * | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | integer | Unique identifier associated with Parent product. Get a list of products IDs [here](https://docs.salla.dev/5394168e0) |
| `barcode` * | string | Product barcode |
| `sku` * | string | Stock Keeping Unit |
| `mpn` * | string | Manufacturer Part Number |
| `gtin` * | string | Global Trade Item Number |
| `tags` * | array of object | List of tags assigned to the product. Get a list of tags [here](https://docs.salla.dev/5394180e0) |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.tags.updated).
