---
title: wallet.action webhook
description: "Salla wallet.action webhook: Triggered when a customer wallet transaction is made."
---

# `wallet.action`

Triggered when a customer wallet transaction is made.

<p dir="rtl" lang="ar">يُرسل عند تنفيذ عملية على محفظة العميل.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Customer wallet](./index.md) |
| Payload model | Customer Wallet Webhook Event Model |
| JSON Schema | [`schemas/salla/wallet.action.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/wallet.action.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/customer-wallet](https://docs.salla.dev/webhook-events/customer-wallet) |

## Example payload

Salla's published example has a JSON syntax error (a missing comma). It's corrected here.

```json
{
  "event": "wallet.action",
  "merchant": 1540043194,
  "created_at": "Thu Jul 02 2026 16:04:49 GMT+0300",
  "data": {
    "transaction_type": "withdraw",
    "amount": 20,
    "action_type": "merchant_manual_entry",
    "created_at": {
      "date": "2026-07-02 16:04:47.505700",
      "timezone_type": 3,
      "timezone": "Asia/Riyadh"
    },
    "expiry_at": null,
    "notes": "deduct note",
    "customer": {
      "id": 1736803527,
      "name": "Mohammad Atamimi",
      "mobile": "+966511231233",
      "email": "customer@customer.com",
      "avatar": "https://cdn.assets.salla.network/beta/admin/026ee41957390da30791147a05da80c6/cp/assets/images/avatar_male.png",
      "country": "Saudi Arabia",
      "city": "الرياض"
    }
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `wallet.action`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object (CustomerWalletWebhook) |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `transaction_type` | string | Whether the wallet balance was added or deducted. One of: `withdraw`, `deposit`. |
| `amount` | integer | Transaction amount. |
| `action_type` | string | Reason for the wallet transaction. One of: `partner_api`, `refund`, `merchant_manual_entry`, `withdraw_balance`, `cashback`, `purchase_by_wallet`, `expiry_deduction`. |
| `created_at` | object | Transaction creation date and timezone. |
| `expiry_at` | string | Expiration date, if applicable. |
| `notes` | string | Additional transaction notes. |
| `customer` | object | Customer associated with the transaction. |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/customer-wallet), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=wallet.action).
