---
title: store.branch.deleted webhook
description: "Salla store.branch.deleted webhook: Triggered when a store branch is deleted."
---

# `store.branch.deleted`

Triggered when a store branch is deleted.

<p dir="rtl" lang="ar">يُرسل عند حذف فرع للمتجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Store](./index.md) |
| Payload model | Store Branch Webhook Event Model (shared with [`store.branch.created`](./store.branch.created.md), [`store.branch.updated`](./store.branch.updated.md), [`store.branch.setDefault`](./store.branch.setDefault.md), [`store.branch.activated`](./store.branch.activated.md)) |
| JSON Schema | [`schemas/salla/store.branch.deleted.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/store.branch.deleted.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/store](https://docs.salla.dev/webhook-events/store) |

## Example payload

Salla publishes one example for this payload model, shown here for `store.branch.updated`. `store.branch.deleted` uses the same structure.

```json
{
  "event": "store.branch.updated",
  "merchant": "1029864349",
  "created_at": "Wed Jun 30 2021 15:24:18 GMT+0300",
  "data": {
    "id": "1866839222",
    "name": "Riyadh Branch",
    "status": "active",
    "location": {
      "lat": "21.4267",
      "lang": "39.8261"
    },
    "contacts": {
      "telephone": "0555555555",
      "phone": "+96652318526",
      "whatsapp": "+96652318526"
    },
    "preparation_time": "2",
    "is_open": false,
    "closest_time": {
      "from": "07:00",
      "to": "12:00"
    },
    "working_hours": [
      {
        "name": "الثلاثاء",
        "times": [
          {
            "from": "07:00",
            "to": "12:00"
          }
        ]
      }
    ],
    "is_cod_available": true,
    "is_default": false,
    "type": {},
    "cod_cost": "10.00",
    "country": {
      "id": 1473353380,
      "name": "السعودية",
      "name_en": "Saudi Arabia",
      "code": "SA",
      "mobile_code": "+966"
    },
    "city": {
      "id": 1473353380,
      "name": "الرياض",
      "name_en": "Riyadh",
      "country_id": 1473353380
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event title or label to represent the event. One of: `store.branch.created`, `store.branch.updated`, `store.branch.deleted`, `store.branch.setDefault`, `store.branch.activate`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | The date and time when a particular event was created or initiated. |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | A unique identifier associated with a specific store. |
| `name` | string | A title or label that represnts the store. |
| `status` | string | Store status to indicate the current status of the store. |
| `location` | object |  |
| `contacts` | object |  |
| `preparation_time` | string | Preparation Time |
| `is_open` | boolean | The option to indidcate if the store is open. |
| `closest_time` | object |  |
| `working_hours` | array of object | Working Hours |
| `is_cod_available` | boolean | The option to inidicate the availability of Cash On Delivery payamnet method. |
| `is_default` | boolean | The option to indicate the store as the default store. |
| `type` | string | The classification of the store branch type, such as main branch, pickup branch, or warehouse. |
| `cod_cost` | string | Cash On Delivery Cost |
| `country` | object |  |
| `city` | object |  |
| `short_address` | string | A brief, human-readable version of the store address used for quick display in interfaces. |
| `street` | string | The street name or road on which the store is located. |
| `address_description` | string | Additional descriptive details that help clarify or explain the store address. |
| `additional_number` | string | An extra address reference such as apartment, unit, or additional national address number. |
| `building_number` | string | The building number associated with the store location. |
| `local` | string | The local area, neighborhood, or locality where the store is situated. |
| `postal_code` | string | The postal or ZIP code assigned to the store's address. |
| `is_stock` * | boolean | The option to indicate whether this branch is used as a stock or warehouse location. |
| `district` | object \| null | The district or sub-area of the city where the store is located. Can be null if not provided. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/store), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=store.branch.deleted).
