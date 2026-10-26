---
title: product.available webhook
description: "Salla product.available webhook: Triggered when a product comes back in stock."
---

# `product.available`

Triggered when a product comes back in stock.

<p dir="rtl" lang="ar">يُرسل عند توفّر المنتج في المخزون من جديد.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Product](./index.md) |
| Payload model | Product Webhook Events Model (shared with [`product.created`](./product.created.md), [`product.updated`](./product.updated.md), [`product.deleted`](./product.deleted.md), [`product.quantity.low`](./product.quantity.low.md)) |
| JSON Schema | [`schemas/salla/product.available.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/product.available.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products) |

::: warning Deprecated
Salla's events table shows this event struck through. Don't build new integrations on it.
:::

## Example payload

Salla publishes one example for this payload model, shown here for `product.created`. `product.available` uses the same structure.

```json
{
  "event": "product.created",
  "merchant": 1305146709,
  "created_at": "Mon Apr 17 2023 12:14:21 GMT+0300",
  "data": {
    "id": 1025569331,
    "promotion": {
      "title": null,
      "sub_title": null
    },
    "sku": "",
    "mpn": null,
    "gtin": null,
    "type": "booking",
    "name": "Product-Booking-API-Date-and-Time",
    "short_link_code": "aezvrRn",
    "urls": {
      "customer": "https://salla.sa/dev-wofftr4xsra5xtlv/product-booking-api-date-and-time/p1025569331",
      "admin": "https://s.salla.sa/products/1025569331"
    },
    "price": {
      "amount": 299,
      "currency": "SAR"
    },
    "taxed_price": {
      "amount": 343.85,
      "currency": "SAR"
    },
    "pre_tax_price": {
      "amount": 299,
      "currency": "SAR"
    },
    "tax": {
      "amount": 44.85,
      "currency": "SAR"
    },
    "description": "",
    "quantity": 20,
    "status": "hidden",
    "is_available": false,
    "views": 0,
    "sale_price": {
      "amount": 0,
      "currency": "SAR"
    },
    "sale_end": null,
    "require_shipping": false,
    "cost_price": null,
    "weight": 0,
    "weight_type": null,
    "with_tax": true,
    "url": "https://salla.sa/dev-wofftr4xsra5xtlv/product-booking-api-date-and-time/p1025569331",
    "main_image": null,
    "images": [],
    "sold_quantity": 0,
    "rating": {
      "total": 0,
      "count": 0,
      "rate": 0
    },
    "regular_price": {
      "amount": 299,
      "currency": "SAR"
    },
    "max_items_per_user": 1,
    "maximum_quantity_per_order": null,
    "show_in_app": false,
    "notify_quantity": null,
    "hide_quantity": true,
    "unlimited_quantity": false,
    "managed_by_branches": false,
    "services_blocks": {
      "installments": []
    },
    "calories": null,
    "customized_sku_quantity": false,
    "channels": [],
    "starting_price": null,
    "metadata": {
      "title": null,
      "description": null
    },
    "booking_details": {
      "id": 231783151,
      "type": "date_time",
      "session_duration": 50,
      "session_gap": 3,
      "sessions_count": 10,
      "location": "Medina",
      "time_strict_type": "days",
      "time_strict": 5,
      "overrides": [
        {
          "id": 1476756183,
          "date": "2023-04-23"
        },
        {
          "id": 904045008,
          "date": "2023-04-24"
        }
      ],
      "availabilities": [
        {
          "day": "sunday",
          "is_available": true,
          "times": [
            {
              "from": "09:30",
              "to": "13:00"
            },
            {
              "from": "12:00",
              "to": "22:00"
            }
          ]
        },
        {
          "day": "monday",
          "is_available": true,
          "times": [
            {
              "from": "10:00",
              "to": "12:00"
            }
          ]
        }
      ]
    },
    "allow_attachments": false,
    "is_pinned": false,
    "pinned_date": "2023-04-17 12:14:20",
    "sort": 0,
    "enable_upload_image": false,
    "updated_at": "2023-04-17 12:14:21",
    "options": [],
    "skus": [],
    "categories": [],
    "brand": null,
    "tags": []
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `product.created`, `product.updated`, `product.deleted`, `product.available`, `product.quantity.low`. |
| `merchant` | number | Unique identifier associated with the Merchant who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/9466620e0) |
| `created_at` | string | Timestamp of the created Event |
| `data` | object (ProductDetails) |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | number | A unique identifier for a specific product within a database. |
| `promotion` * | object | Product promotion details |
| `sku` * | string | Stock Keeping Unit is a unique alphanumeric code used to identify and manage specific products within a company's inventory. |
| `mpn` * | string \| null | Manufacturer Part Number (MPN) is a unique identifier assigned by manufacturers to products. |
| `gtin` * | string \| null | "Global Trade Item Number" (GTIN), a unique and standardized identifier used to uniquely represent products in the global marketplace. |
| `type` * | string | The categorization of a product based on its characteristics, features, or intended use. One of: `product`, `service`, `group_products`, `codes`, `digital`, `food`, `donating`, `booking`. |
| `name` * | string | A label for an item, aiding in easy identification and categorization within a product listing. 🌐 [Supports multi-language](https://docs.salla.dev/doc-421122) |
| `short_link_code` * | string | A short and simplified alphanumeric code or URL used to provide a quick and easy way to access or share a specific product's webpage or information. |
| `urls` * | object (Urls) |  |
| `price` * | object |  |
| `taxed_price` * | object |  |
| `pre_tax_price` * | object | Product price details before the tax is applied. |
| `tax` * | object | Product tax price details |
| `description` * | string | A detailed information about an item. 🌐 [Support multi-language](https://docs.salla.dev/doc-421122) |
| `quantity` * | integer | The number of items available in stock. |
| `unlimited_quantity` * | boolean | Whether or not the product is of unlimited quantity. |
| `status` * | string | Product status refers to the current state of availability of a particular item within a product catalog or inventory. One of: `sale`, `out`, `hidden`, `deleted`. |
| `is_available` * | boolean | Whether or not the product is available. |
| `views` * | integer | The total number of times a specific product has been viewed by users. |
| `sale_price` * | object | The information about the discounted price or special pricing for a product. |
| `sale_end` * | string | The date or time when a promotional sale or discount on a product is scheduled to expire. |
| `require_shipping` * | boolean | Whether or not the product necessitates a physical delivery process or can be provided digitally without shipping. |
| `cost_price` * | number | The amount a business pays to acquire or manufacture a product before any additional expenses, such as overhead or markup, are applied |
| `weight` * | number | The weight of the product represented in numerical form if applicable. |
| `weight_type` * | string | The classification or unit of measurement used to specify the weight of an object or item, such as kilograms (kg), pounds (lb), ounces (oz), or grams (g). One of: `kg`, `g`, `lb`, `oz`. |
| `with_tax` * | boolean | Whether or not a tax applied to this product or not. |
| `url` * | string | The hyperlink that leads to a specific product's page. |
| `images` * | array of object | Visual representations or pictures of a product, to showcase its appearance, features, and details to potential customers. |
| `sold_quantity` * | integer | The total number of items of the product that have been purchased or sold over a certain period. |
| `rating` * | object | Product rating details, include information about the ratings and reviews provided by customers for a specific product. |
| `regular_price` * | object | Product regular price details. |
| `max_items_per_user` * | number | The limit set on the number of products that an individual user is allowed to purchase. |
| `maximum_quantity_per_order` * | number \| null | Maximum quantity per order for the customer or the maximum quantity for the product. |
| `show_in_app` * | boolean | Whether or not to show the product in the App. |
| `notify_quantity` * | string \| null | Notify quantity of the product. |
| `hide_quantity` * | boolean | Whether or not to hide the product quantity. |
| `channels` * | array of string | The product to appear in specific channels. |
| `managed_by_branches` * | boolean | Whether or not to indicate if the product is managed by branches. |
| `service_blocks` * | object | External services for the prodcut. |
| `calories` * | string \| null | Calories amount of the product. |
| `starting_price` * | object | The merchant owner should activate this feature from his store from [here](https://s.salla.sa/settings/component/options). |
| `allow_attachments` * | boolean | Whether or not to allow adding attachments to the prodcut details. |
| `is_pinned` * | boolean | Whether or not to show if the prodcut is pinned. |
| `pinned_date` * | string | The date which the product was pinned at. |
| `sort` | number \| null | Passing sort will no longer update product sort, use ctegory create/update endpoints to do that. |
| `active_advance` * | boolean | Whether or not to activate advance product details. |
| `enable_upload_image` * | boolean | Whether or not to allow image uploading. |
| `updated_at` * | string | Product last updated date. |
| `options` * | array of object (MiniProductOption) | The additional choices that can be selected to customize the product according to preferences. |
| `skus` * | array of object (ProductVariant) | Product variants SKUs details |
| `metadata` * | object | The data that describes other data, providing details on its creation, format, and context. |
| `booking_details` * | object | The information related to a specific booking, such as date, time, location, and other relevant particulars |
| `categories` * | array of object (Category) | The various sections or attributes that describe a product, such as name, price, description, specifications, and availability. |
| `brand` * | object (Brand) |  |
| `tags` * | array of object |  |
| `scoped_prices` | object |  |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/products), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.available).
