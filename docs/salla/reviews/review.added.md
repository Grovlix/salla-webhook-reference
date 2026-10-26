---
title: review.added webhook
description: "Salla review.added webhook: Triggered when a product review is added."
---

# `review.added`

Triggered when a product review is added.

<p dir="rtl" lang="ar">يُرسل عند إضافة تقييم لمنتج.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Review](./index.md) |
| Payload model | Review Added Webhook Event Model |
| JSON Schema | [`schemas/salla/review.added.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/review.added.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/misc](https://docs.salla.dev/webhook-events/misc) |

## Example payload

```json
{
  "event": "review.added",
  "merchant": 1029864349,
  "created_at": "Wed Jul 7 2021 14:50:48 GMT+0300",
  "data": {
    "type": "rating",
    "rating": "5",
    "content": "Nice",
    "customer": {
      "id": "2107468057",
      "name": "Mohammed Ali",
      "mobile": "+28364687236547523745",
      "avatar": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
      "country": "السعودية",
      "city": "الرياض"
    },
    "product": {
      "id": "1653503260",
      "type": "codes",
      "promotion": {
        "title": null,
        "sub_title": null
      }
    },
    "status": {
      "id": "1298199463",
      "name": "تم التنفيذ",
      "customized": {
        "id": "1693817923",
        "name": "تم التنفيذ"
      },
      "can_cancel": false
    },
    "is_available": false,
    "sku": " ",
    "name": "FW180017",
    "price": {
      "amount": 1600,
      "currency": "SAR"
    },
    "sale_price": {
      "amount": "0",
      "currency": "SAR"
    },
    "currency": "SAR",
    "url": "https://store.test/nabilanazer/dpXnr",
    "thumbnail": null,
    "has_special_price": false,
    "regular_price": {
      "amount": "1600",
      "currency": "SAR"
    },
    "favorite": null,
    "order": {
      "id": "1289663293",
      "reference_id": "27290",
      "total": {
        "amount": "3732",
        "currency": "SAR"
      }
    },
    "date": [
      "2022-12-31"
    ],
    "items": [
      {
        "name": "FW180016",
        "quantity": "1"
      }
    ]
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | A label or title used to identify a specific event. |
| `merchant` * | integer | Merchant ID who installed the application on their store. Get details on the Merchant via the ID using the endpoint https://docs.salla.dev/api-8330089 |
| `created_at` * | string | The date and time when a particular event was created or initiated. |
| `data` * | object | Payload body that contains detailed information about the review, customer, product, and related order. |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `type` * | string | The categorization or classification of a review based on its nature or purpose. |
| `rating` * | string | A numerical or qualitative evaluation given to a product, service, or experience in a review. |
| `content` * | string | The written or textual portion of a review that provides detailed feedback, opinions, comments, or descriptions of a product, service, experience, or other subject of review. |
| `customer` * | object | Information about the customer who submitted the review. |
| `product` * | object | Snapshot of the product that the review is associated with. |
| `order` * | object | Snapshot of the order associated with this review. |
| `status` | object |  |
| `is_available` | boolean | The option to indicate the product availability |
| `sku` | string | Stock-keeping unit, a unique code used to identify and manage specific products in inventory. |
| `name` | string | The name or label assigned to a specific product. |
| `price` | object |  |
| `sale_price` | object |  |
| `currency` | string | Currency in which the product is purchased at. |
| `url` | string | A web address that leads directly to a specific product's page or listing on a website. |
| `thumbnail` | null | A small, reduced-size image or visual representation of a product. |
| `has_special_price` | boolean | The option to indicate the availability of special price. |
| `regular_price` | object |  |
| `favorite` | null | Represents whether the product is marked as a favorite in this context. |
| `date` | array of string | A specific point in time within the calendar system, typically consisting of the day, month, and year. |
| `items` | array of object |  |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/misc), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=review.added).
