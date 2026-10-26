---
title: customer.update webhook
description: "Zid customer.update webhook: Triggered when a customer's details are updated."
---

# `customer.update`

Triggered when a customer's details are updated.

<p dir="rtl" lang="ar">يُرسل عند تحديث بيانات عميل.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [Customer](./index.md) |
| Payload model | Customer (shared with [`customer.create`](./customer.create.md), [`customer.merchant.update`](./customer.merchant.update.md), [`customer.login`](./customer.login.md)) |
| JSON Schema | [`schemas/zid/customer.update.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/zid/customer.update.schema.json) |
| Official docs | [docs.zid.sa/webhook-events-customer](https://docs.zid.sa/webhook-events-customer) |

## Example payload

Zid doesn't publish full example payloads. This one is assembled from the per-field examples in Zid's schema, so treat it as a guide to the shape, not a captured request.

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john.doe@zid.sa",
  "telephone": "+962785134221",
  "gender": "male",
  "birth_date": "1990-01-01"
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer |  |
| `name` | string |  |
| `email` | string |  |
| `telephone` | string |  |
| `gender` | string |  |
| `birth_date` | string |  |
| `is_active` | boolean |  |

## Source

Generated from [Zid's official documentation](https://docs.zid.sa/webhook-events-customer), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=customer.update).
