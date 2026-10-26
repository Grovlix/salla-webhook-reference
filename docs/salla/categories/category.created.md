---
title: category.created webhook
description: "Salla category.created webhook: Triggered when a category is created."
---

# `category.created`

Triggered when a category is created.

<p dir="rtl" lang="ar">يُرسل عند إنشاء تصنيف.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Category](./index.md) |
| Payload model | Category Webhook Event Model (shared with [`category.updated`](./category.updated.md)) |
| JSON Schema | [`schemas/salla/category.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/category.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/categories](https://docs.salla.dev/webhook-events/categories) |

## Example payload

```json
{
  "event": "category.created",
  "merchant": 1029864349,
  "created_at": "Wed Jun 30 2021 14:21:57 GMT+0300",
  "data": {
    "id": 1429120554,
    "name": "test category",
    "urls": {
      "customer": "https://store.test/nabilanazer/category/neje",
      "admin": "/categories"
    },
    "items": [
      "string"
    ],
    "parent_id": 99911771,
    "status": "hidden",
    "sort_order": "7",
    "sub_categories": [
      "string"
    ]
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

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/categories), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=category.created).
