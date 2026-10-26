---
title: order.shipment.return.created webhook
description: "Salla order.shipment.return.created webhook: Triggered when an order return shipment is created."
---

# `order.shipment.return.created`

Triggered when an order return shipment is created.

<p dir="rtl" lang="ar">يُرسل بعد إنشاء شحنة إرجاع للطلب.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Order](./index.md) |
| Payload model | Order Shipments Webhook Events Model (shared with [`order.shipment.creating`](./order.shipment.creating.md), [`order.shipment.created`](./order.shipment.created.md), [`order.shipment.return.creating`](./order.shipment.return.creating.md)) |
| JSON Schema | [`schemas/salla/order.shipment.return.created.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/order.shipment.return.created.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/orders](https://docs.salla.dev/webhook-events/orders) |

## Example payload

Salla publishes one example for this payload model, shown here for `order.shipment.creating`. `order.shipment.return.created` uses the same structure.

```json
{
  "event": "order.shipment.creating",
  "merchant": 1305146709,
  "created_at": "Sun Jun 26 2022 13:29:51 GMT+0300",
  "data": {
    "id": 1427738113,
    "reference_id": 41030566,
    "urls": {
      "customer": "https://salla.sa/dev-wofftr4xsra5xtlv/order/AB3exRyLdXv5Wp8KwZ9WrGg4p7Ej8ZKl",
      "admin": "https://s.salla.sa/orders/order/AB3exRyLdXv5Wp8KwZ9WrGg4p7Ej8ZKl"
    },
    "date": {
      "date": "2022-06-26 13:29:43.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "source": "dashboard",
    "source_device": "desktop",
    "source_details": {
      "type": "dashboard",
      "value": null,
      "device": "desktop",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
      "ip": null
    },
    "first_complete_at": null,
    "status": {
      "id": 566146469,
      "name": "بإنتظار المراجعة",
      "slug": "under_review",
      "customized": {
        "id": 986688842,
        "name": "بإنتظار المراجعة"
      }
    },
    "payment_method": "bank",
    "currency": "SAR",
    "amounts": {
      "sub_total": {
        "amount": 79,
        "currency": "SAR"
      },
      "shipping_cost": {
        "amount": 35,
        "currency": "SAR"
      },
      "cash_on_delivery": {
        "amount": 0,
        "currency": "SAR"
      },
      "tax": {
        "percent": "0.00",
        "amount": {
          "amount": 0,
          "currency": "SAR"
        }
      },
      "discounts": [],
      "total": {
        "amount": 114,
        "currency": "SAR"
      }
    },
    "shipping": {
      "id": 1935030040,
      "app_id": "2032004508",
      "company": "usertest@gmail.com",
      "logo": "https://salla-dev-portal.s3.eu-central-1.amazonaws.com/uploads/T3GFoIZXP7BsIKMEfdL3XoT9rxSXZN9WpKoFifa8.png",
      "receiver": {
        "name": "Del Don",
        "email": "user@gmail.com",
        "phone": "971555555555"
      },
      "shipper": {
        "name": "Demo",
        "company_name": "dev-wofftr4xsra5xtlv",
        "email": "wofftr4xsra5xtlv@email.partners",
        "phone": "966500000000"
      },
      "pickup_address": {
        "country": "السعودية",
        "country_code": "SA",
        "city": "مكة",
        "shipping_address": "شارع عبدالله,السلام,23233, سنابل السلام, مكة,السعودية",
        "street_number": "شارع عبدالله",
        "block": "السلام",
        "postal_code": "23233",
        "geo_coordinates": {
          "lat": 21.3825905096851,
          "lng": 39.77319103068542
        }
      },
      "address": {
        "country": "SA",
        "country_code": "SA",
        "city": "جدة",
        "shipping_address": " شارع Abu tamimah، الحي az zahraa 23233،, 5,, جدة, السعودية",
        "street_number": "Abu tamimah",
        "block": "az zahraa",
        "postal_code": "23233",
        "geo_coordinates": {
          "lat": 0,
          "lng": 0
        }
      },
      "shipment": {
        "id": "0",
        "pickup_id": null,
        "tracking_link": "0",
        "label": []
      },
      "policy_options": {
        "boxes": "2"
      }
    },
    "can_cancel": true,
    "show_weight": false,
    "can_reorder": true,
    "is_pending_payment": false,
    "pending_payment_ends_at": 172791,
    "total_weight": "٠٫٢٥ كجم",
    "shipment_branch": [
      {
        "id": 731280709,
        "name": "الفرع الرئيسي",
        "status": "active",
        "is_default": true,
        "type": {}
      }
    ],
    "customer": {
      "id": 1550968832,
      "name": "Del Don",
      "mobile": "+971555555555",
      "email": "user@gmail.com",
      "avatar": "https://store-test.com/cp/assets/images/avatar_male.png",
      "country": "الامارات",
      "city": ""
    },
    "items": [
      {
        "id": 1907902809,
        "product_id": 1994210129,
        "name": "تنورة",
        "sku": "2400409-20000012660-",
        "quantity": 1,
        "weight": 0.25,
        "amounts": {
          "price_without_tax": {
            "amount": 79,
            "currency": "SAR"
          },
          "total_discount": {
            "amount": 0,
            "currency": "SAR"
          },
          "tax": {
            "percent": "0.00",
            "amount": {
              "amount": 0,
              "currency": "SAR"
            }
          },
          "total": {
            "amount": 79,
            "currency": "SAR"
          }
        }
      }
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `order.shipment.creating`, `order.shipment.created`, `order.shipment.return.creating`, `order.shipment.return.created`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Order ID |
| `reference_id` | number | Order refrence ID, that appears to customers in the store. |
| `urls` | object (Urls) |  |
| `date` | object (Date) |  |
| `source` | string | The source of the order. |
| `source_device` | string | The machine or device used when the customer placed the order. |
| `source_details` | object |  |
| `first_complete_at` | string \| null | Gets the first date of changing the order status to `completed`. |
| `status` | object |  |
| `payment_method` | string | Order payment method |
| `currency` | string | Order currency |
| `amounts` | object |  |
| `shipping` | object |  |
| `can_cancel` | boolean | Whether or not if the order is allowed to be cancelled by store customers.&lt;br&gt; `True` value should be set if the order status is in under review and in progress, as according to the store settings. |
| `show_weight` | boolean | Whether or not to show weight value |
| `can_reorder` | boolean | Whether or not the order allowed to be re-order by customers |
| `is_pending_payment` | boolean | Waiting the customer to pay the order or the order status is `payment_pending` |
| `rating_link` | string | The rating URL to review the order. 🛑 The variable is to be deprecated; use `data.urls.rating` variable instead. |
| `checkout_url` | string | The checkout URL to settle payments related to the order 🛑 The variable is to be deprecated; use `data.urls.checkout` variable instead. |
| `pending_payment_ends_at` | integer | Last date allowed to customer to pay the order |
| `total_weight` | string | Total weight value |
| `shipment_branch` | object (ShipmentBranch) |  |
| `customer` | object (Customer) |  |
| `items` | array of object |  |
| `shipments` | array of object (Shipment) |  |
| `payment_methods` * | array of object | List of payment methods associated with the order. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/orders), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=order.shipment.return.created).
