---
title: customer.merchant.update webhook
description: "Zid customer.merchant.update webhook: Triggered when the merchant updates details related to a customer."
---

# `customer.merchant.update`

Triggered when the merchant updates details related to a customer.

<p dir="rtl" lang="ar">يُرسل عندما يعدّل التاجر بيانات متعلقة بالعميل.</p>

| | |
| --- | --- |
| Platform | Zid |
| Group | [Customer](./index.md) |
| Payload model | Customer (shared with [`customer.create`](./customer.create.md), [`customer.update`](./customer.update.md), [`customer.login`](./customer.login.md)) |
| JSON Schema | [`schemas/zid/customer.merchant.update.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/zid/customer.merchant.update.schema.json) |
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

Generated from [Zid's official documentation](https://docs.zid.sa/webhook-events-customer), fetched 2026-10-26. Found a difference from what Zid actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=customer.merchant.update).
