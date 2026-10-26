---
title: abandoned_cart.completed webhook
description: "Zid abandoned_cart.completed webhook: Triggered when an abandoned cart is completed."
---

# `abandoned_cart.completed`

Triggered when an abandoned cart is completed.

<p dir="rtl" lang="ar">يُرسل عند إتمام شراء سلة متروكة.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [Abandoned cart](./index.md) |
| Payload model | AbandonedCartDetailed (shared with [`abandoned_cart.created`](./abandoned_cart.created.md)) |
| JSON Schema | [`schemas/zid/abandoned_cart.completed.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/zid/abandoned_cart.completed.schema.json) |
| Official docs | [docs.zid.sa/webhook-events-abandoned-cart](https://docs.zid.sa/webhook-events-abandoned-cart) |

## Example payload

Zid doesn't publish full example payloads. This one is assembled from the per-field examples in Zid's schema, so treat it as a guide to the shape, not a captured request.

```json
{
  "status": "object",
  "abandoned_cart": {
    "id": "18a40fc6-2381-4ab2-9f72-467e6c39a599",
    "url": "https://store.zidtest.com/checkout/fromBasket/WS56eLg6j2J2KAFB6KkX0B3uJSs3oINu",
    "store_id": "3dfc16e6-ad19-4126-9c2a-5e4a7fb73051",
    "store_name": "Zid Store on Testing",
    "store_logo": "https://zid-testing.s3.eu-west-1.amazonaws.com/3dfc16e6-ad19-4126-9c2a-5e4a7fb73051/d24a04a4-483c-4cfd-937e-35e7f419d127-200x.png",
    "store_url": "https://store.zidtest.com/",
    "products_count": 1,
    "products": [
      {
        "id": 900584062,
        "sku": "HJRMR0500R",
        "price": 239,
        "formatted_sale_price": "1",
        "product_id": "0b00ssx2ee9c3141c4cd0d955dce5deb8c",
        "product URL": "https://storeurl.com/products/0b00ssx2ee9c3141c4cd0d955dce5deb8c",
        "name": "AlSamra honey",
        "custom_field": "[]",
        "price_string": "239.00 SAR",
        "additions_price": 0,
        "additions_price_string": "00.00 SAR",
        "total": "239.00",
        "total_string": "239.00 SAR"
      }
    ],
    "city": {
      "id": 1,
      "national_id": 3,
      "name": "Other",
      "priority": 10,
      "country_id": 184,
      "country_name": "السعودية",
      "country_code": "SA",
      "ar_name": "الرياض",
      "en_name": "Riyadh"
    },
    "history": [
      {
        "abandoned_cart_id": "18a40fc6-2381-4ab2-9f72-467e6c39a599",
        "type": "تم إرسال التذكير",
        "created_at": "2023-07-12T10:17:42.000000Z",
        "updated_at": "2023-07-12T10:17:42.000000Z"
      }
    ],
    "created_at": "2023-07-12 08:17:02",
    "updated_at": "2023-07-19 09:01:18",
    "phase": "payment_method",
    "customer_id": "000000000",
    "customer_name": "test customer name",
    "customer_email": "testemail@gmail.com",
    "customer_mobile": "966555555555",
    "reminders_count": "0",
    "cart_total": "239.00",
    "cart_total_string": "239.00 SAR",
    "source": "catalog"
  },
  "message": {
    "type": "object"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `status` | string | The status of the request. |
| `abandoned_cart` | object | Details of the abandoned cart. |
| `message` | object | Message related to the request status. |

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/webhook-events-abandoned-cart), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=abandoned_cart.completed).
