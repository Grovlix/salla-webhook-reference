---
title: shipment.cancelled webhook
description: "Salla shipment.cancelled webhook: Triggered when a shipment is cancelled."
---

# `shipment.cancelled`

Triggered when a shipment is cancelled.

<p dir="rtl" lang="ar">يُرسل عند إلغاء شحنة.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Shipment](./index.md) |
| Payload model | Shipments Webhook Events Model (shared with [`shipment.creating`](./shipment.creating.md), [`shipment.created`](./shipment.created.md), [`shipment.updated`](./shipment.updated.md)) |
| JSON Schema | [`schemas/salla/shipment.cancelled.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/shipment.cancelled.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/shipments](https://docs.salla.dev/webhook-events/shipments) |

## Example payload

Salla publishes one example for this payload model, shown here for `shipment.creating`. `shipment.cancelled` uses the same structure.

```json
{
  "event": "shipment.creating",
  "merchant": 136409261,
  "created_at": "Sun Jan 29 2023 21:16:38 GMT+0300",
  "data": {
    "id": 362985662,
    "order_id": 560695738,
    "order_reference_id": 48927,
    "created_at": {
      "date": "2023-01-29 21:16:38.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "type": "shipment",
    "courier_id": 1927161457,
    "courier_name": "Shipping App",
    "courier_logo": "https://company.com/logo.png",
    "shipping_number": "846984645",
    "tracking_number": "4324233",
    "pickup_id": null,
    "trackable": true,
    "tracking_link": "https://www.company/tracking/tracking-express.html?submit=1&tracking-id=12345",
    "label": {
      "format": "pdf",
      "url": "https://company.com/lable.pdf"
    },
    "payment_method": "cod",
    "source": "api",
    "status": "delivered",
    "total": {
      "amount": 25.5,
      "currency": "SAR"
    },
    "cash_on_delivery": {
      "amount": 10.7,
      "currency": "SAR"
    },
    "is_international": false,
    "total_weight": {
      "value": 5,
      "units": "kg"
    },
    "packages": [
      {
        "item_id": 2077288690,
        "external_id": null,
        "name": "منتج تجريبي",
        "sku": "6ytrrhrhr",
        "price": {
          "amount": 25.5,
          "currency": "SAR"
        },
        "quantity": 1,
        "weight": {
          "value": 5,
          "unit": "kg"
        }
      }
    ],
    "ship_from": {
      "type": "branch",
      "name": "الفرع الرئيسي",
      "email": "",
      "phone": "966920034002",
      "country": "السعودية",
      "city": "Mecca",
      "address_line": "Mecca,السعودية",
      "street_number": null,
      "block": null,
      "postal_code": null,
      "latitude": 21.3825905096851,
      "longitude": 39.77319103068542,
      "branch_id": 1987977866
    },
    "ship_to": {
      "type": "address",
      "name": "Username",
      "email": "username@email.com",
      "phone": "966501806978",
      "country": "السعودية",
      "city": "الرياض",
      "address_line": " شارع 2345، الحي السلام 95128،, شارع عبدالله  سنابل السلام  مكة  السعوديه,, الرياض, السعودية",
      "street_number": "2345",
      "block": "السلام",
      "postal_code": "95128",
      "latitude": 21.382590509685,
      "longitude": 39.773191030685
    },
    "meta": {
      "app_id": 1222362158,
      "policy_options": {
        "boxes": 1
      }
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `shipment.creating`, `shipment.created`, `shipment.updated`, `shipment.cancelled`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Webhook Created At Date Timestamp |
| `data` | object (Shipment) |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `tracking_link` | string \| null |  |
| `ship_to` | object (ShippingAddress) |  |
| `id` | string \| null |  |
| `type` | string \| null |  One of: `pickup`, `delivery`. |
| `courier_id` | integer \| null |  |
| `courier_name` | string \| null |  |
| `courier_logo` | string \| null |  |
| `shipping_number` | string \| null |  |
| `tracking_number` | string \| null |  |
| `pickup_id` | string \| null |  |
| `trackable` | boolean \| null |  |
| `payment_method` | string \| null |  |
| `source` | string \| null |  |
| `status` | string \| null |  |
| `total` | object (Price) |  |
| `cash_on_delivery` | null |  |
| `is_international` | boolean \| null |  |
| `packages` | array \| null |  |
| `ship_from` | object (ShippingAddress) |  |
| `translated_status` | string \| null |  |
| `tracking_url` | string \| null |  |
| `driver_info` | object |  |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/shipments), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=shipment.cancelled).
