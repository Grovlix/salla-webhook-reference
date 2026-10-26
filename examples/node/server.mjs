// Minimal Salla + Zid webhook receiver with no dependencies.
//   SALLA_WEBHOOK_SECRET=... ZID_WEBHOOK_USER=... ZID_WEBHOOK_PASSWORD=... node server.mjs
// Salla: POST /webhooks/salla   Zid: POST /webhooks/zid

import http from 'node:http'
import crypto from 'node:crypto'

const { SALLA_WEBHOOK_SECRET, ZID_WEBHOOK_USER, ZID_WEBHOOK_PASSWORD, PORT = 3000 } = process.env

function safeEqual (a, b) {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b ?? ''))
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

// Salla signs the raw body with HMAC-SHA256 (Signature strategy, the default).
function verifySalla (rawBody, headers) {
  if (headers['x-salla-security-strategy'] === 'Token') {
    return safeEqual(SALLA_WEBHOOK_SECRET, headers.authorization)
  }
  const expected = crypto.createHmac('sha256', SALLA_WEBHOOK_SECRET).update(rawBody).digest('hex')
  return safeEqual(expected, headers['x-salla-signature'])
}

// Zid sends Basic auth when the webhook was created with username and password.
function verifyZid (headers) {
  const expected = 'Basic ' + Buffer.from(`${ZID_WEBHOOK_USER}:${ZID_WEBHOOK_PASSWORD}`).toString('base64')
  return safeEqual(expected, headers.authorization)
}

function handle (platform, payload) {
  // Queue the work here and return quickly; both platforms retry slow or failed deliveries.
  const event = platform === 'salla' ? payload.event : payload.event_name ?? 'store event'
  console.log(`[${platform}] ${event}`)
}

http.createServer((req, res) => {
  const platform = { '/webhooks/salla': 'salla', '/webhooks/zid': 'zid' }[req.url]
  if (req.method !== 'POST' || !platform) return res.writeHead(404).end()

  const chunks = []
  req.on('data', c => chunks.push(c))
  req.on('end', () => {
    const rawBody = Buffer.concat(chunks)
    const valid = platform === 'salla' ? verifySalla(rawBody, req.headers) : verifyZid(req.headers)
    if (!valid) return res.writeHead(401).end()

    let payload
    try {
      payload = JSON.parse(rawBody.toString('utf8'))
    } catch {
      return res.writeHead(400).end()
    }
    handle(platform, payload)
    res.writeHead(200).end('ok')
  })
}).listen(PORT, () => console.log(`Listening on :${PORT}`))
