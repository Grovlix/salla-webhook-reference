# sources

Snapshots of the official Salla and Zid webhook documentation. `scripts/build.mjs` generates everything else from
these files and `data/`.

Each file holds:

- `source_url`: the official page.
- `fetched_at`: the date of the snapshot.
- `definitions`: the JSON Schema definitions the page renders, taken from the page data of the Apidog-built docs.
  Salla's models include official example payloads under `x-examples`.
- `examples`: JSON examples from the page's Markdown version (`<url>.md`). `repaired: true` means the official
  example had a JSON syntax error (a missing comma) that the fetch script fixed.

Refresh with `npm run sources:fetch`, then `npm run build`, and review the diff before committing.

The content belongs to Salla and Zid. It's kept here so the generated reference can cite exactly what the official
docs said on a given date.
