---
title: app.market.subscription.active webhook
description: "Zid app.market.subscription.active webhook: Triggered when a subscription becomes active after payment."
---

# `app.market.subscription.active`

Triggered when a subscription becomes active after payment.

<p dir="rtl" lang="ar">يُرسل عند تفعيل الاشتراك بعد الدفع.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [App and subscription](./index.md) |
| Official docs | [docs.zid.sa/events-878234m0](https://docs.zid.sa/events-878234m0) |

## Example payload

**2. Subscription Activated**

```json
{
  "app_id": 1292,
  "store_id": 507530,
  "store_uuid": "d78468cd-4b44-4fee-a00d-76561f35787c",
  "store_url": "https://wyatt.com.sa/",
  "plan_name": "النمو",
  "status": "active",
  "start_date": "2025-02-21T08:05:29.000000Z",
  "end_date": "2025-03-22T08:05:29.000000Z",
  "amount_paid": 79.01,
  "old_plan_name": null,
  "merchant_email": "info@ehmp.com.sa",
  "merchant_phone_no": "966554349999",
  "event_name": "app.market.subscription.active",
  "plan_type": "Paid",
  "plan_id": 904,
  "payment_date": "2025-02-21T08:05:29.000000Z"
}
```

**Example**

```json
{
  "app_id": 6528,
  "store_id": 3104452,
  "store_uuid": "b2052c72-ddaa-411f-a428-748dcd885a6e",
  "store_url": "https://xle6e8.zid.store/",
  "plan_name": "Test Plan With Trial",
  "status": "active",
  "start_date": "2026-06-14T08:05:40.000000Z",
  "end_date": "2026-07-04T08:05:40.000000Z",
  "amount_paid": 0,
  "old_plan_name": null,
  "merchant_email": "bv3e7xxnx5@zam-partner.email",
  "merchant_phone_no": "+201101050117",
  "event_name": "app.market.subscription.active",
  "plan_type": "Free Trial",
  "plan_id": 3329,
  "payment_date": "2026-06-14T08:05:40.000000Z"
}
```

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/events-878234m0), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=app.market.subscription.active).
