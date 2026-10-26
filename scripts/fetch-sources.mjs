#!/usr/bin/env node
// Refreshes sources/ from the official Salla and Zid docs.
//
// Both docs sites are built on Apidog. Each webhook page embeds the JSON Schema
// definitions it renders (with Salla's example payloads) in its page data, and
// every page also has a Markdown version at <url>.md. App and subscription events
// are only documented as Markdown code blocks, so those are read from the .md.
//
// Usage: npm run sources:fetch   (needs Google Chrome or `npx playwright install chromium`)

import { chromium } from 'playwright'
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const PAGES = [
  ['salla', 'orders', 'https://docs.salla.dev/webhook-events/orders'],
  ['salla', 'products', 'https://docs.salla.dev/webhook-events/products'],
  ['salla', 'shipments', 'https://docs.salla.dev/webhook-events/shipments'],
  ['salla', 'shipping', 'https://docs.salla.dev/webhook-events/shippings'],
  ['salla', 'customers', 'https://docs.salla.dev/webhook-events/customers'],
  ['salla', 'categories', 'https://docs.salla.dev/webhook-events/categories'],
  ['salla', 'brands', 'https://docs.salla.dev/webhook-events/brands'],
  ['salla', 'store', 'https://docs.salla.dev/webhook-events/store'],
  ['salla', 'carts', 'https://docs.salla.dev/webhook-events/carts'],
  ['salla', 'invoices', 'https://docs.salla.dev/webhook-events/invoice'],
  ['salla', 'special-offers', 'https://docs.salla.dev/webhook-events/special-offers'],
  ['salla', 'reviews', 'https://docs.salla.dev/webhook-events/misc'],
  ['salla', 'customer-wallet', 'https://docs.salla.dev/webhook-events/customer-wallet'],
  ['salla', 'communication', 'https://docs.salla.dev/webhook-events/communciation-apps'],
  ['salla', 'app', 'https://docs.salla.dev/partner-apis/app-events'],
  ['zid', 'orders', 'https://docs.zid.sa/webhook-events-order'],
  ['zid', 'products', 'https://docs.zid.sa/webhook-events-product'],
  ['zid', 'abandoned-carts', 'https://docs.zid.sa/webhook-events-abandoned-cart'],
  ['zid', 'customers', 'https://docs.zid.sa/webhook-events-customer'],
  ['zid', 'categories', 'https://docs.zid.sa/webhook-events-product-category'],
  ['zid', 'app', 'https://docs.zid.sa/events-878234m0']
]

// Pulls every ```json block out of the Markdown, with the nearest heading above it.
// Some official examples have a missing comma; those are repaired and flagged.
function markdownExamples (md) {
  const out = []
  let heading = ''
  const lines = md.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^#{2,4}\s+(.+?)\s*$/)
    if (h) heading = h[1].replace(/\*\*/g, '').trim()
    if (!/^```\s*(json)?\s*$/.test(lines[i].trim())) continue
    const body = []
    for (i++; i < lines.length && !lines[i].trim().startsWith('```'); i++) body.push(lines[i])
    const text = body.join('\n').trim()
    if (!text.startsWith('{')) continue
    let json
    let repaired = false
    try {
      json = JSON.parse(text)
    } catch {
      const fixed = text.replace(/("|\d|true|false|null|\]|\})(\s*\n\s*")/g, '$1,$2')
      try {
        json = JSON.parse(fixed)
        repaired = true
      } catch {
        continue
      }
    }
    const event = json.event ?? json.event_name
    if (event) out.push({ heading, event, repaired, payload: json })
  }
  return out
}

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chrome' })
const page = await browser.newPage()
const fetchedAt = new Date().toISOString().slice(0, 10)

for (const [platform, slug, url] of PAGES) {
  await page.goto(url, { waitUntil: 'networkidle' })
  const definitions = await page.evaluate(() => {
    const out = {}
    const walk = o => {
      if (!o || typeof o !== 'object') return
      if (o.dataSchemaDefinitions) Object.assign(out, o.dataSchemaDefinitions)
      for (const k in o) walk(o[k])
    }
    walk(window.__remixRouter.state.loaderData)
    return out
  })
  const md = await (await fetch(`${url}.md`)).text()
  const file = join(root, 'sources', platform, `${slug}.json`)
  await mkdir(dirname(file), { recursive: true })
  const data = { source_url: url, fetched_at: fetchedAt, definitions, examples: markdownExamples(md) }
  await writeFile(file, JSON.stringify(data, null, 2) + '\n')
  console.log(`${platform}/${slug}: ${Object.keys(definitions).length} schemas, ${data.examples.length} examples`)
}

await browser.close()
