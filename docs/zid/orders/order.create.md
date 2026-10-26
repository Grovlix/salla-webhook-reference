---
title: order.create webhook
description: "Zid order.create webhook: Triggered when a new order is created."
---

# `order.create`

Triggered when a new order is created.

<p dir="rtl" lang="ar">يُرسل عند إنشاء طلب جديد.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [Order](./index.md) |
| Payload model | Order (shared with [`order.status.update`](./order.status.update.md), [`order.payment_status.update`](./order.payment_status.update.md)) |
| JSON Schema | [`schemas/zid/order.create.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/zid/order.create.schema.json) |
| Official docs | [docs.zid.sa/webhook-events-order](https://docs.zid.sa/webhook-events-order) |

## Example payload

Zid doesn't publish full example payloads. This one is assembled from the per-field examples in Zid's schema, so treat it as a guide to the shape, not a captured request.

```json
{
  "id": 25304285,
  "code": "8OVNEhyqcf",
  "store_id": 251073,
  "order_url": "https://zid.store/osama/o/6IJWXOYLuR/inv",
  "store_name": "Osama's Store",
  "shipping_method_code": "custom",
  "store_url": "https://zid.store/osama/",
  "order_status": {
    "name": "Delivery in progress",
    "code": "delivered"
  },
  "currency_code": "KWD",
  "customer": {
    "name": "Osama",
    "email": "example.user@email.com",
    "id": "2083543",
    "mobile": "+966501234567",
    "note": "\" \"",
    "verified": "1",
    "type": "individual"
  },
  "has_different_consignee": false,
  "is_guest_customer": false,
  "is_gift_order": false,
  "gift_card_details": {
    "card_design": "Birthday Theme",
    "gift_message": "Happy Birthday, Ahmed! Wishing you all the best.",
    "media_link": "https://example.com/gift_card_image.jpg",
    "receiver_name": "Ahmed Al-Salem",
    "sender_name": "Fatima Al-Rashed"
  },
  "order_total": "6.00000000000000",
  "order_total_string": "6.00 KWD",
  "has_different_transaction_currency": true,
  "transaction_reference": "TRN-123456",
  "transaction_amount": 60,
  "transaction_amount_string": "60.00 SAR",
  "issue_date": "04-07-2023 | 12:12 م",
  "payment_status": "paid",
  "source": "Store",
  "source_code": "catalog",
  "is_reseller_transaction": false,
  "created_at": "2023-07-04 09:12:36",
  "updated_at": "2023-07-04 09:14:28",
  "requires_shipping": true,
  "shipping": {
    "method": {
      "id": "SHM-123456",
      "name": "Express Delivery",
      "code": "EXP_DEL",
      "estimated_delivery_time": "3-5 Business Days",
      "icon": "https://cdn.example.com/icons/shipping/express_delivery.png",
      "is_system_option": false,
      "waybill": "WB-12345678",
      "waybill_tracking_id": "TRACK-12345678",
      "has_waybill_and_packing_list": false,
      "tracking": {
        "number": "TRACK-12345678",
        "status": "In Transit",
        "url": "https://example.com/track?number=TRACK-12345678"
      },
      "courier": "FedEx",
      "return_shipment": "RET-12345678",
      "inventory_address": [
        "[]"
      ]
    },
    "address": {
      "formatted_address": "Masked Address",
      "street": "Masked Street",
      "district": "Masked District",
      "lat": "24.7136",
      "lng": "46.6753",
      "meta": {
        "buyer": {
          "name": "Ahmed Al-Saud",
          "type": "individual",
          "email": "ahmed@example.sa",
          "telephone": "966501234567"
        }
      },
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
      "country": {
        "id": 184,
        "name": "السعودية",
        "code": "SA",
        "country_code": "SAU",
        "flag": "https://media.zid.store/static/sa.svg"
      }
    }
  },
  "payment": {
    "method": {
      "id": 1,
      "enabled": true,
      "code": "zid_cod",
      "fees": 5,
      "fees_string": "5.00 SAR",
      "type": "zid_cod",
      "name": {
        "en": "Cash on Delivery",
        "ar": "الدفع عند الاستلام"
      },
      "icon": "https://example.com/payment-icon.png",
      "payment_network": "visa"
    },
    "invoice": [
      {
        "code": "sub_totals",
        "value": "30.00000000000000",
        "value_string": "30.00 SAR",
        "title": "قيمة المنتجات"
      }
    ]
  },
  "cod_confirmed": false,
  "reverse_order_label_request": null,
  "customer_note": "أحتاج تغليف هدية",
  "gift_message": "كل عام وأنتم بخير",
  "payment_link": "https://payment.example.sa/order/123456",
  "weight": 500,
  "weight_cost_details": {
    "weight_total": 150,
    "weight_total_string": "150 gm",
    "cost": "1.000 KWD",
    "cost_string": "1 KWD"
  },
  "currency": {
    "order_currency": {
      "id": 4,
      "code": "SAR",
      "exchange_rate": 1
    },
    "order_store_currency": {
      "id": 4,
      "code": "SAR",
      "exchange_rate": null
    }
  },
  "coupon": "SUMMER20",
  "products": {
    "quantity": "2",
    "weight": "150",
    "net_price_with_additions": "50",
    "price_with_additions": "55",
    "parent_name": "سماعات بلوتوث",
    "sku": "Z.3.1726750799757576",
    "custom_fields": [
      "[]"
    ],
    "tax_percentage": "0.12",
    "tax_amount_string_per_item": "0.000 KWD",
    "review_url": "https://mystore.zid.store/products/e23703d4-aa41-4eee-a4a3-35439f788e31/reviews/new"
  },
  "products_count": 1,
  "products_sum_total_string": "30.00 SAR",
  "language": "ar",
  "histories": [
    {
      "order_status_name": "جديد",
      "changed_by_id": 37,
      "changed_by_type": "عميل",
      "changed_by_details": {
        "action": "تم إنشاء الطلب .",
        "by": "Ahmed Al-Saud",
        "comment": "Manually created after size-change request. Check inventory."
      },
      "comment": "تم إنشاء الطلب .",
      "created_at": "2023-07-04 09:12:36",
      "humanized_created_at": "منذ شهر"
    }
  ],
  "is_reactivated": false,
  "return_policy": "Returns are accepted within 14 days of receipt.",
  "packages_count": 1,
  "inventory_address": "123 King Fahd Road, Al Olaya, Riyadh 12212, Saudi Arabia",
  "reseller_meta": null,
  "previous_order": 23874634,
  "next_order": null,
  "invoice_settings": {
    "is_order_notifications_enabled": true
  },
  "comment": "This is a VIP customer. Handle with extra care.",
  "edits_count": "0",
  "options": [
    "[]"
  ],
  "invoice_link": "https://zid-testing-907587157081.s3-accelerate.amazonaws.com/pdf/order_44834593.pdf"
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | The unique identifier for the order. |
| `code` | string | The code associated with the order. |
| `store_id` | integer | The unique identifier for the store where the order was placed. |
| `order_url` | string | The URL link to the order's invoice. |
| `store_name` | string | The name of the store. |
| `shipping_method_code` | string | The code representing the shipping method used for the order. |
| `store_url` | string | The URL link to the store. |
| `order_status` | object (OrderStatus) |  |
| `currency_code` | string | The code representing the currency used for the order. |
| `customer` | object (OrderCustomer) |  |
| `has_different_consignee` | boolean | Indicates if the consignee is different from the customer. |
| `is_guest_customer` | boolean | Indicates if the order was placed by a guest customer. |
| `is_gift_order` | boolean | Indicates if the order is a gift. |
| `gift_card_details` | object | Details of any gift card associated with the order. |
| `order_total` | string | The total amount of the order. |
| `order_total_string` | string | The total amount of the order in a human-readable format. |
| `has_different_transaction_currency` | boolean | Indicates if the transaction currency is different from the order currency. |
| `transaction_reference` | string | The reference number for the transaction. |
| `transaction_amount` | number | The amount of the transaction. |
| `transaction_amount_string` | string | The amount of the transaction in a human-readable format. |
| `issue_date` | string | The date and time when the order was issued. |
| `payment_status` | string | The payment status of the order. 1. `paid`: Payment has successfully completed. 1. `pending`: Payment is still pending or hasn't been made yet. 1. `refunded`: Payment has been refunded to the Customer. 1. `voided`: Payment has been voided or canceled. One of: `paid`, `pending`, `refunded`, `voided`. |
| `payment_status_change` | object | Indicates the most recent change in the payment status of the order, by specifiying the previous (`old`) and the updated (`new`) payment statuses. This field is particularly relevant for [webhook events](https://docs.zid.sa/../docs/webhooks-overview.md#supported-webhook-events) like `order.payment_status.update`. The `new` status will be `paid` for successful payments. The `unpaid` status represents any payment status other than `paid`, including `pending`, `refunded`, and `voided`. This categorization aligns with the merchant's view of payment statuses on the Merchant Dashboard. |
| `source` | string | The human-readable name indicating the source where the order was created.  This field is localized and provides a description of the sale channel, e.g., "Store" or "المتجر الإلكتروني". One of: `Mazeed`, `Mazeed Services`, `Merchant Admin`, `Order Api`, `Store`, `Store App`, `ZidPOS`, `Others`. |
| `source_code` | string | The code indicating the source or channel of the order. This can be one of several predefined values: - **pos**: Point of Sale (typically used in physical stores). - **catalog**: Order was made through a product catalog or online storefront. - **md**. Order was made from the Merchant Dashboard. - **mazeed_marketplace**: Order was made through Mazeed. - **mazeed**: Order was made at the Merchant's Store, but the Customer was redirected from Mazeed to the Merchant's Store. - **mobile_app**: Order was made through the store's mobile application. - **api**: Order was made through an API call, typically from third-party integrations or apps. One of: `pos`, `catalog`, `md`, `mazeed`, `mazeed_marketplace`, `mobile_app`, `api`. |
| `is_reseller_transaction` | boolean | Indicates if the order was made by a reseller intending to sell the products to end consumers, rather than for personal use. |
| `created_at` | string | The date and time when the order was created. |
| `updated_at` | string | The date and time when the order was last updated. |
| `tags` | array of string | Any tags associated with the order. |
| `requires_shipping` | boolean | Indicates if the order requires shipping. |
| `shipping` | object (OrderShipping) |  |
| `payment` | object (OrderPayment) |  |
| `cod_confirmed` | boolean | Indicates if the Cash On Delivery (COD) payment is confirmed. |
| `reverse_order_label_request` | string \| null | Any request for a reverse order label. |
| `customer_note` | string \| null | Any note provided by the customer regarding the order. |
| `gift_message` | string \| null | Any gift message associated with the order. |
| `payment_link` | string \| null | The link for payment, if applicable. |
| `weight` | number | The weight of the order in grams. |
| `weight_cost_details` | object | Details about the cost of the weight of the order. |
| `currency` | object (OrderCurrency) |  |
| `coupon` | string | Any coupon code applied to the order. |
| `products` | object |  |
| `products_count` | integer | The total number of products in the order. |
| `products_sum_total_string` | string | The total sum of all products in the order in a human-readable format. |
| `language` | string | The language used to diplay the order's page. |
| `histories` | array of object (OrderHistory) | A list of historical records associated with the order. |
| `is_reactivated` | boolean | Indicates if the order was previously canceled or closed and has since been reopened or reactivated. |
| `return_policy` | string | A human-readable string describing the return policy of the order. |
| `packages_count` | integer | The number of packages in the order. |
| `inventory_address` | string | The address of the inventory for the order. |
| `reseller_meta` | string \| null | Metadata associated with the reseller. |
| `previous_order` | integer | The ID of the previous order, if any. |
| `next_order` | integer \| null | The ID of the next order, if any. |
| `invoice_settings` | object |  |
| `comment` | string | Any comments or notes about the order. |
| `is_marketplace_order` | boolean | The is_marketplace_order property indicates whether the order originates from a marketplace. When set to true, it signifies that the order was placed through a third-party marketplace platform rather than directly through the store's website. |
| `is_quick_checkout_order` * | boolean | ndicates whether the order was placed using a quick checkout feature. |
| `is_potential_fraud` * | boolean | Flags the order as potentially fraudulent. |
| `is_on_demand` * | boolean | Specifies if the order is part of an on-demand request. |
| `should_merchant_set_shipping_method` * | boolean | Determines whether the merchant must set the shipping method manually. |
| `expected_shipping_method_type` * | null | Specifies the expected type of shipping method for the order. |
| `zidship_ticket_number` * | null | A unique reference number for tracking orders via Zidship. |
| `edits_count` * | string | The number of edits made to the order after its creation. |
| `delivered_at` * | null | Timestamp indicating when the order was delivered. |
| `options` * | array of string | An array of additional options or configurations applied to the product. (e.g., color, size) |
| `invoice_link` * | string | URL to the downloadable PDF invoice for the order. |

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/webhook-events-order), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=order.create).
