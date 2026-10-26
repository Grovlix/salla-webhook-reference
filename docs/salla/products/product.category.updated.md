---
title: product.category.updated webhook
description: "Salla product.category.updated webhook: Triggered when a product's categories are updated."
---

# `product.category.updated`

Triggered when a product's categories are updated.

<p dir="rtl" lang="ar">يُرسل عند تغيير تصنيفات منتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Category Updated Webhook Events Model |
| JSON Schema | [`schemas/salla/product.category.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.category.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

## Example payload

```json
{
  "event": "product.category.updated",
  "merchant": 546096831,
  "created_at": "Wed Nov 19 2025 13:45:17 GMT+0300",
  "data": {
    "id": 1234540307,
    "barcode": null,
    "sku": "P-7337",
    "mpn": "PP8938",
    "gtin": "99987653",
    "categories": [
      {
        "id": 601049212,
        "name": "العطور"
      }
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event Name One of: `product.category.updated`. |
| `merchant` * | number | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` * | string | Timestamp of the created Event |
| `data` * | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | integer | Unique identifier associated with a product. Get a list of products IDs [here](https://docs.salla.dev/5394168e0) |
| `barcode` * | string | Product barcode |
| `sku` * | string | Stock Keeping Unit (SKU) |
| `mpn` * | string | Manufacturer Part Number |
| `gtin` * | string | Global Trade Item Number |
| `categories` * | array of object | List of categories assigned to the product |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.category.updated).
