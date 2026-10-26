---
title: specialoffer.created webhook
description: "Salla specialoffer.created webhook: Triggered when a special offer is created."
---

# `specialoffer.created`

Triggered when a special offer is created.

<p dir="rtl" lang="ar">يُرسل عند إنشاء عرض خاص.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Special offer](./index.md) |
| Payload model | Special Offer Webhook Event Model (shared with [`specialoffer.updated`](./specialoffer.updated.md)) |
| JSON Schema | [`schemas/salla/specialoffer.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/specialoffer.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/special-offers](https://docs.salla.dev/webhook-events/special-offers) |

## Example payload

Salla publishes one example for this payload model, shown here for `specialoffer.updated`. `specialoffer.created` uses the same structure.

```json
{
  "event": "specialoffer.updated",
  "merchant": 1305146709,
  "created_at": "Tue Jan 25 2022 13:26:20 GMT+0300",
  "data": {
    "id": 1649524234,
    "name": "اشتري 1 واحصل على الاخر مجانا",
    "message": "اشتري قطعة واحصل على قطعة واحدة مجاناً من التصنيفات التالية",
    "expiry_date": null,
    "offer_type": "buy_x_get_y",
    "status": "inactive",
    "buy": {
      "type": "category",
      "quantity": "1",
      "categories": [
        {
          "id": 1548056,
          "name": "البلايز",
          "avatar": "sicon-store",
          "created_at": "2021-11-01 16:46:06",
          "updated_at": "2022-01-16 15:35:55",
          "deleted_at": null,
          "store_id": 577778,
          "parent_id": 0,
          "products_counts": 3,
          "show_in_menu": 0,
          "sort_order": 2,
          "status": "active",
          "has_hidden_products": 0,
          "show_in_app": 1,
          "extra_attributes": [],
          "custom_url": null
        }
      ]
    },
    "get": {
      "categories": [
        {
          "id": 256950451,
          "name": "البلايز",
          "urls": {
            "customer": "https://salla.sa/dev-wofftr4xsra5xtlv/category/zvawao",
            "admin": "https://s.salla.sa/categories"
          },
          "items": [],
          "parent_id": 0,
          "status": "active",
          "sort_order": 2,
          "sub_categories": []
        }
      ],
      "type": "category",
      "discount_type": "free-product"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | a label or title used to identify a specific event. One of: `specialoffer.created`, `specialoffer.updated`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | The date and time when a particular Webhook was created or initiated. |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | A unique identifier assigned to the special offer id. |
| `name` | string | A label or title used to identify the special offer. |
| `message` | string | A promotional message or notification that communicates a specific deal, discount, promotion, or incentive to customers. |
| `expiry_date` | string | The date on which a promotional or discount offer is set to expire or become no longer valid. |
| `offer_type` | string | The category or classification of a specific promotion, discount, or incentive within a marketing or sales context. One of: `fixed_amount`, `buy_x_get_y`, `percentage`. |
| `status` | string | The current condition or state of a promotional offer. |
| `applied_to` | string | The way a promotional or discount offer is implemented to or used. |
| `buy` | object |  |
| `get` | object |  |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/special-offers), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=specialoffer.created).
