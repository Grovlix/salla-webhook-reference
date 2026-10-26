---
title: store.owner.changed webhook
description: "Salla store.owner.changed webhook: Triggered when store ownership moves to another user."
---

# `store.owner.changed`

Triggered when store ownership moves to another user.

<p dir="rtl" lang="ar">يُرسل عند نقل ملكية المتجر إلى مستخدم آخر.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Store](./index.md) |
| Payload model | Store Owner Changed Webhook Event Model |
| JSON Schema | [`schemas/salla/store.owner.changed.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/store.owner.changed.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/store](https://docs.salla.dev/webhook-events/store) |

::: info Note
Documented on Salla's store events page but not in the main events table.
:::

## Example payload

```json
{
  "event": "store.owner.changed",
  "merchant": 1234509876,
  "created_at": "Wed Sep 17 2025 14:57:43 GMT+0300",
  "data": {
    "id": 8114012345,
    "name": "User",
    "mobile": "555555555",
    "mobile_code": "+966",
    "email": "test@gmail.com",
    "avatar": "https://i.ibb.co/jyqRQfQ/avatar-male.webp",
    "role": "user",
    "status": "active",
    "enabled": true
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` * | string | Event title or label to represent the event. One of: `store.owner.changed`. |
| `merchant` * | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` * | string | The date and time when a particular event was created or initiated. |
| `data` * | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` * | number | A unique identifier of the user. |
| `name` * | string | Store owner user first name. |
| `status` * | string | Indicates the current status of the user. One of: `active`, `inactive`, `expired`, `deleted`. |
| `enabled` * | boolean | Indicates whether the user account is enabled or not. |
| `mobile` * | string | Store owner mobile number without the country code. |
| `mobile_code` * | string | The country code for the mobile phone number. |
| `email` * | string | The store owner email address. |
| `avatar` * | string | A URL of the store owner user avatar image. |
| `role` * | string | Role of the store user. One of: `user`, `team`. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/store), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=store.owner.changed).
