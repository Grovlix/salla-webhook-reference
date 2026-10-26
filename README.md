# Salla & Zid Webhook Reference

Every [Salla](https://salla.dev) and [Zid](https://docs.zid.sa) webhook event on one site: the official example
payload, the field list from the platform's own schema, and a JSON Schema per event.

<p dir="rtl" lang="ar">
مرجع لجميع أحداث الويب هوك في سلة وزد: مثال البيانات الرسمي، وقائمة الحقول من مخطط المنصة نفسها،
وملف JSON Schema لكل حدث.
</p>

**Site:** <https://grovlix.github.io/salla-webhook-reference/>

- **109 events:** 81 Salla (68 store events, 13 app and subscription events) and 28 Zid (16 store, 12 app).
- **Generated, not hand-written.** Payloads and fields come from Salla's and Zid's published documentation, fetched
  into [`sources/`](sources/). Each page links back to the official page it came from.
- **JSON Schemas** in [`schemas/`](schemas/), also served from the site at `/schemas/<platform>/<event>.schema.json`.
- **Guides:** [getting started](docs/guides/getting-started.md),
  [verifying requests](docs/guides/webhook-security.md),
  [retries and troubleshooting](docs/guides/troubleshooting.md),
  [Salla vs Zid](docs/comparison/salla-vs-zid-webhooks.md).
- **Examples:** small receivers that verify requests correctly, in [Node.js](examples/node/server.mjs),
  [PHP](examples/php/webhook.php) and [Python](examples/python/app.py).

## Validate a payload

```bash
npx ajv-cli validate --spec=draft7 --strict=false -s schemas/salla/order.created.schema.json -d payload.json
```

The schemas keep the platforms' field types but drop `required`, because the official examples often leave out
fields the official schemas mark as required. Some official examples also disagree with their own schema on a type
(`npm run validate` lists them). When a real delivery disagrees with a schema, trust the delivery and
[open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy).

## How it's built

```text
sources/   Official schemas and examples, fetched from docs.salla.dev and docs.zid.sa
data/      The event list: names, groups, English and Arabic descriptions, notes
scripts/   fetch-sources.mjs (refresh sources/), build.mjs (generate), validate.mjs
docs/      VitePress site; docs/salla and docs/zid are generated
schemas/   Generated JSON Schemas
```

```bash
npm install
npm run docs:dev        # generate and serve locally
npm run sources:fetch   # refresh sources/ from the official docs (needs Chrome)
npm run build           # regenerate docs/salla, docs/zid and schemas/
npm run validate        # compile every schema, check official examples against them
```

Don't edit `docs/salla`, `docs/zid` or `schemas/` by hand; change `data/` or refresh `sources/` and run
`npm run build`. CI fails if the generated files are out of date.

## Contributing

Corrections from real deliveries are the most useful contribution. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Code and text: [MIT](LICENSE). Payload examples and schemas are derived from Salla's and Zid's public
documentation and belong to their owners. This project is maintained by [Grovlix](https://grovlix.com) and isn't
affiliated with or endorsed by Salla or Zid.
