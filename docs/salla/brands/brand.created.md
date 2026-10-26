---
title: brand.created webhook
description: "Salla brand.created webhook: Triggered when a brand is created."
---

# `brand.created`

Triggered when a brand is created.

<p dir="rtl" lang="ar">يُرسل عند إنشاء ماركة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Brand](./index.md) |
| Payload model | Brands Webhook Events Model (shared with [`brand.updated`](./brand.updated.md), [`brand.deleted`](./brand.deleted.md)) |
| JSON Schema | [`schemas/salla/brand.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/brand.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/brands](https://docs.salla.dev/webhook-events/brands) |

## Example payload

```json
{
  "event": "brand.created",
  "merchant": 596493488,
  "created_at": "Sun Mar 24 2024 16:09:48 GMT+0300",
  "data": {
    "id": 190175156,
    "name": "test1212",
    "description": "test",
    "banner": "https://cdn.salla.sa/image/banner1.png",
    "logo": "https://cdn.salla.sa/image/logo1.png",
    "status": true,
    "ar_char": "ت",
    "en_char": "T",
    "metadata": {
      "title": "1231",
      "description": "123",
      "url": "123"
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

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/brands), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=brand.created).
