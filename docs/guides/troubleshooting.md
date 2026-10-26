---
title: Salla and Zid webhook retries and troubleshooting
description: Timeouts, retry schedules, Zid's webhook health states, and what to check when webhooks stop arriving.
---

# Retries and troubleshooting

<p dir="rtl" lang="ar">مهلة الاستجابة وجدول إعادة المحاولة وحالات صحة الويب هوك في زد، وما تفحصه عندما تتوقف الطلبات عن الوصول.</p>

## Timeouts and retries

| | Salla | Zid |
| --- | --- | --- |
| Timeout | About 30 seconds to connect and respond | Not documented |
| Retries | 3, about 5 minutes apart | 3, after 1, 5 and 15 minutes |
| Counts as failure | No successful response | Non-2xx response, timeout or connection error |
| After repeated failures | Not documented | The webhook is marked degraded, then broken (below) |

Sources: [Salla Webhooks](https://docs.salla.dev/doc-421119), [Zid Webhook Health Tracking](https://docs.zid.sa/webhook-health-tracking-2197281m0).

## Zid webhook health

Zid counts failed deliveries per webhook over a sliding 60-minute window:

- **10 or more failures:** the webhook becomes `degraded`.
- **30 or more failures:** it becomes `broken`. Zid stops sending to it, drops pending events, and emails you a
  CSV of broken webhooks (subject: "Action Required: Your webhook endpoints are failing").
- **Any successful delivery** resets the count and returns it to `healthy`.

A broken webhook stays broken until you recover it through the API, with a new target URL. The
[Health Summary](https://docs.zid.sa/health-summary-37247358e0),
[Broken Webhooks](https://docs.zid.sa/broken-webhooks-37378513e0) and
[Recover Broken Webhooks](https://docs.zid.sa/recover-broken-webhooks-37378520e0) endpoints cover this.

## Webhooks aren't arriving

1. **Check the subscription exists.** Salla: [List Active Webhooks](https://docs.salla.dev/webhooks/active). Zid:
   [List Webhooks](https://docs.zid.sa/list-of-webhooks), and the health summary above.
2. **Check scopes.** On Salla the app needs the webhooks read/write scope, plus read access to the resource
   (orders, products and so on).
3. **Point the webhook at a request bin** such as [webhook.site](https://webhook.site) and trigger the event in a
   development store. If it arrives there, the problem is your server.
4. **Check the event name.** Names differ between the platforms (`order.created` on Salla, `order.create` on Zid) and
   some Salla names don't follow the pattern (`abandoned.cart`, `review.added`, `specialoffer.created`).

## Signature checks keep failing (Salla)

- You're hashing parsed-and-reserialised JSON instead of the raw body. See
  [Verifying requests](./webhook-security.md#signature-default).
- The secret is from a different app, or from before you regenerated it.
- The webhook uses the `Token` strategy, not `Signature`. Check `X-Salla-Security-Strategy`.

## The payload doesn't match these docs

These pages are generated from the platforms' published schemas and examples, which are sometimes behind what is
actually sent. Log the raw body you receive, and
[open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy) with the event name
and the difference (remove customer data first).
