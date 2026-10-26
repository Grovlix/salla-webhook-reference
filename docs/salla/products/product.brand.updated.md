---
title: product.brand.updated webhook
description: "Salla product.brand.updated webhook: Triggered when a product's brand is updated."
---

# `product.brand.updated`

Triggered when a product's brand is updated.

<p dir="rtl" lang="ar">يُرسل عند تغيير ماركة منتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Brand Updated Webhook Events Model |
| JSON Schema | [`schemas/salla/product.brand.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.brand.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

## Example payload

```json
{
  "event": "product.brand.updated",
  "merchant": 546096831,
  "created_at": "Wed Nov 19 2025 13:47:44 GMT+0300",
  "data": {
    "id": 1234540307,
    "barcode": null,
    "sku": "P-7337",
    "mpn": "PP8938",
    "gtin": "99987653",
    "brand": {
      "id": 1972405558,
      "name": "Brand1"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event Name One of: `product.brand.updated`. |
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
| `brand` * | object | Brand associated with the product |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.brand.updated).
