---
title: Verifying Salla and Zid webhook requests
description: How to check that a webhook really came from Salla (signature or token) or Zid (Basic auth).
---

# Verifying requests

<p dir="rtl" lang="ar">كيف تتأكد أن طلب الويب هوك مُرسل فعلًا من سلة (التوقيع أو الرمز) أو من زد (المصادقة الأساسية).</p>

Your webhook URL is public. Anyone who finds it can post a fake `order.created`. Check every request before you act
on it, and reject the ones that fail with `401`.

## Salla

Salla tells you which method it used in the `X-Salla-Security-Strategy` header. New webhooks use `Signature` unless
you choose otherwise.

### Signature (default)

Salla computes an HMAC-SHA256 of the request body with your webhook secret and sends the hex digest in
`X-Salla-Signature`. You find the secret in your app's webhook settings on Salla Partners.

```js
import crypto from 'node:crypto'

function isFromSalla (rawBody, signatureHeader, secret) {
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(String(signatureHeader ?? ''))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
```

Hash the **raw bytes** you received, before any JSON parsing. Salla's own Node.js snippet hashes
`JSON.stringify(req.body)`, which only matches when re-serialising produces byte-for-byte the same JSON; escaped
Arabic text or slashes are enough to break it. Salla's PHP snippet uses the raw body, which is the safe way.

```php
$rawBody = file_get_contents('php://input');
$expected = hash_hmac('sha256', $rawBody, getenv('SALLA_WEBHOOK_SECRET'));
$valid = hash_equals($expected, $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '');
```

### Token

With the `Token` strategy, Salla sends `X-Salla-Security-Strategy: Token` and puts the token in the `Authorization`
header. Compare it with the token shown in your app's settings, using a timing-safe comparison.

Salla's documentation for this strategy is inconsistent: one paragraph says the token arrives in `Authorization`,
another describes a hash in `X-Salla-Signature`. Log the headers of a real delivery once before you rely on either.

Source: [Salla Webhooks, Security Implementation](https://docs.salla.dev/doc-421119).

## Zid

Zid doesn't sign webhook bodies. Instead, when you create a webhook with `username` and `password`, Zid sends
`Authorization: Basic base64(username:password)` with every delivery. Compare that header with the value you expect.

```js
import crypto from 'node:crypto'

function isFromZid (authorizationHeader, username, password) {
  const expected = Buffer.from('Basic ' + Buffer.from(`${username}:${password}`).toString('base64'))
  const received = Buffer.from(String(authorizationHeader ?? ''))
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}
```

If you created the webhook without `username` and `password`, Zid sends nothing you can verify. Create webhooks with
them, and use a long random password per store.

Source: [Zid Create Webhook, Authentication](https://docs.zid.sa/create-a-webhook).

## For both platforms

- Use HTTPS for the webhook URL.
- Keep secrets in environment variables, never in code.
- Treat the payload as a notification. For anything that moves money or stock, fetch the current record from the API
  before acting on it.
