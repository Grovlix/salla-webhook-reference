---
title: category.updated webhook
description: "Salla category.updated webhook: Triggered when a category is updated."
---

# `category.updated`

Triggered when a category is updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث تصنيف.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Category](./index.md) |
| Payload model | Category Webhook Event Model (shared with [`category.created`](./category.created.md)) |
| JSON Schema | [`schemas/salla/category.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/category.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/categories](https://docs.salla.dev/webhook-events/categories) |

## Example payload

```json
{
  "event": "category.updated",
  "merchant": 1305146709,
  "created_at": "Tue Jan 25 2022 13:20:37 GMT+0300",
  "data": {
    "id": 386705693,
    "name": "رقمية",
    "urls": {
      "customer": "https://salla.sa/dev-wofftr4xsra5xtlv/category/ondDoR",
      "admin": "https://s.salla.sa/categories"
    },
    "items": [],
    "parent_id": 0,
    "status": "hidden",
    "sort_order": 4,
    "sub_categories": [],
    "metadata": {
      "title": "Dress",
      "description": "Amazing Dress",
      "url": "https://dress.com"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `category.created`, `category.updated`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of the created event |
| `data` | object | Category data object containing all the category information |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Category ID |
| `name` | string | Category Name |
| `urls` | object | URLs related to the category for different interfaces |
| `parent_id` | number | Category Parent ID |
| `status` | string | The status of the category, whether or not it is `active` or `hidden` One of: `active`, `hidden`. |
| `sort_order` | number | Sort Order number |
| `metadata` | object | SEO metadata information for the category |
| `update_at` | string | Category last updated date. |
| `items` | array of object | Array of subcategories |
| `image` | string | Category image url |
| `show_in` | object | Visibility settings for where the category should be displayed |
| `has_hidden_products` | boolean | Indicates whether this category contains any hidden products |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/categories), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=category.updated).
