---
title: Salla app and subscription webhooks
---

# Salla: App and subscription events

<p dir="rtl" lang="ar">أحداث التطبيق والاشتراكات في سلة</p>

These events are about your app itself rather than the store's data. You select them in the Salla Partners portal under your app's webhook settings.

<p dir="rtl" lang="ar">تتعلق هذه الأحداث بتطبيقك نفسه لا ببيانات المتجر، وتختارها من إعدادات الويب هوك لتطبيقك في بوابة شركاء سلة.</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`app.store.authorize`](./app.store.authorize.md) | Triggered when a store authorizes your app's scopes. The payload carries the store's access and refresh tokens. | يُرسل عندما يمنح المتجر تطبيقك الصلاحيات، ويحمل رمزي الوصول والتحديث الخاصين بالمتجر. |
| [`app.installed`](./app.installed.md) | Triggered when your app is installed on a store. | يُرسل عند تثبيت تطبيقك في متجر. |
| [`app.updated`](./app.updated.md) | Triggered when your app is updated. | يُرسل عند تحديث تطبيقك. |
| [`app.uninstalled`](./app.uninstalled.md) | Triggered when your app is uninstalled from a store. | يُرسل عند إزالة تطبيقك من متجر. |
| [`app.trial.started`](./app.trial.started.md) | Triggered when a store starts a trial of your app. | يُرسل عند بدء فترة تجريبية لتطبيقك في متجر. |
| [`app.trial.expired`](./app.trial.expired.md) | Triggered when a store's trial of your app expires. | يُرسل عند انتهاء الفترة التجريبية لتطبيقك في متجر. |
| [`app.trial.canceled`](./app.trial.canceled.md) | Triggered when a store's trial of your app is cancelled. | يُرسل عند إلغاء الفترة التجريبية لتطبيقك في متجر. |
| [`app.subscription.started`](./app.subscription.started.md) | Triggered when a subscription to your app or one of its add-ons starts. | يُرسل عند بدء اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.subscription.expired`](./app.subscription.expired.md) | Triggered when a subscription to your app or one of its add-ons ends. | يُرسل عند انتهاء اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.subscription.canceled`](./app.subscription.canceled.md) | Triggered when a subscription to your app or one of its add-ons is cancelled. | يُرسل عند إلغاء اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.subscription.renewed`](./app.subscription.renewed.md) | Triggered when a subscription to your app or one of its add-ons is renewed. | يُرسل عند تجديد اشتراك في تطبيقك أو في إحدى إضافاته. |
| [`app.feedback.created`](./app.feedback.created.md) | Triggered when a merchant leaves feedback on your app. | يُرسل عندما يضيف التاجر ملاحظة أو تقييمًا لتطبيقك. |
| [`app.settings.updated`](./app.settings.updated.md) | Triggered when a merchant activates or updates your app's settings. | يُرسل عندما يفعّل التاجر إعدادات تطبيقك أو يعدّلها. |

Official page: [docs.salla.dev/partner-apis/app-events](https://docs.salla.dev/partner-apis/app-events)
