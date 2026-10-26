---
title: order.shipment.return.cancelled webhook
description: "Salla order.shipment.return.cancelled webhook: Triggered when an order return shipment is cancelled."
---

# `order.shipment.return.cancelled`

Triggered when an order return shipment is cancelled.

<p dir="rtl" lang="ar">يُرسل عند إلغاء شحنة إرجاع الطلب.</p>

| | |
| --- | --- |
| Platform | Salla |
| Group | [Order](./index.md) |
| Payload model | Order Shipment Cancelled Webhook Events Model (shared with [`order.shipment.cancelled`](./order.shipment.cancelled.md)) |
| JSON Schema | [`schemas/salla/order.shipment.return.cancelled.schema.json`](https://github.com/Grovlix/salla-webhook-reference/blob/master/schemas/salla/order.shipment.return.cancelled.schema.json) |
| Official docs | [docs.salla.dev/webhook-events/orders](https://docs.salla.dev/webhook-events/orders) |

## Example payload

Salla publishes one example for this payload model, shown here for `order.shipment.cancelled`. `order.shipment.return.cancelled` uses the same structure.

```json
{
  "event": "order.shipment.cancelled",
  "merchant": 1305146709,
  "created_at": "Sun Jun 26 2022 14:41:11 GMT+0300",
  "data": {
    "id": 1427738113,
    "reference_id": 41030566,
    "shipping_number": "846984645"
  }
}
```

## Fields

Fields marked * are required in the official schema.

| Field | Type | Description |
| --- | --- | --- |
| `event` | string | Event Name One of: `order.shipment.cancelled`, `order.shipment.return.cancelled`. |
| `merchant` | number | Merchant ID who installed the application on their store. Get details on the Merchant via the ID  using the endpoint [here](https://docs.salla.dev/api-8330089) |
| `created_at` | string | Timestamp of webhook creation |
| `data` | object |  |

### `data`

| Field | Type | Description |
| --- | --- | --- |
| `id` | number | Order ID |
| `reference_id` | number | Order refrence ID, that appears to customers in the store. |
| `shipping_number` | string | Shipping Number |

## Source

Generated from [Salla's official documentation](https://docs.salla.dev/webhook-events/orders), fetched 2026-10-26. Found a difference from what Salla actually sends? [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy&title=order.shipment.return.cancelled).
