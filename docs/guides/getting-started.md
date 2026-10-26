---
title: Getting started with Salla and Zid webhooks
description: How to subscribe to Salla and Zid webhooks, what a delivery looks like, and how to answer it.
---

# Getting started

<p dir="rtl" lang="ar">كيف تشترك في أحداث الويب هوك في سلة وزد، وكيف تبدو الطلبات التي تصلك، وكيف ترد عليها.</p>

A webhook is an HTTPS `POST` that Salla or Zid sends to your server when something happens in a store: an order is
created, a product changes, your app is installed. Your endpoint reads the JSON body, checks that the request really
came from the platform, and answers `200` quickly.

## Salla

### Subscribe

There are two ways to subscribe:

1. **Partners portal.** In your app's settings on [Salla Partners](https://salla.partners), pick the events your app
   needs and set the webhook URL. Salla registers those webhooks on every store that installs the app. App and
   subscription events (`app.installed`, `app.subscription.started`, and so on) are only available here.
2. **Merchant API.** Call `POST https://api.salla.dev/admin/v2/webhooks/subscribe` with the store's access token.
   See [Register Webhook](https://docs.salla.dev/webhooks/subscribe).

```json
{
  "name": "Order created",
  "event": "order.created",
  "url": "https://example.com/webhooks/salla",
  "version": 2,
  "rule": "payment_method = mada OR price < 50",
  "headers": [{ "key": "X-Custom-Header", "value": "anything" }]
}
```

`version` defaults to `2`. `rule` is optional and filters which events are sent; see
[Conditional Webhooks](https://docs.salla.dev/doc-421120).

### What arrives

Every Salla event uses the same envelope:

```json
{
  "event": "order.created",
  "merchant": 1305146709,
  "created_at": "Tue Jan 25 2022 13:22:11 GMT+0300",
  "data": { }
}
```

`merchant` is the store's ID. `data` depends on the event; each [event page](/salla/) lists its fields.

## Zid

### Subscribe

Store events are created per store through the Merchant API:

```http
POST https://api.zid.sa/v1/managers/webhooks
Authorization: Bearer <partner token>
X-Manager-Token: <store access token>
Content-Type: application/json
```

```json
{
  "event": "order.status.update",
  "target_url": "https://example.com/webhooks/zid",
  "original_id": "your-app-id",
  "conditions": { "status": "delivered" },
  "username": "zid",
  "password": "a-long-random-secret"
}
```

- `conditions` is optional and only works on `order.create` and `order.status.update`. Supported keys are
  `status`, `payment_method` and `delivery_option_id`.
- `username` and `password` are optional. When you set them, Zid sends them as an `Authorization: Basic` header so
  you can check that the request came from Zid. See [Verifying requests](./webhook-security.md#zid).

App and subscription events (`app.market.application.install` and the rest) are set up in the Zid Partner Dashboard,
not through this API. See [Zid app events](/zid/app/).

Full reference: [Create Webhook](https://docs.zid.sa/create-a-webhook).

### What arrives

Zid documents each store event's body as the resource itself (the order, the product, the customer), with no
envelope. App events carry the event name in `event_name`.

## Answering a webhook

Both platforms treat any non-2xx response, or no response in time, as a failure and retry. So:

1. Read the raw body and verify the request ([how](./webhook-security.md)).
2. Store the event or put it on a queue.
3. Return `200` straight away, and do the slow work afterwards.
4. Make processing idempotent. A retry can deliver the same event again.

Retry timings for each platform are in [Retries and troubleshooting](./troubleshooting.md).
