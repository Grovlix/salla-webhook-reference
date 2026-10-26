---
title: app.trial.started webhook
description: "Salla app.trial.started webhook: Triggered when a store starts a trial of your app."
---

# `app.trial.started`

Triggered when a store starts a trial of your app.

<p dir="rtl" lang="ar">يُرسل عند بدء فترة تجريبية لتطبيقك في متجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

Salla's published example has a JSON syntax error (a missing comma). It's corrected here.

```json
{
  "event": "app.trial.started",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "app_name": "Shipping app",
    "app_description": "App Description",
    "app_type": "app",
    "categories": [
      "Accounting & Finance"
    ],
    "plan_name": "Diamond Plan",
    "plan_type": "one_time",
    "start_date": "2023-07-27",
    "end_date": "2023-07-28",
    "created_at": "2023-07-27 12:23:19",
    "features": [],
    "store_type": "development"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.trial.started).
