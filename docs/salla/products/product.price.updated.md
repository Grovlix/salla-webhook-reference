---
title: product.price.updated webhook
description: "Salla product.price.updated webhook: Triggered when a product's price is updated."
---

# `product.price.updated`

Triggered when a product's price is updated.

<p dir="rtl" lang="ar">يُرسل عند تغيير سعر منتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Price Updated Webhook Events Model |
| JSON Schema | [`schemas/salla/product.price.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.price.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

## Example payload

```json
{
  "event": "product.price.updated",
  "merchant": 546096831,
  "created_at": "Sun Dec 14 2025 11:41:40 GMT+0300",
  "data": {
    "id": 1462551237,
    "sku": "PRO-7644",
    "mpn": "MPN888",
    "gtin": "38374622",
    "cost": 60,
    "starting_price": null,
    "price": 150,
    "sale_price": {
      "amount": 85,
      "expired_at": "2025-12-01"
    },
    "tax": 22.5,
    "taxed_price": 172.5,
    "regular_price": 150,
    "currency": "SAR",
    "with_tax": true
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event Name One of: `product.price.updated`. |
| `merchant` * | number | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` * | string | Timestamp of the created Event |
| `data` * | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | number | Unique product ID |
| `sku` * | string | Stock Keeping Unit identifier |
| `mpn` * | string | Manufacturer Part Number |
| `gtin` * | string | Global Trade Item Number |
| `cost` * | number | Base cost of the product |
| `regular_price` * | number | Standard selling price before discounts |
| `price` * | number | Current active selling price |
| `sale_price` | object |  |
| `starting_price` | number \| null | Lowest price starting point, if defined |
| `currency` * | string | Currency code in ISO format (e.g., 'SAR') |
| `with_tax` * | boolean | Whether the price includes tax |
| `tax` * | number | Tax amount applied on product price |
| `taxed_price` * | number | Product price including tax |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.price.updated).
