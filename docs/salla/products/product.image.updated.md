---
title: product.image.updated webhook
description: "Salla product.image.updated webhook: Triggered when a product's images are updated."
---

# `product.image.updated`

Triggered when a product's images are updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث صور منتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Image Updated Webhook Events Model |
| JSON Schema | [`schemas/salla/product.image.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.image.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

## Example payload

```json
{
  "event": "product.image.updated",
  "merchant": 546096831,
  "created_at": "Sun Dec 14 2025 12:04:05 GMT+0300",
  "data": {
    "id": 1462551237,
    "sku": "PRO-7644",
    "mpn": "MPN888",
    "gtin": "38374622",
    "main_image": {
      "id": 247197971,
      "url": "https://cdn.salla.sa/AzqOeQ/RsoIlcNiVFOaXRsyQU9rBT05yWQeiQ4CzIMHAh5m.png",
      "video_url": null,
      "type": "image"
    },
    "images": [
      {
        "id": 247197971,
        "url": "https://cdn.salla.sa/AzqOeQ/RsoIlcNiVFOaXRsyQU9rBT05yWQeiQ4CzIMHAh5m.png",
        "main": true,
        "three_d_image_url": null,
        "alt": "test55",
        "video_url": null,
        "type": "image",
        "sort": 2
      },
      {
        "id": 1807371374,
        "url": "https://cdn.salla.sa/AzqOeQ/srxtcyQPVFeLjo8UTcZpClHnlcaMVQwwkybTRSyf.jpg",
        "main": false,
        "three_d_image_url": null,
        "alt": "test55",
        "video_url": null,
        "type": "image",
        "sort": 3
      }
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event Name One of: `product.image.updated`. |
| `merchant` * | number | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` * | string | Timestamp of the created Event |
| `data` * | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | integer | Unique identifier associated with a product. Get a list of product IDs [here](https://docs.salla.dev/5394169e0). |
| `sku` * | string | Stock Keeping Unit |
| `mpn` * | string | Manufacturer Part Number |
| `gtin` * | string | Global Trade Item Number |
| `main_image` * | object |  |
| `images` * | array of object | All images related to the product |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.image.updated).
