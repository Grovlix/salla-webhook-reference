---
title: app.market.subscription.renew webhook
description: "Zid app.market.subscription.renew webhook: Triggered after a renewal or extension completes. Also fires on free-plan renewal, when a paused subscription resumes, and when a usage-based charge is paid."
---

# `app.market.subscription.renew`

Triggered after a renewal or extension completes. Also fires on free-plan renewal, when a paused subscription resumes, and when a usage-based charge is paid.

<p dir="rtl" lang="ar">يُرسل بعد اكتمال التجديد أو التمديد، وكذلك عند تجديد الخطة المجانية واستئناف الاشتراك المتوقف ودفع رسوم الاستخدام.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.zid.sa/events-878234m0](https://docs.zid.sa/events-878234m0) |

## Example payload

```json
{
  "app_id": 1292,
  "store_id": 507530,
  "store_uuid": "d78468cd-4b44-4fee-a00d-76561f35787c",
  "store_url": "https://wyatt.com.sa/",
  "plan_name": "النمو",
  "status": "renew",
  "start_date": "2025-02-21T08:05:29.000000Z",
  "end_date": "2025-03-22T08:05:29.000000Z",
  "amount_paid": 79.01,
  "old_plan_name": null,
  "merchant_email": "info@ehmp.com.sa",
  "merchant_phone_no": "966554349999",
  "event_name": "app.market.subscription.renew",
  "plan_type": "Paid",
  "plan_id": 904,
  "payment_date": "2025-02-21T08:05:29.000000Z"
}
```

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/events-878234m0), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.market.subscription.renew).
