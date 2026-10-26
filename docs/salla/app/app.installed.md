---
title: app.installed webhook
description: "Salla app.installed webhook: Triggered when your app is installed on a store."
---

# `app.installed`

Triggered when your app is installed on a store.

<p dir="rtl" lang="ar">يُرسل عند تثبيت تطبيقك في متجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

Salla's published example has a JSON syntax error (a missing comma). It's corrected here.

```json
{
  "event": "app.installed",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "id": 6789012345,
    "app_name": "Shipping app",
    "description": "App Description",
    "app_type": "app",
    "app_scopes": [
      "settings.read",
      "customers.read_write",
      "orders.read_write",
      "carts.read",
      "branches.read_write",
      "categories.read_write",
      "brands.read_write",
      "products.read_write",
      "webhooks.read_write",
      "payments.read",
      "taxes.read_write",
      "specialoffers.read_write",
      "countries.read",
      "metadata.read_write",
      "offline_access"
    ],
    "installation_date": "2021-09-28 06:06:56",
    "store_type": "development"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.installed).
