---
title: app.trial.expired webhook
description: "Salla app.trial.expired webhook: Triggered when a store's trial of your app expires."
---

# `app.trial.expired`

Triggered when a store's trial of your app expires.

<p dir="rtl" lang="ar">يُرسل عند انتهاء الفترة التجريبية لتطبيقك في متجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

Salla's published example has a JSON syntax error (a missing comma). It's corrected here.

```json
{
  "event": "app.trial.expired",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "app_name": "Shipping app",
    "description": "App Description",
    "app_type": "app",
    "categories": [
      "Accounting & Finance"
    ],
    "plan_name": "Diamond Plan",
    "plan_type": "one_time",
    "start_date": "2021-10-06T21:00:00.000000Z",
    "end_date": "2021-10-07T21:00:00.000000Z",
    "store_type": "demo"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.trial.expired).
