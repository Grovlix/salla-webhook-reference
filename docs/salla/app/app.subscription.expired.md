---
title: app.subscription.expired webhook
description: "Salla app.subscription.expired webhook: Triggered when a subscription to your app or one of its add-ons ends."
---

# `app.subscription.expired`

Triggered when a subscription to your app or one of its add-ons ends.

<p dir="rtl" lang="ar">يُرسل عند انتهاء اشتراك في تطبيقك أو في إحدى إضافاته.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

**Payload (App subscription)**

```json
{
  "event": "app.subscription.expired",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "subscription_id": 1510766049,
    "item_type": "plan",
    "item_slug": null,
    "quantity": 1,
    "app_name": "Shipping app",
    "description": "App Description",
    "app_type": "app",
    "categories": [
      "Marketing"
    ],
    "plan_type": "recurring",
    "plan_name": null,
    "plan_period": "1",
    "start_date": "2021-10-09T21:00:00.000000Z",
    "end_date": "2021-11-09T21:00:00.000000Z",
    "coupon": {
      "name": "SPZGRDFS",
      "amount": "0.15"
    },
    "initialization_cost": 10,
    "price_before_discount": 5,
    "price": "20.00",
    "tax": "0.15",
    "tax_value": "3.00",
    "total": "23.00",
    "subscription_balance": "null",
    "features": [
      {
        "key": "Feature1",
        "quantity": 1
      },
      {
        "key": "Feature3",
        "quantity": 5
      }
    ],
    "store_type": "live"
  }
}
```

**Payload (Addon subscription)**

```json
{
  "event": "app.subscription.expired",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "subscription_id": 1510766049,
    "item_type": "addon",
    "item_slug": "addon_chat_support",
    "quantity": 3,
    "app_name": "Shipping app",
    "description": "App Description",
    "app_type": "app",
    "categories": [
      "Marketing"
    ],
    "plan_type": "recurring",
    "plan_name": "Addon Chat Support",
    "plan_period": "1",
    "start_date": "2021-10-09T21:00:00.000000Z",
    "end_date": "2021-12-09T21:00:00.000000Z",
    "coupon": {
      "name": "SPZGRDFS",
      "amount": "0.15"
    },
    "initialization_cost": 10,
    "price_before_discount": null,
    "price": "20.00",
    "tax": "0.15",
    "tax_value": "3.00",
    "total": "23.00",
    "subscription_balance": "null",
    "features": [
      {
        "key": "Feature1",
        "quantity": 1
      },
      {
        "key": "Feature3",
        "quantity": 5
      }
    ],
    "store_type": "live"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.subscription.expired).
