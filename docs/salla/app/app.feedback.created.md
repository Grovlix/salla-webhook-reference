---
title: app.feedback.created webhook
description: "Salla app.feedback.created webhook: Triggered when a merchant leaves feedback on your app."
---

# `app.feedback.created`

Triggered when a merchant leaves feedback on your app.

<p dir="rtl" lang="ar">يُرسل عندما يضيف التاجر ملاحظة أو تقييمًا لتطبيقك.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

Salla's published example has a JSON syntax error (a missing comma). It's corrected here.

```json
{
  "event": "app.feedback.created",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "app_name": "Shipping app",
    "description": "App Description",
    "app_type": "app",
    "categories": [
      "Marketing"
    ],
    "rating": "5",
    "rated_by": "الإخلاص-تعديل",
    "comment": "No Comments"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.feedback.created).
