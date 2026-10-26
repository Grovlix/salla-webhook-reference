# Contributing

<p dir="rtl" lang="ar">شكرًا لاهتمامك. أهم مساهمة هي تصحيح مبني على طلب ويب هوك حقيقي وصلك من سلة أو زد.</p>

## Report a difference from a real delivery

This is the most useful thing you can send. [Open an issue](https://github.com/Grovlix/salla-webhook-reference/issues/new?labels=accuracy)
with:

- the platform and event name,
- what the docs here say,
- what you actually received (the raw body, with customer names, emails, phones and addresses removed).

Never paste access tokens, secrets or real customer data.

## Change the docs

Event pages and schemas are generated. Edit the inputs, then regenerate:

| To change | Edit |
| --- | --- |
| An event's description, Arabic text or note | `data/salla.json` or `data/zid.json` |
| A new event the platform added | `data/*.json`, after checking it's in the official docs |
| Payloads, field lists, schemas | Run `npm run sources:fetch` to pull the latest official docs |
| Guides | `docs/guides/*.md`, `docs/comparison/*.md` |
| Generator or page layout | `scripts/build.mjs` |

Then:

```bash
npm install
npm run build
npm run validate
npm run docs:dev
```

Commit the regenerated files with your change. CI fails if they're out of date.

## Rules

- Only add events that appear in Salla's or Zid's own documentation. Link the source in your PR.
- Keep English and Arabic descriptions in step.
- Code examples must verify requests the way the platform documents it.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
