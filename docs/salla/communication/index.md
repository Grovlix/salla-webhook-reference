---
title: Salla communication apps webhooks
---

# Salla: Communication apps events

<p dir="rtl" lang="ar">أحداث تطبيقات التواصل في سلة</p>

Only apps registered as communication apps receive these events. Each one carries a `type` (for example `order.status.updated` or `auth.otp.verification`) that says which store notification is being sent.

<p dir="rtl" lang="ar">تصل هذه الأحداث لتطبيقات التواصل فقط. يحمل كل حدث قيمة `type` (مثل `order.status.updated` أو `auth.otp.verification`) توضّح نوع الإشعار المُرسل من المتجر.</p>

| Event | Description | الوصف |
| --- | --- | --- |
| [`communication.sms.send`](./communication.sms.send.md) | Triggered when the store sends an SMS message. | يُرسل عندما يرسل المتجر رسالة SMS. |
| [`communication.email.send`](./communication.email.send.md) | Triggered when the store sends an email. | يُرسل عندما يرسل المتجر بريدًا إلكترونيًا. |
| [`communication.whatsapp.send`](./communication.whatsapp.send.md) | Triggered when the store sends a WhatsApp message. | يُرسل عندما يرسل المتجر رسالة واتساب. |

Official page: [docs.salla.dev/webhook-events/communciation-apps](https://docs.salla.dev/webhook-events/communciation-apps)
