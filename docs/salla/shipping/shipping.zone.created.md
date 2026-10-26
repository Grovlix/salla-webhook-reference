---
title: shipping.zone.created webhook
description: "Salla shipping.zone.created webhook: Triggered when a shipping zone is created for a custom shipping company."
---

# `shipping.zone.created`

Triggered when a shipping zone is created for a custom shipping company.

<p dir="rtl" lang="ar">يُرسل عند إنشاء منطقة شحن لشركة شحن مخصّصة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Shipping company and zone](./index.md) |
| Payload model | Shipping Zone Webhook Model (shared with [`shipping.zone.updated`](./shipping.zone.updated.md)) |
| JSON Schema | [`schemas/salla/shipping.zone.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/shipping.zone.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/shippings](https://docs.salla.dev/webhook-events/shippings) |

## Example payload

```json
{
  "event": "shipping.zone.created",
  "merchant": 1305146709,
  "created_at": "Thu Apr 14 2022 11:21:47 GMT+0300",
  "data": {
    "id": 870442223,
    "zone_code": ".AE.ajman-city",
    "company": {
      "id": 488260393,
      "slug": null
    },
    "country": {
      "id": 566146469,
      "name": "الامارات",
      "name_en": "United Arab Emirates",
      "code": "AE",
      "mobile_code": "+971"
    },
    "city": {
      "id": 374975390,
      "name": "مدينة عجمان",
      "name_en": "AJMAN CITY"
    },
    "cities_excluded": [
      {
        "id": 257742554,
        "name": "أبو حليفة",
        "name_en": "ABU HALIFA"
      },
      {
        "id": 81998629,
        "name": "الأحمدي",
        "name_en": "AHMADI"
      }
    ],
    "fees": {
      "amount": "30",
      "currency": "SAR",
      "type": "rate",
      "weight_unit": "kg",
      "up_to_weight": "15",
      "amount_per_unit": "2",
      "per_unit": "1"
    },
    "cash_on_delivery": {
      "status": true,
      "fees": "12"
    },
    "duration": "3-5"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `shipping.zone.created`, `shipping.zone.updated`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Shipping Zone ID |
| `zone_code` | string | Shipping Zone Code |
| `company` | object |  |
| `country` | object |  |
| `city` | object |  |
| `cities_excluded` | array of object | Cities Excluded from Shipping |
| `fees` | object |  |
| `cash_on_delivery` | object |  |
| `duration` | string | Shipping Duration in Days |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/shippings), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=shipping.zone.created).
