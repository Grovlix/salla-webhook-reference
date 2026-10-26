---
title: app.updated webhook
description: "Salla app.updated webhook: Triggered when your app is updated."
---

# `app.updated`

Triggered when your app is updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث تطبيقك.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

Salla's published example has a JSON syntax error (a missing comma). It's corrected here.

```json
{
  "event": "app.updated",
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
    "app_scopes": [
      "settings.read",
      "branches.read",
      "offline_access"
    ],
    "installation_date": "2021-10-06 16:16:49",
    "update_date": "2021-10-07 12:31:24",
    "store_type": "demo"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.updated).
