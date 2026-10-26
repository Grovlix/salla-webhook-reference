---
title: brand.deleted webhook
description: "Salla brand.deleted webhook: Triggered when a brand is deleted."
---

# `brand.deleted`

Triggered when a brand is deleted.

<p dir="rtl" lang="ar">يُرسل عند حذف ماركة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Brand](./index.md) |
| Payload model | Brands Webhook Events Model (shared with [`brand.created`](./brand.created.md), [`brand.updated`](./brand.updated.md)) |
| JSON Schema | [`schemas/salla/brand.deleted.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/brand.deleted.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/brands](https://docs.salla.dev/webhook-events/brands) |

## Example payload

Salla publishes one example for this payload model, shown here for `brand.created`. `brand.deleted` uses the same structure.

```json
{
  "event": "brand.created",
  "merchant": 1305146709,
  "created_at": "Tue Jan 25 2022 13:22:11 GMT+0300",
  "data": {
    "id": 1838214943,
    "name": "بوما",
    "description": "",
    "banner": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
    "logo": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
    "ar_char": "ب",
    "en_char": "B",
    "metadata": {
      "title": "Zara brand",
      "description": "Brand awareness seo",
      "url": "zara/item"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `brand.created`, `brand.updated`, `brand.deleted`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of the created event |
| `data` | object (Brand) |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | number | A unique identifier assigned to a specific brand. |
| `name` * | string | The label given to a particular  company, to identify its products in the market. 🌐 [Support multi-language](https://docs.salla.dev/doc-421122) |
| `description` * | string | A brief summary of a company, highlighting key attributes, values, and offerings to convey its identity and purpose. 🌐 [Support multi-language](https://docs.salla.dev/doc-421122) |
| `banner` * | string \| null | A text or URL linking to a banner file, used as a visual identifier for a brand on a webpage or platform. |
| `logo` * | string | A text-based representation or URL link that directs to the logo file. |
| `ar_char` * | string | Brand represented in Arabic characters. |
| `en_char` * | string | Brand represented in English characters. |
| `metadata` * | object |  |
| `label` | string | The label given to a particular  company, to identify its products in the market. 🌐 [Support multi-language](https://docs.salla.dev/doc-421122) |
| `status` * | boolean \| null | Brand status |
| `channels` | array of string | Brand channels |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/brands), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=brand.deleted).
