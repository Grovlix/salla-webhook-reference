---
title: Zid app and subscription webhooks
---

# Zid: App and subscription events

<p dir="rtl" lang="ar">أحداث التطبيق والاشتراكات في زد</p>

These events are about your app itself rather than the store's data. You subscribe to them in the Zid Partner Dashboard, not through the Create Webhook API. The payload names the event in `event_name`; use that to tell events apart, not `status`. Identify the store by `store_uuid`.

<p dir="rtl" lang="ar">تتعلق هذه الأحداث بتطبيقك نفسه، وتشترك فيها من لوحة شركاء زد لا من واجهة إنشاء الويب هوك. يأتي اسم الحدث في الحقل `event_name`، فاعتمد عليه للتمييز بين الأحداث بدلًا من `status`، وحدّد المتجر عبر `store_uuid`.</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`app.market.application.authorized`](./app.market.application.authorized.md) | Triggered when a merchant grants your app its permissions, before installing. | يُرسل عندما يمنح التاجر تطبيقك الصلاحيات قبل التثبيت. |
| [`app.market.application.install`](./app.market.application.install.md) | Triggered when a merchant installs your app. | يُرسل عند تثبيت التاجر لتطبيقك. |
| [`app.market.application.uninstall`](./app.market.application.uninstall.md) | Triggered when a merchant removes your app. Zid revokes your tokens for that store at the same time, so this is the only reliable uninstall signal. | يُرسل عند إزالة التاجر لتطبيقك. تلغي زد رموز الوصول لهذا المتجر في الوقت نفسه، لذا هذا الحدث هو الطريقة الموثوقة الوحيدة لمعرفة الإزالة. |
| [`app.market.application.rated`](./app.market.application.rated.md) | Triggered when a merchant rates or reviews your app. | يُرسل عند تقييم التاجر لتطبيقك أو كتابة مراجعة. |
| [`app.market.private.plan.request`](./app.market.private.plan.request.md) | Triggered when a merchant requests a private plan. | يُرسل عند طلب التاجر خطة خاصة. |
| [`app.market.subscription.active`](./app.market.subscription.active.md) | Triggered when a subscription becomes active after payment. | يُرسل عند تفعيل الاشتراك بعد الدفع. |
| [`app.market.subscription.warning`](./app.market.subscription.warning.md) | Triggered 3 days before a recurring subscription ends, or 30 days after a usage-based charge is left unpaid. | يُرسل قبل انتهاء الاشتراك الدوري بثلاثة أيام، أو بعد 30 يومًا من بقاء رسوم الاستخدام دون دفع. |
| [`app.market.subscription.suspended`](./app.market.subscription.suspended.md) | Triggered 1 day after a recurring subscription ends. | يُرسل بعد يوم واحد من انتهاء الاشتراك الدوري. |
| [`app.market.subscription.expired`](./app.market.subscription.expired.md) | Triggered 5 days after a recurring subscription ends, or 30 days after a usage-based charge became overdue. | يُرسل بعد 5 أيام من انتهاء الاشتراك الدوري، أو بعد 30 يومًا من تأخر دفع رسوم الاستخدام. |
| [`app.market.subscription.renew`](./app.market.subscription.renew.md) | Triggered after a renewal or extension completes. Also fires on free-plan renewal, when a paused subscription resumes, and when a usage-based charge is paid. | يُرسل بعد اكتمال التجديد أو التمديد، وكذلك عند تجديد الخطة المجانية واستئناف الاشتراك المتوقف ودفع رسوم الاستخدام. |
| [`app.market.subscription.upgrade`](./app.market.subscription.upgrade.md) | Triggered when a merchant moves to a different plan. | يُرسل عند انتقال التاجر إلى خطة أخرى. |
| [`app.market.subscription.refunded`](./app.market.subscription.refunded.md) | Triggered when a payment is refunded to the merchant. | يُرسل عند استرداد مبلغ مدفوع للتاجر. |

Official page: [docs.zid.sa/events-878234m0](https://docs.zid.sa/events-878234m0)
