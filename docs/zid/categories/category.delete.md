---
title: category.delete webhook
description: "Zid category.delete webhook: Triggered when a category is deleted."
---

# `category.delete`

Triggered when a category is deleted.

<p dir="rtl" lang="ar">يُرسل عند حذف تصنيف.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [Product category](./index.md) |
| Payload model | ProductCategory (shared with [`category.create`](./category.create.md), [`category.update`](./category.update.md)) |
| JSON Schema | [`schemas/zid/category.delete.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/zid/category.delete.schema.json) |
| Official docs | [docs.zid.sa/webhook-events-product-category](https://docs.zid.sa/webhook-events-product-category) |

## Example payload

Zid doesn't publish full example payloads. This one is assembled from the per-field examples in Zid's schema, so treat it as a guide to the shape, not a captured request.

```json
{
  "id": 875210,
  "name": "Sport Shoes",
  "slug": "sport-shoes",
  "SEO_category_title": "Sport Shoes - Run with Comfort",
  "SEO_category_description": "Our selection of sport shoes offers the best in comfort and performance for your athletic needs.",
  "names": {
    "en": "Sport Shoes",
    "ar": "أحذية رياضية"
  },
  "description": {
    "en": "Featuring a range of sport shoes for every sport from running to football.",
    "ar": "مجموعة متنوعة من الأحذية الرياضية لكل الرياضات من الجري إلى كرة القدم."
  },
  "url": "https://example.zid.store/categories/875210/sport-shoes",
  "image": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0-260x260.png",
  "image_full_size": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0.png",
  "img_alt_text": "Sport shoes collection",
  "cover_image": "https://media.zid.store/example-store/94b62e84-4ee3-4bfb-9833-6de53e2b8e1a.png",
  "image_full": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0.png",
  "products_count": 120,
  "sub_categories": [
    {
      "id": 875210,
      "name": "Sport Shoes",
      "slug": "sport-shoes",
      "SEO_category_title": "Sport Shoes - Run with Comfort",
      "SEO_category_description": "Our selection of sport shoes offers the best in comfort and performance for your athletic needs.",
      "names": {
        "en": "Sport Shoes",
        "ar": "أحذية رياضية"
      },
      "description": {
        "en": "Featuring a range of sport shoes for every sport from running to football.",
        "ar": "مجموعة متنوعة من الأحذية الرياضية لكل الرياضات من الجري إلى كرة القدم."
      },
      "url": "https://example.zid.store/categories/875210/sport-shoes",
      "image": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0-260x260.png",
      "image_full_size": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0.png",
      "img_alt_text": "Sport shoes collection",
      "cover_image": "https://media.zid.store/example-store/94b62e84-4ee3-4bfb-9833-6de53e2b8e1a.png",
      "image_full": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0.png",
      "products_count": 120,
      "sub_categories": [
        {
          "id": 875210,
          "name": "Sport Shoes",
          "slug": "sport-shoes",
          "SEO_category_title": "Sport Shoes - Run with Comfort",
          "SEO_category_description": "Our selection of sport shoes offers the best in comfort and performance for your athletic needs.",
          "names": {
            "en": "Sport Shoes",
            "ar": "أحذية رياضية"
          },
          "description": {
            "en": "Featuring a range of sport shoes for every sport from running to football.",
            "ar": "مجموعة متنوعة من الأحذية الرياضية لكل الرياضات من الجري إلى كرة القدم."
          },
          "url": "https://example.zid.store/categories/875210/sport-shoes",
          "image": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0-260x260.png",
          "image_full_size": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0.png",
          "img_alt_text": "Sport shoes collection",
          "cover_image": "https://media.zid.store/example-store/94b62e84-4ee3-4bfb-9833-6de53e2b8e1a.png",
          "image_full": "https://media.zid.store/example-store/75decdde-4e94-45fe-8eb1-1edf4ead3ff0.png",
          "products_count": 120,
          "parent_id": null,
          "flat_name": "Sport Shoes",
          "is_published": true
        }
      ],
      "parent_id": null,
      "flat_name": "Sport Shoes",
      "is_published": true
    }
  ],
  "parent_id": null,
  "flat_name": "Sport Shoes",
  "is_published": true
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Unique identifier for the category |
| `name` | string | Name of the category |
| `slug` | string | URL-friendly version of the category name |
| `SEO_category_title` | string | SEO optimized title for the category |
| `SEO_category_description` | string | SEO optimized description for the category |
| `names` | object | Category names in different languages |
| `description` | object | Category descriptions in different languages |
| `url` | string | URL of the category on the web store |
| `image` | string | URL of the category's image (thumbnail size) |
| `image_full_size` | string | URL of the category's image (full size) |
| `img_alt_text` | string | Alternative text for the image for accessibility and SEO |
| `cover_image` | string | URL of the category's cover image |
| `image_full` | string | Full sized category image |
| `products_count` | integer | Number of products under the category |
| `sub_categories` | array of object (ProductCategory) | List of sub-categories under this category. Empty if no sub-categories exist. |
| `parent_id` | integer \| null | ID of the parent category. `Null` if this is a top-level category. |
| `flat_name` | string | Flat representation of the category name |
| `is_published` | boolean | Flag indicating if the category is currently published and visible on the store |

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/webhook-events-product-category), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=category.delete).
