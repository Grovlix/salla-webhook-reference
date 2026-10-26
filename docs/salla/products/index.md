---
title: Salla product webhooks
---

# Salla: Product events

<p dir="rtl" lang="ar">أحداث المنتجات في سلة</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`product.created`](./product.created.md) | Triggered when a product is created. | يُرسل عند إضافة منتج جديد. |
| [`product.updated`](./product.updated.md) (deprecated) | Triggered when a product is updated. | يُرسل عند تحديث منتج. |
| [`product.deleted`](./product.deleted.md) | Triggered when a product is deleted. | يُرسل عند حذف منتج. |
| [`product.available`](./product.available.md) (deprecated) | Triggered when a product comes back in stock. | يُرسل عند توفّر المنتج في المخزون من جديد. |
| [`product.quantity.low`](./product.quantity.low.md) | Triggered when a product's stock is low. | يُرسل عند انخفاض كمية المنتج في المخزون. |
| [`product.price.updated`](./product.price.updated.md) | Triggered when a product's price is updated. | يُرسل عند تغيير سعر منتج. |
| [`product.status.updated`](./product.status.updated.md) | Triggered when a product's status changes. | يُرسل عند تغيير حالة منتج. |
| [`product.image.updated`](./product.image.updated.md) | Triggered when a product's images are updated. | يُرسل عند تحديث صور منتج. |
| [`product.category.updated`](./product.category.updated.md) | Triggered when a product's categories are updated. | يُرسل عند تغيير تصنيفات منتج. |
| [`product.brand.updated`](./product.brand.updated.md) | Triggered when a product's brand is updated. | يُرسل عند تغيير ماركة منتج. |
| [`product.tags.updated`](./product.tags.updated.md) | Triggered when a product's tags are updated. | يُرسل عند تحديث وسوم منتج. |
| [`product.channels.changed`](./product.channels.changed.md) | Triggered when the sales channels a product is shown on change. | يُرسل عند تغيير قنوات البيع التي يظهر فيها المنتج. |

Official page: [docs.salla.dev/webhook-events/products](https://docs.salla.dev/webhook-events/products)
