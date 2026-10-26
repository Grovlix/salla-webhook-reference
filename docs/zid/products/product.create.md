---
title: product.create webhook
description: "Zid product.create webhook: Triggered when a new product is created."
---

# `product.create`

Triggered when a new product is created.

<p dir="rtl" lang="ar">يُرسل عند إضافة منتج جديد.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [Product](./index.md) |
| Payload model | Product (shared with [`product.update`](./product.update.md), [`product.publish`](./product.publish.md), [`product.delete`](./product.delete.md)) |
| JSON Schema | [`schemas/zid/product.create.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/zid/product.create.schema.json) |
| Official docs | [docs.zid.sa/webhook-events-product](https://docs.zid.sa/webhook-events-product) |

## Example payload

Zid publishes one example for this payload model, shown here for `another event in this model`. `product.create` uses the same structure.

```json
{
  "id": "157ea0ee-3963-4e3d-ba3b-b9b0f6a50535",
  "product_class": "grouped_product",
  "sku": "Z.1.1234567890",
  "barcode": "",
  "parent_id": null,
  "name": {
    "ar": "NewProduct",
    "en": "NewProduct"
  },
  "slug": "NewProduct",
  "price": 100,
  "short_description": null,
  "sale_price": 90,
  "formatted_price": "100.00  ر.س ",
  "formatted_sale_price": "90.00  ر.س ",
  "currency": "SAR",
  "currency_symbol": " ر.س ",
  "attributes": [],
  "categories": [],
  "display_order": null,
  "has_options": false,
  "has_fields": false,
  "images": [],
  "is_draft": false,
  "quantity": null,
  "is_infinite": true,
  "html_url": "https://zggesq.localhost:8084/products/NewProduct",
  "weight": {
    "value": null,
    "unit": "kg"
  },
  "keywords": [],
  "requires_shipping": true,
  "is_taxable": true,
  "structure": "standalone",
  "seo": {
    "title": {
      "ar": "NewProduct",
      "en": "NewProduct"
    },
    "description": {}
  },
  "rating": {
    "average": 0,
    "total_count": 0,
    "1_ratings": {
      "percentage": 0,
      "count": 0
    },
    "2_ratings": {
      "percentage": 0,
      "count": 0
    },
    "3_ratings": {
      "percentage": 0,
      "count": 0
    },
    "4_ratings": {
      "percentage": 0,
      "count": 0
    },
    "5_ratings": {
      "percentage": 0,
      "count": 0
    }
  },
  "store_id": 1,
  "purchase_restrictions": {
    "min_quantity_per_cart": null,
    "max_quantity_per_cart": null,
    "availability_period_start": null,
    "availability_period_end": null
  },
  "metafields": null,
  "meta": {},
  "badge": {
    "body": {
      "ar": "خصم {discount_percent}",
      "en": "{discount_percent} Discount"
    },
    "icon": {
      "code": "discount_percent"
    }
  },
  "related_products_settings": "AUTO_GENERATED",
  "related_products_title": null,
  "variants": [],
  "options": [],
  "cost": 0,
  "is_published": true,
  "waiting_customers_count": null,
  "description": {},
  "custom_user_input_fields": [],
  "custom_option_fields": [],
  "related_products": [],
  "next_product": null,
  "previous_product": null,
  "group_products": [
    {
      "id": "5f3a844c-0c22-430e-93a6-1932954f6034",
      "item": {
        "id": "371f63f1-7e82-4921-a1e7-f7f02b5573e8",
        "product_class": null,
        "sku": "Z.1.1715508211439691",
        "barcode": "",
        "parent_id": null,
        "name": {
          "ar": "test123",
          "en": "test123"
        },
        "slug": "test123",
        "price": 12,
        "short_description": null,
        "sale_price": null,
        "formatted_price": "12.00  ر.س ",
        "formatted_sale_price": null,
        "currency": "SAR",
        "currency_symbol": " ر.س ",
        "attributes": [],
        "categories": [],
        "display_order": null,
        "has_options": false,
        "has_fields": false,
        "images": [],
        "is_draft": false,
        "quantity": null,
        "is_infinite": true,
        "html_url": "https://zggesq.localhost:8084/products/test123",
        "weight": {
          "value": null,
          "unit": "kg"
        },
        "keywords": [],
        "requires_shipping": true,
        "is_taxable": true,
        "structure": "standalone",
        "seo": {
          "title": {
            "ar": "test123",
            "en": "test123"
          },
          "description": {}
        },
        "rating": {
          "average": 0,
          "total_count": 0,
          "1_ratings": {
            "percentage": 0,
            "count": 0
          },
          "2_ratings": {
            "percentage": 0,
            "count": 0
          },
          "3_ratings": {
            "percentage": 0,
            "count": 0
          },
          "4_ratings": {
            "percentage": 0,
            "count": 0
          },
          "5_ratings": {
            "percentage": 0,
            "count": 0
          }
        },
        "store_id": 1,
        "purchase_restrictions": {
          "min_quantity_per_cart": null,
          "max_quantity_per_cart": null,
          "availability_period_start": null,
          "availability_period_end": null
        },
        "metafields": null,
        "meta": null,
        "badge": null,
        "related_products_settings": "AUTO_GENERATED",
        "related_products_title": null,
        "created_at": "2024-05-12T10:03:31.440247Z",
        "updated_at": "2024-05-20T08:14:45.821898Z",
        "options": [],
        "group_products": null,
        "stocks": [
          {
            "id": "95aaf1a8-1c8a-4e6e-8d90-6b12638856bc",
            "location": {
              "id": "904afcec-dacf-449d-b892-fd7a5cbbf6c9",
              "name": {
                "ar": "لحوم ساقية الرياض"
              },
              "type": "PHYSICAL"
            },
            "available_quantity": null,
            "is_infinite": true
          }
        ]
      },
      "origin_product_id": "157ea0ee-3963-4e3d-ba3b-b9b0f6a50535",
      "item_id": "371f63f1-7e82-4921-a1e7-f7f02b5573e8",
      "item_quantity": 2,
      "in_stock": false
    },
    {
      "id": "9801f935-82b0-410c-ae35-6e06a6e64575",
      "item": {
        "id": "f1965956-b6ba-47a8-a91f-a18440495a12",
        "product_class": null,
        "sku": "Z.1.17146366424425128",
        "barcode": "",
        "parent_id": null,
        "name": {
          "ar": "TestNew",
          "en": "TestNew"
        },
        "slug": "testnew",
        "price": 1,
        "short_description": null,
        "sale_price": null,
        "formatted_price": "1.00  ر.س ",
        "formatted_sale_price": null,
        "currency": "SAR",
        "currency_symbol": " ر.س ",
        "attributes": [],
        "categories": [],
        "display_order": null,
        "has_options": false,
        "has_fields": false,
        "images": [],
        "is_draft": false,
        "quantity": null,
        "is_infinite": true,
        "html_url": "https://zggesq.localhost:8084/products/testnew",
        "weight": {
          "value": null,
          "unit": "kg"
        },
        "keywords": [],
        "requires_shipping": true,
        "is_taxable": true,
        "structure": "standalone",
        "seo": {
          "title": {
            "ar": "TestNew",
            "en": "TestNew"
          },
          "description": {}
        },
        "rating": {
          "average": 0,
          "total_count": 0,
          "1_ratings": {
            "percentage": 0,
            "count": 0
          },
          "2_ratings": {
            "percentage": 0,
            "count": 0
          },
          "3_ratings": {
            "percentage": 0,
            "count": 0
          },
          "4_ratings": {
            "percentage": 0,
            "count": 0
          },
          "5_ratings": {
            "percentage": 0,
            "count": 0
          }
        },
        "store_id": 1,
        "purchase_restrictions": {
          "min_quantity_per_cart": null,
          "max_quantity_per_cart": null,
          "availability_period_start": null,
          "availability_period_end": null
        },
        "metafields": null,
        "meta": null,
        "badge": null,
        "related_products_settings": "AUTO_GENERATED",
        "related_products_title": null,
        "created_at": "2024-05-02T07:57:22.442860Z",
        "updated_at": "2024-05-20T08:16:21.995611Z",
        "options": [],
        "group_products": null,
        "stocks": [
          {
            "id": "b152dc0f-73f1-4620-a310-e8d72bd370a6",
            "location": {
              "id": "904afcec-dacf-449d-b892-fd7a5cbbf6c9",
              "name": {
                "ar": "لحوم ساقية الرياض"
              },
              "type": "PHYSICAL"
            },
            "available_quantity": null,
            "is_infinite": true
          }
        ]
      },
      "origin_product_id": "157ea0ee-3963-4e3d-ba3b-b9b0f6a50535",
      "item_id": "f1965956-b6ba-47a8-a91f-a18440495a12",
      "item_quantity": 3,
      "in_stock": false
    }
  ],
  "stocks": [
    {
      "id": "fe1e47bf-3fa5-4240-8cbe-66c07e4608a7",
      "location": {
        "id": "904afcec-dacf-449d-b892-fd7a5cbbf6c9",
        "name": {
          "ar": "لحوم ساقية الرياض"
        },
        "type": "PHYSICAL"
      },
      "available_quantity": null,
      "is_infinite": true
    }
  ],
  "sold_products_count": null,
  "created_at": "2024-05-22T13:32:42.047362Z",
  "updated_at": "2024-05-22T13:32:42.047380Z"
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `id` | null | Unique identifier for the product. (Set to null if is_external_product is true) |
| `product_class` | string | Set to "grouped_product" to indicate it's a group of sub-products. |
| `sku` | string | Stock Keeping Unit - unique identifier that allows a product to be tracked for inventory purposes. |
| `barcode` | string | This field allows you to specify a barcode associated with the product, if applicable. |
| `parent_id` | null | Unique identifier for the parent product, if any. This product could be a variant of the parent product. (Set to null if is_external_product is true) |
| `name` | object | Localized product name in Arabic (ar) and English (en). |
| `slug` | string | SEO friendly URL, usually derived from the product name. |
| `price` | integer | Base price of the grouped product (100.0). |
| `short_description` | null | This field is optional and can be used to provide a brief description of the product. |
| `sale_price` | integer | If the product is on sale, this field specifies the discounted price in the smallest currency unit. |
| `formatted_price` | string | This field contains the base price formatted according to the currency settings. |
| `formatted_sale_price` | string | If applicable, this field holds the formatted discounted price. |
| `currency` | string |  |
| `currency_symbol` | string | Shows the currency type. |
| `attributes` | array of object |  |
| `display_order` | null | This field is currently unused but might be reserved for future functionalities related to product display order. |
| `has_options` | boolean | This flag indicates whether the product has options (variations) available. (e.g., different sizes or colors). |
| `has_fields` | boolean | This flag signifies whether the product has custom form fields associated with it. |
| `images` | array of object | This array stores information about the product images. |
| `is_draft` | boolean | Indicates if the product is a draft (False - published). |
| `quantity` | null | Shows the quanitity of the product. |
| `is_infinite` | boolean |  |
| `html_url` | string | This field contains the URL for the product page on your storefront. |
| `weight` | object | Weight of the product. |
| `keywords` | array of object | This array allows you to define a list of relevant keywords associated with the product for better search optimization. |
| `requires_shipping` | boolean |  |
| `is_taxable` | boolean | Indicates if the product is taxable. |
| `structure` | string |  |
| `seo` | object | SEO-related data for the product. |
| `rating` | object | This object provides average product rating information. |
| `store_id` | integer | Unique identifier of the store in which the product is listed. |
| `purchase_restrictions` | object |  |
| `metafields` | null |  |
| `meta` | object |  |
| `badge` | object |  |
| `related_products_settings` | string |  |
| `related_products_title` | null |  |
| `variants` | array of object |  |
| `options` | array of object |  |
| `cost` | integer |  |
| `is_published` | boolean | Indicates if the product is published and visible (true). |
| `waiting_customers_count` | null |  |
| `description` | object |  |
| `custom_user_input_fields` | array of object |  |
| `custom_option_fields` | array of object |  |
| `related_products` | array of object |  |
| `next_product` | null |  |
| `previous_product` | null |  |
| `group_products` | array of object | An array of objects representing the sub-products included in the grouped product. Only required when product_class is set to "grouped_product". Refer to the Update Existing Product documentation for details on the "group_products" fields. |
| `stocks` | array of object | This array provides details about product stock. |
| `sold_products_count` | null |  |
| `created_at` | string | Date and time the product was created. |
| `updated_at` | string | Date and time the product was last updated. |
| `is_external_product` | boolean | This property is used to indicate whether the product is sourced externally. |

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/webhook-events-product), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=product.create).
