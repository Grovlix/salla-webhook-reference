---
title: customer.otp.request webhook
description: "Salla customer.otp.request webhook: Triggered when a customer requests a one-time password."
---

# `customer.otp.request`

Triggered when a customer requests a one-time password.

<p dir="rtl" lang="ar">يُرسل عند طلب العميل رمز تحقق لمرة واحدة (OTP).</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Customer](./index.md) |
| Payload model | Customers OTP (One-Time Password) Webhook Event Model |
| JSON Schema | [`schemas/salla/customer.otp.request.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/customer.otp.request.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/customers](https://docs.salla.dev/webhook-events/customers) |

## Example payload

```json
{
  "event": "customer.otp.request",
  "merchant": 1029864349,
  "created_at": "Wed Jun 30 2021 12:09:11 GMT+0300",
  "data": {
    "code": "5331",
    "contact": "+96652318526"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | A label or title used to identify a specific event. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | The date and time when a particular event was created or initiated. |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `code` | string | OTP Code, a temporary and unique numeric or alphanumeric code generated for the purpose of verification. |
| `contact` | string | Option for contact method using phone number or email address . |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/customers), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=customer.otp.request).
