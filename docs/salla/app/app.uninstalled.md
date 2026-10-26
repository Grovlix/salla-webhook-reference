---
title: app.uninstalled webhook
description: "Salla app.uninstalled webhook: Triggered when your app is uninstalled from a store."
---

# `app.uninstalled`

Triggered when your app is uninstalled from a store.

<p dir="rtl" lang="ar">يُرسل عند إزالة تطبيقك من متجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

```json
{
  "event": "app.uninstalled",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "app_name": "Cool app",
    "app_description": "This App provides a seamless, on-the-go shipping experience for businesses and individuals.",
    "app_type": "shipping",
    "categories": [
      "Shipping and Delivery"
    ],
    "installation_date": "2021-10-06 16:16:49",
    "uninstallation_date": "2021-10-07 12:46:07",
    "refunded": false,
    "store_type": "live"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.uninstalled).
