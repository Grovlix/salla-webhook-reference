---
title: invoice.created webhook
description: "Salla invoice.created webhook: Triggered when an order's status becomes `completed` or `restored`."
---

# `invoice.created`

Triggered when an order's status becomes `completed` or `restored`.

<p dir="rtl" lang="ar">يُرسل عندما تصبح حالة الطلب `completed` أو `restored`.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Invoice](./index.md) |
| Payload model | Invoice Created Webhook Event Model |
| JSON Schema | [`schemas/salla/invoice.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/invoice.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/invoice](https://docs.salla.dev/webhook-events/invoice) |

## Example payload

```json
{
  "event": "invoice.created",
  "merchant": 1601633483,
  "created_at": "Mon Feb 20 2023 15:58:00 GMT+0300",
  "data": {
    "id": 952648521,
    "uuid": "a2bffe40-adf7-4bfe-8782-c34ca567ec98",
    "invoice_reference_id": "1772",
    "order_id": 315606782,
    "type": "Credit Note",
    "date": "2023-02-20 15:58:00",
    "invoice_number": 13,
    "payment_method": "bank",
    "sub_total": {
      "amount": 50,
      "currency": "SAR"
    },
    "shipping_cost": {
      "amount": 33,
      "taxable": true,
      "currency": "SAR"
    },
    "cod_cost": {
      "amount": 0,
      "taxable": true,
      "currency": "SAR"
    },
    "discount": {
      "amount": 0,
      "currency": "SAR"
    },
    "tax": {
      "percent": 50,
      "amount": {
        "amount": 41.5,
        "currency": "SAR"
      }
    },
    "total": {
      "amount": 124.5,
      "currency": "SAR"
    },
    "shipping_cost_discount": {
      "amount": 0,
      "currency": "SAR"
    },
    "items": [
      {
        "id": 710619710,
        "item_id": 409661958,
        "name": "User Product Demo",
        "quantity": 1,
        "type": "product",
        "price": {
          "amount": 50,
          "currency": "SAR"
        },
        "discount": {
          "amount": 0,
          "currency": "SAR"
        },
        "tax": {
          "percent": 50,
          "amount": {
            "amount": 25,
            "currency": "SAR"
          }
        },
        "total": {
          "amount": 75,
          "currency": "SAR"
        }
      },
      {
        "name": "رسوم الشحن",
        "quantity": 1,
        "type": "service",
        "price": {
          "amount": 33,
          "currency": "SAR"
        },
        "discount": {
          "amount": 0,
          "currency": "SAR"
        },
        "tax": {
          "percent": 50,
          "amount": {
            "amount": 16.5,
            "currency": "SAR"
          }
        },
        "total": {
          "amount": 49.5,
          "currency": "SAR"
        }
      }
    ],
    "customer": {
      "id": 166343388,
      "first_name": "Username",
      "last_name": "Demo",
      "mobile": 555555555,
      "mobile_code": "+966",
      "email": "username@salla.sa",
      "avatar": "https://logo.com/logo.png",
      "gender": "female",
      "birthday": {
        "date": "1997-03-06 00:00:00.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      },
      "city": "جدة",
      "country": "السعودية",
      "country_code": "SA",
      "currency": "SAR",
      "location": "31.221365",
      "updated_at": {
        "date": "2023-02-20 15:44:35.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      },
      "order_address": {
        "description": "Lorem Ipsum",
        "street_name": "abu umayyah ad damri",
        "additional_number": null,
        "building_number": null,
        "district": null
      }
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `invoice.created`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Created At Timestamp |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Invoice ID |
| `uuid` | string | Universally Unique Identifier for the Invoice |
| `invoice_reference_id` | string | Invoice Reference ID |
| `order_id` | number | Order ID |
| `type` | string | Invoice Type |
| `date` | string | Invoice Date |
| `invoice_number` | integer | Invoice Number |
| `payment_method` | string | Invoice Payment Method |
| `sub_total` | object |  |
| `shipping_cost` | object |  |
| `cod_cost` | object |  |
| `discount` | object |  |
| `tax` | object |  |
| `total` | object |  |
| `shipping_cost_discount` | object |  |
| `items` | array of object |  |
| `customer` | object |  |
| `company` | object \| null |  |
| `slug` | integer \| null | Slug |
| `qr_code` | string | QR Code |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/invoice), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=invoice.created).
