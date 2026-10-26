---
title: app.settings.updated webhook
description: "Salla app.settings.updated webhook: Triggered when a merchant activates or updates your app's settings."
---

# `app.settings.updated`

Triggered when a merchant activates or updates your app's settings.

<p dir="rtl" lang="ar">يُرسل عندما يفعّل التاجر إعدادات تطبيقك أو يعدّلها.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

```json
{
  "event": "app.settings.updated",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "app_name": "Shipping app",
    "app_description": "App Description",
    "app_type": "public",
    "settings": {
      "name": "Mohammed",
      "email": "Mohammed@Gmail.com",
      "subscription_num": 375853796,
      "door_to_door": true,
      "pickup_time": "09:00:00",
      "box_size": [
        "25x25",
        "10x10"
      ],
      "ads_activated": "true"
    }
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.settings.updated).
