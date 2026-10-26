---
title: app.market.subscription.expired webhook
description: "Zid app.market.subscription.expired webhook: Triggered 5 days after a recurring subscription ends, or 30 days after a usage-based charge became overdue."
---

# `app.market.subscription.expired`

Triggered 5 days after a recurring subscription ends, or 30 days after a usage-based charge became overdue.

<p dir="rtl" lang="ar">يُرسل بعد 5 أيام من انتهاء الاشتراك الدوري، أو بعد 30 يومًا من تأخر دفع رسوم الاستخدام.</p>

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
  "status": "expired",
  "start_date": "2025-02-21T08:05:29.000000Z",
  "end_date": "2025-03-22T08:05:29.000000Z",
  "amount_paid": 79.01,
  "old_plan_name": null,
  "merchant_email": "info@ehmp.com.sa",
  "merchant_phone_no": "966554349999",
  "event_name": "app.market.subscription.expired",
  "plan_type": "Paid",
  "plan_id": 904,
  "payment_date": "2025-02-21T08:05:29.000000Z"
}
```

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/events-878234m0), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.market.subscription.expired).
