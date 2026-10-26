---
title: app.trial.canceled webhook
description: "Salla app.trial.canceled webhook: Triggered when a store's trial of your app is cancelled."
---

# `app.trial.canceled`

Triggered when a store's trial of your app is cancelled.

<p dir="rtl" lang="ar">يُرسل عند إلغاء الفترة التجريبية لتطبيقك في متجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

```json
{
  "event": "app.trial.canceled",
  "merchant": 74955415,
  "created_at": "2023-07-27 12:32:17",
  "data": {
    "id": 2114981050,
    "app_name": "Shipping App",
    "app_description": "App Description",
    "app_type": "public",
    "categories": [
      "Accounting & Finance"
    ],
    "plan_type": "recurring",
    "plan_name": null,
    "start_date": "2023-07-27",
    "end_date": "2023-07-28",
    "subscription_at": "2023-07-27 12:13:58",
    "created_at": "2023-07-27 12:32:17",
    "features": [],
    "store_type": "live"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.trial.canceled).
