---
title: order.shipping.address.updated webhook
description: "Salla order.shipping.address.updated webhook: Triggered when an order's shipping address is updated."
---

# `order.shipping.address.updated`

Triggered when an order's shipping address is updated.

<p dir="rtl" lang="ar">يُرسل عند تعديل عنوان الشحن للطلب.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Order](./index.md) |
| Payload model | Orders Webhook Events Model (shared with [`order.created`](./order.created.md), [`order.updated`](./order.updated.md), [`order.cancelled`](./order.cancelled.md), [`order.refunded`](./order.refunded.md), [`order.deleted`](./order.deleted.md), [`order.products.updated`](./order.products.updated.md), [`order.payment.updated`](./order.payment.updated.md), [`order.coupon.updated`](./order.coupon.updated.md), [`order.total.price.updated`](./order.total.price.updated.md), [`order.customer.updated`](./order.customer.updated.md)) |
| JSON Schema | [`schemas/salla/order.shipping.address.updated.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/order.shipping.address.updated.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/orders](https://docs.salla.dev/webhook-events/orders) |

## Example payload

Salla publishes one example for this payload model, shown here for `order.created`. `order.shipping.address.updated` uses the same structure.

```json
{
  "event": "order.created",
  "merchant": 1305146709,
  "created_at": "Sun Jun 26 2022 12:21:48 GMT+0300",
  "data": {
    "id": 2116149737,
    "reference_id": 41027662,
    "urls": {
      "type": "object",
      "properties": {
        "customer": {
          "type": "string",
          "examples": [
            "https://shtara.com/profile"
          ],
          "description": "Customer Link directly to the order."
        },
        "admin": {
          "type": "string",
          "examples": [
            "https://shtara.com/profile"
          ],
          "description": "Admin Dashboard Link directly to the order."
        },
        "digital_content": {
          "type": "string",
          "description": "Returns a direct link to the associated digital content. This can be used to retrieve files such as e-books, images, PDFs, videos, or any downloadable digital asset linked to the order or product."
        }
      },
      "x-apidog-orders": [
        "customer",
        "admin",
        "digital_content"
      ],
      "required": [
        "digital_content"
      ]
    },
    "date": {
      "date": "2022-06-26 12:21:45.000000",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "source": "store",
    "source_device": "desktop",
    "source_details": {
      "type": "direct",
      "value": null,
      "device": "desktop",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
      "ip": "31.166.186.78"
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
        "amount": 186,
        "currency": "SAR"
      },
      "shipping_cost": {
        "amount": 15,
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
      "discounts": [
        {
          "title": "new offer",
          "type": "special",
          "code": "new offer",
          "discount": "5.00",
          "discounted_shipping": 0
        }
      ],
      "total": {
        "amount": 196,
        "currency": "SAR"
      }
    },
    "shipping": {
      "id": 1833934431,
      "app_id": null,
      "company": "السعودية",
      "logo": "",
      "receiver": {
        "name": "Mohammed Ali",
        "email": "usertest@gmail.com",
        "phone": "999123456789"
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
        "shipping_address": " شارع ابو امية الضمري، الحي الزهراء ،, جدة, السعودية",
        "street_number": "ابو امية الضمري",
        "block": "الزهراء",
        "postal_code": "",
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
      "policy_options": []
    },
    "shipments": [
      {
        "id": 649964784,
        "created_at": null,
        "type": "shipment",
        "courier_id": 802226618,
        "courier_name": "أوتو",
        "courier_logo": "https://salla-dev-portal.s3.eu-central-1.amazonaws.com/uploads/LUZaDEGwzFRDJKO7XVLXtix71Zb8Z2vBt6xwHrwZ.png",
        "shipping_number": null,
        "tracking_number": null,
        "pickup_id": null,
        "trackable": false,
        "tracking_link": null,
        "label": null,
        "payment_method": "cod",
        "source": "store",
        "status": "in_progress",
        "total": {
          "amount": 175.47,
          "currency": "SAR"
        },
        "cash_on_delivery": {
          "amount": 0,
          "currency": "SAR"
        },
        "is_international": true,
        "total_weight": {
          "value": 0.2,
          "units": "kg"
        },
        "packages": [
          {
            "item_id": 2077288690,
            "external_id": null,
            "quantity": 1,
            "weight": {
              "value": 0.2,
              "units": "kg"
            }
          }
        ],
        "ship_from": {
          "type": "branch",
          "name": "المستودع الرئيسي التجريبي",
          "email": "",
          "phone": "966555855555",
          "country": "السعودية",
          "city": "Medina",
          "address_line": "3391 حسين بين عبدلله بين ضميرا,مسجد الدرع,00000, 3391 حسين بين عبدلله بين ضميرا, الدرق موثق, مدينة 42313 8700, سعودي عربية, Medina,السعودية",
          "street_number": "3391 حسين بين عبدلله بين ضميرا",
          "block": "مسجد الدرع",
          "postal_code": "00000",
          "latitude": 24.524655575978006,
          "longitude": 39.56918120384216,
          "branch_id": 1790435930
        },
        "ship_to": {
          "type": "address",
          "name": "Test Username",
          "email": "user@gmail.com",
          "phone": "971501960991",
          "country": "الامارات",
          "city": "أبو ظبي",
          "address_line": " شارع ijaz street، الحي Shakhbout city 70633،, villa 24,, أبو ظبي, الامارات",
          "street_number": "ijaz street",
          "block": "Shakhbout city",
          "postal_code": "70633",
          "latitude": 0,
          "longitude": 0
        },
        "meta": {
          "app_id": 846904320,
          "policy_options": {
            "dimensions": {
              "length": "",
              "width": "",
              "height": ""
            }
          }
        }
      }
    ],
    "can_cancel": true,
    "show_weight": false,
    "can_reorder": true,
    "is_pending_payment": false,
    "pending_payment_ends_at": 172796,
    "checkout_url": "https://salla.sa/dev-nzzxsxjwinegxaa4/checkout/209nryYWDg2Xoqd1VOJaGLwKvrRY8l08vmA708NkE3zM6BlRe4bZxj5b",
    "total_weight": "٠٫٢٥ كجم",
    "shipment_branch": [],
    "customer": {
      "id": 225167971,
      "first_name": "Mohammed",
      "last_name": "Ali",
      "mobile": 501806978,
      "mobile_code": "+966",
      "email": "usertest@gmail.com",
      "urls": {
        "customer": "https://salla.sa/dev-wofftr4xsra5xtlv/profile",
        "admin": "https://s.salla.sa/customers/l7mYBdgXA9xJwWZRZK8WD42GNkZbjvRO",
        "digital_content": "https://salla.sa/dev-k9dn7fok0vih4p70/orders/digital/lm6bowYMnmA9eyWdLkJza153vyZnMb85QO0GZ7NxDlVKXB4grqR82jEN"
      },
      "avatar": "https://cdn.salla.sa/customer_profiles/5i6SUhu9dlF1fvL3EcV98U644eOlG9jcEipz6dOo.jpg",
      "gender": "female",
      "birthday": {
        "date": "1997-06-03 00:00:00.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      },
      "city": "جدة",
      "country": "السعودية",
      "country_code": "SA",
      "currency": "SAR",
      "location": "",
      "updated_at": {
        "date": "2022-06-22 10:20:14.000000",
        "timezone_type": 3,
        "timezone": "Asia/Riyadh"
      }
    },
    "items": [
      {
        "id": 70815337,
        "name": "بيتزا",
        "sku": "54534534",
        "quantity": 1,
        "currency": "SAR",
        "weight": 0.25,
        "weight_label": "٠٫٢٥ كجم",
        "amounts": {
          "price_without_tax": {
            "amount": 186,
            "currency": "SAR"
          },
          "total_discount": {
            "amount": 5,
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
            "amount": 186,
            "currency": "SAR"
          }
        },
        "notes": "",
        "product": {
          "id": 720881993,
          "type": "food",
          "promotion": {
            "title": "اطلبها ساخنه",
            "sub_title": "بيتزا خضار مشكل"
          },
          "status": "sale",
          "is_available": true,
          "sku": "54534534",
          "name": "بيتزا",
          "price": {
            "amount": 66,
            "currency": "SAR"
          },
          "sale_price": {
            "amount": 45,
            "currency": "SAR"
          },
          "currency": "SAR",
          "url": "https://salla.sa/dev-wofftr4xsra5xtlv/بيتزا/p720881993",
          "thumbnail": "https://cdn.salla.sa/bYQEn/buItWZf4OLbaTmL7vTMlDUWLOn20hfpq3QUbD2AB.jpg",
          "has_special_price": false,
          "regular_price": {
            "amount": 66,
            "currency": "SAR"
          },
          "calories": "600.00",
          "mpn": null,
          "gtin": null,
          "favorite": null,
          "starting_price": null
        },
        "options": [
          {
            "id": 1197801866,
            "product_option_id": 60176141,
            "name": "SIZE",
            "type": "checkbox",
            "value": [
              {
                "id": 408420634,
                "name": "BIG",
                "price": {
                  "amount": 120,
                  "currency": "SAR"
                }
              }
            ]
          },
          {
            "id": 289546379,
            "product_option_id": 1674915438,
            "name": "الاضافات",
            "type": "checkbox",
            "value": [
              {
                "id": 152115913,
                "name": "بصل",
                "price": {
                  "amount": 0,
                  "currency": "SAR"
                }
              },
              {
                "id": 1526610378,
                "name": "فلفل",
                "price": {
                  "amount": 0,
                  "currency": "SAR"
                }
              }
            ]
          }
        ],
        "images": [],
        "codes": [],
        "files": []
      }
    ],
    "product_reservations": [
      {
        "id": 1289748598,
        "from": "01:10",
        "to": "01:40",
        "date": "2023-04-18"
      }
    ],
    "bank": {
      "id": 326553500,
      "bank_name": "البنك الأهلي التجاري",
      "bank_id": 1473353380,
      "account_name": "Demo Account",
      "account_number": "000000608010167519",
      "iban_number": "SA2380000382608010130308",
      "status": "active"
    },
    "tags": []
  },
  "pickup_branch": {
    "id": 1345871747,
    "name": "Branch",
    "status": "active",
    "location": {
      "lat": "37.78044939",
      "lng": "-97.8503951"
    },
    "contacts": {
      "phone": "+201099999999",
      "whatsapp": "+201099999999",
      "telephone": "+201099999999"
    },
    "preparation_time": "ساعة 30 دقيقة",
    "is_open": false,
    "closest_time": {
      "from": "08:00",
      "to": "17:00"
    },
    "working_hours": [
      {
        "name": "الأحد",
        "times": [
          {
            "from": "08:00",
            "to": "17:00"
          },
          {
            "from": "19:00",
            "to": "23:30"
          }
        ]
      }
    ],
    "is_cod_available": true,
    "is_default": true,
    "type": [],
    "cod_cost": "15",
    "country": {
      "id": 1473353380,
      "name": "السعودية",
      "name_en": "Saudi Arabia",
      "code": "SA",
      "mobile_code": "+966"
    },
    "city": {
      "id": 1,
      "name": "الرياض",
      "name_en": "Riyadh"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `order.created`, `order.updated`, `order.refunded`, `order.deleted`, `order.products.updated`, `order.payment.updated`, `order.coupon.updated`, `order.total.price.updated`, `order.shipping.address.updated`, `order.cancelled`, `order.customer.updated`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | number | A unique alphanumeric code or identifier assigned to a specific order. List of orders can be found [here](https://docs.salla.dev/api-5394146) |
| `reference_id` * | number | A specific alphanumeric identifier associated with an order. |
| `urls` * | object (Urls) |  |
| `date` * | object (Date) | Date and Time of the order. |
| `source` * | string | The source of the order. One of: `store`, `landing`, `forgotten_basket`, `abandoned-cart`, `campaign`, `dashboard`, `buy_as_gift`, `mahly-app`, `buy_now`, `one-click`, `complete_order`. |
| `source_device` * | string | The machine or device used when the customer placed the order. |
| `source_details` * | object | Order source details. |
| `status` * | object (NewOrderStatus) | Order status. |
| `payment_method` * | string | The specific payment option or financial mechanism chosen and used by a customer to pay for a product or service as part of an order, encompassing various methods. |
| `currency` * | string | The currency in which order costs and prices are expressed and processed, based on the customer's preferences or the business's operational currency. |
| `amounts` * | object | Order amounts. |
| `exchange_rate` * | object | The order exchange rate. |
| `shipping` * | object | Order Shipping details. |
| `shipments` * | array of object (Shipment) | Order shipment details. |
| `can_cancel` * | boolean | The option to enable order cancellation by the store customer.&lt;br&gt; `True` value should be set if the order status is in under review and in progress, as according to the store settings. |
| `show_weight` * | boolean | Whether or not to show the weight value. |
| `can_reorder` * | boolean | Whether or not to enable reorder . |
| `is_pending_payment` * | boolean | The option of displaying order is pending payment to the customer when the order status is `payment_pending`. |
| `rating_link` | string | The rating URL to review the order. 🛑 The variable is to be deprecated; use `data.urls.rating` variable instead. |
| `checkout_url` | string | The checkout URL to settle payments related to the order 🛑 The variable is to be deprecated; use `data.urls.checkout` variable instead. |
| `pending_payment_ends_at` * | integer | Last date allowed to customer to pay the order. |
| `total_weight` * | string | Total weight value |
| `shipment_branch` * | object (ShipmentBranch) | Order shipment branch details. |
| `customer` * | object (Customer) | Customer details. |
| `items` * | array of object |  |
| `bank` * | object |  |
| `tags` * | object (OrderTag) | Order Tag details. |
| `pickup_branch` * | object (Branch) | Order pickup branch details. |
| `cart_reference_id` * | number | A unique alphanumeric code or identifier assigned to a specific order cart. |
| `draft` * | boolean | Whether or not  the order 's status is set to `draft` |
| `receipt_image` * | string | Order's image receipt |
| `read` * | boolean | Whether or not the Merchant has read the order |
| `updated_at` * | object (Date) |  |
| `is_price_quote` * | boolean | The option to quote order price. |
| `store` * | object | Order store details. |
| `scope_exchange_rate` * | string | The rate used to convert a transaction amount into the store's primary currency. |
| `type` * | string | Order Type One of: `gift`, `pre-order`, `normal`. |
| `payment_methods` * | array of object | List of payment methods associated with the order. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/orders), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=order.shipping.address.updated).
