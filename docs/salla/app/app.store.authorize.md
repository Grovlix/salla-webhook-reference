---
title: app.store.authorize webhook
description: "Salla app.store.authorize webhook: Triggered when a store authorizes your app's scopes. The payload carries the store's access and refresh tokens."
---

# `app.store.authorize`

Triggered when a store authorizes your app's scopes. The payload carries the store's access and refresh tokens.

<p dir="rtl" lang="ar">يُرسل عندما يمنح المتجر تطبيقك الصلاحيات، ويحمل رمزي الوصول والتحديث الخاصين بالمتجر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events) |

## Example payload

```json
{
  "event": "app.store.authorize",
  "merchant": 1234509876,
  "created_at": "2022-12-31 12:31:25",
  "data": {
    "access_token": "KGsnBcNNkR2AgHnrd0U9lCIjrUiukF_-Fb8OjRiEcog.NuZv_mJaB46jA2OHaxxxx",
    "expires": 1634819484,
    "refresh_token": "fWcceFWF9eFH4yPVOCaYHy-UolnU7iJNDH-dnZwakUE.bpSNQCNjbNg6hTxxxx",
    "scope": "settings.read branches.read offline_access",
    "token_type": "bearer"
  }
}
```

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/partner-apis/app-events), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.store.authorize).
