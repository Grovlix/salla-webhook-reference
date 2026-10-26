#!/usr/bin/env node
// Generates the event pages, JSON Schemas and sidebar from data/ and sources/.
// Everything under docs/salla, docs/zid and schemas/ is output: edit data/*.json
// (event list and descriptions) or refresh sources/ (npm run sources:fetch) instead.

import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const REPO = 'https://github.com/Grovlix/salla-webhook-reference'
const readJson = async p => JSON.parse(await readFile(join(root, p), 'utf8'))

async function write (path, content) {
  const file = join(root, path)
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, content)
}

// Text from the official schemas goes into Markdown tables and through Vue's
// template compiler, so keep it on one line and neutralise HTML and {{ }}.
// Relative links in the official text point into the vendor's docs; make them absolute.
const cell = (s, base = '') => String(s ?? '')
  .replace(/\s*\n\s*/g, ' ')
  .replace(/\]\((?!https?:|#|mailto:)\/?([^)]+)\)/g, (_, path) => `](${base}/${path})`)
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;')
  .replace(/\|/g, '\\|')
  .trim()

const refId = ref => ref.split('/').pop()

function resolve (schema, defs) {
  return schema?.$ref ? defs[refId(schema.$ref)] ?? {} : schema ?? {}
}

function typeOf (schema, defs) {
  if (!schema) return ''
  if (schema.$ref) {
    const target = defs[refId(schema.$ref)]
    return `object (${target?.title ?? target?.name ?? 'object'})`
  }
  const t = Array.isArray(schema.type) ? schema.type.join(' \\| ') : schema.type
  if (t === 'array' && schema.items) return `array of ${typeOf(schema.items, defs)}`
  if (!t && (schema.anyOf || schema.oneOf)) {
    return (schema.anyOf || schema.oneOf).map(s => typeOf(s, defs)).join(' \\| ')
  }
  return t ?? ''
}

function fieldRows (schema, defs, base) {
  const props = resolve(schema, defs).properties ?? {}
  const required = new Set(resolve(schema, defs).required ?? [])
  return Object.entries(props).map(([name, s]) => {
    const enumValues = s.enum && s.enum.length <= 12 ? ` One of: ${s.enum.map(v => `\`${v}\``).join(', ')}.` : ''
    return `| \`${name}\`${required.has(name) ? ' *' : ''} | ${typeOf(s, defs)} | ${cell(s.description ?? s.title, base)}${enumValues} |`
  })
}

// Copies the definitions a model needs into one standalone draft-07 schema,
// dropping Apidog's vendor keys. `required` is dropped too: the official examples
// routinely omit fields the official schemas mark required, so keeping it would
// reject real payloads. The event pages still show what the vendor marks required.
function bundle (modelId, defs, meta) {
  const needed = new Set()
  const visit = node => {
    if (Array.isArray(node)) return node.forEach(visit)
    if (!node || typeof node !== 'object') return
    if (node.$ref) {
      const id = refId(node.$ref)
      if (!needed.has(id) && defs[id]) {
        needed.add(id)
        visit(defs[id])
      }
    }
    Object.values(node).forEach(visit)
  }
  const clean = node => {
    if (Array.isArray(node)) return node.map(clean)
    if (!node || typeof node !== 'object') return node
    const out = {}
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('x-') || k === 'name' || (k === 'required' && Array.isArray(v))) continue
      out[k] = clean(v)
    }
    return out
  }
  const model = defs[modelId]
  visit(model)
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: meta.event,
    description: `${meta.description} Generated from ${meta.source} (fetched ${meta.fetched}).`,
    ...clean(model)
  }
  schema.title = meta.event
  const examples = Object.values(model['x-examples'] ?? {})
  if (examples.length) schema.examples = examples
  if (needed.size) {
    schema.definitions = Object.fromEntries([...needed].sort().map(id => [id, clean(defs[id])]))
  }
  return schema
}

// Zid publishes field-level examples but no full payloads; build one from them.
function assembleExample (schema, defs, depth = 0) {
  const s = resolve(schema, defs)
  if (depth > 6) return undefined
  if (s.examples?.length) return s.examples[0]
  if (s.example !== undefined) return s.example
  if (s.type === 'object' || s.properties) {
    const out = {}
    for (const [k, v] of Object.entries(s.properties ?? {})) {
      const val = assembleExample(v, defs, depth + 1)
      if (val !== undefined) out[k] = val
    }
    return Object.keys(out).length ? out : undefined
  }
  if (s.type === 'array' && s.items) {
    const item = assembleExample(s.items, defs, depth + 1)
    return item === undefined ? undefined : [item]
  }
  return undefined
}

function pickExample (platform, ev, model, source) {
  const md = source.examples.filter(e => e.event === ev.name)
  if (md.length) return { payloads: md, exact: true }
  if (model) {
    const xex = model['x-examples'] ?? {}
    const payload = xex['Webhook V2'] ?? xex.Example ?? Object.values(xex)[0]
    if (payload) return { payloads: [{ heading: '', payload, repaired: false }], exact: payload.event === ev.name }
    const mdForModel = source.examples.find(e => model.properties?.event?.enum?.includes(e.event))
    if (mdForModel) return { payloads: [mdForModel], exact: false }
    if (platform === 'zid') {
      const payload = assembleExample(model, source.definitions)
      if (payload) return { payloads: [{ heading: '', payload, repaired: false }], exact: true, assembled: true }
    }
  }
  return null
}

function eventPage (p, group, ev, source) {
  const defs = source.definitions
  const model = ev.model ? defs[ev.model] : null
  const siblings = ev.model ? group.events.filter(e => e.model === ev.model && e.name !== ev.name) : []
  const example = pickExample(p.platform, ev, model, source)
  const lines = [
    '---',
    `title: ${ev.name} webhook`,
    `description: ${JSON.stringify(`${p.name} ${ev.name} webhook: ${ev.description}`)}`,
    '---',
    '',
    `# \`${ev.name}\``,
    '',
    ev.description,
    '',
    `<p dir="rtl" lang="ar">${ev.description_ar}</p>`,
    '',
    '| | |',
    '| --- | --- |',
    `| Platform | ${p.name} |`,
    `| Group | [${group.title}](./index.md) |`
  ]
  if (model) {
    const shared = siblings.length ? ` (shared with ${siblings.map(e => `[\`${e.name}\`](./${e.name}.md)`).join(', ')})` : ''
    lines.push(`| Payload model | ${cell(model.title)}${shared} |`)
    lines.push(`| JSON Schema | [\`schemas/${p.platform}/${ev.name}.schema.json\`](${REPO}/blob/master/schemas/${p.platform}/${ev.name}.schema.json) |`)
  }
  lines.push(`| Official docs | [${source.source_url.replace('https://', '')}](${source.source_url}) |`, '')

  if (ev.deprecated) {
    lines.push('::: warning Deprecated', `${p.name}'s events table shows this event struck through. Don't build new integrations on it.`, ':::', '')
  }
  if (ev.note) lines.push('::: info Note', ev.note, ':::', '')

  lines.push('## Example payload', '')
  if (!example) {
    lines.push(`${p.name} doesn't publish an example for this event. Use the field list below.`, '')
  } else {
    if (example.assembled) {
      lines.push(`Zid doesn't publish full example payloads. This one is assembled from the per-field examples in Zid's schema, so treat it as a guide to the shape, not a captured request.`, '')
    } else if (!example.exact) {
      const shownFor = example.payloads[0].payload.event ?? 'another event in this model'
      lines.push(`${p.name} publishes one example for this payload model, shown here for \`${shownFor}\`. \`${ev.name}\` uses the same structure.`, '')
    }
    if (example.payloads.some(e => e.repaired)) {
      lines.push(`${p.name}'s published example has a JSON syntax error (a missing comma). It's corrected here.`, '')
    }
    for (const e of example.payloads) {
      if (example.payloads.length > 1 && e.heading) lines.push(`**${e.heading}**`, '')
      lines.push('```json', JSON.stringify(e.payload, null, 2), '```', '')
    }
  }

  if (model) {
    lines.push('## Fields', '', 'Fields marked * are required in the official schema.', '')
    lines.push('| Field | Type | Description |', '| --- | --- | --- |', ...fieldRows(model, defs, new URL(source.source_url).origin), '')
    const data = model.properties?.data
    if (data && Object.keys(resolve(data, defs).properties ?? {}).length) {
      lines.push('### `data`', '', '| Field | Type | Description |', '| --- | --- | --- |', ...fieldRows(data, defs, new URL(source.source_url).origin), '')
    }
  }

  lines.push('## Source', '', `Generated from [${p.name}'s official documentation](${source.source_url}), fetched ${source.fetched_at}. Found a difference from what ${p.name} actually sends? [Open an issue](${REPO}/issues/new?labels=accuracy&title=${encodeURIComponent(ev.name)}).`, '')
  return lines.join('\n')
}

function eventTable (events, linkPrefix) {
  return [
    '| Event | Description | الوصف |',
    '| --- | --- | --- |',
    ...events.map(e => `| [\`${e.name}\`](${linkPrefix}${e.name}.md)${e.deprecated ? ' (deprecated)' : ''} | ${e.description} | ${e.description_ar} |`)
  ].join('\n')
}

function groupPage (p, group, source) {
  return [
    '---',
    `title: ${p.name} ${group.title.toLowerCase()} webhooks`,
    '---',
    '',
    `# ${p.name}: ${group.title} events`,
    '',
    `<p dir="rtl" lang="ar">أحداث ${group.title_ar} في ${p.name_ar}</p>`,
    '',
    ...(group.intro ? [group.intro, '', `<p dir="rtl" lang="ar">${group.intro_ar}</p>`, ''] : []),
    eventTable(group.events, './'),
    '',
    `Official page: [${source.source_url.replace('https://', '')}](${source.source_url})`,
    ''
  ].join('\n')
}

function platformPage (p) {
  const count = p.groups.reduce((n, g) => n + g.events.length, 0)
  const sections = p.groups.map(g => [`## ${g.title} | ${g.title_ar}`, '', eventTable(g.events, `./${g.slug}/`), ''].join('\n'))
  return [
    '---',
    `title: ${p.name} webhook events`,
    '---',
    '',
    `# ${p.name} webhook events`,
    '',
    `<p dir="rtl" lang="ar">جميع أحداث الويب هوك في ${p.name_ar}</p>`,
    '',
    `${count} events, taken from ${p.name}'s [official documentation](${p.events_doc}). Each page shows the official example payload, the field list from ${p.name}'s schema, and a JSON Schema you can validate against.`,
    '',
    ...sections
  ].join('\n')
}

const sidebar = {}

for (const p of [await readJson('data/salla.json'), await readJson('data/zid.json')]) {
  await rm(join(root, 'docs', p.platform), { recursive: true, force: true })
  await rm(join(root, 'schemas', p.platform), { recursive: true, force: true })
  const items = []
  for (const group of p.groups) {
    const source = await readJson(`sources/${p.platform}/${group.slug}.json`)
    for (const ev of group.events) {
      if (ev.model && !source.definitions[ev.model]) throw new Error(`${ev.name}: model ${ev.model} not in sources/${p.platform}/${group.slug}.json`)
      await write(`docs/${p.platform}/${group.slug}/${ev.name}.md`, eventPage(p, group, ev, source))
      if (ev.model) {
        const schema = bundle(ev.model, source.definitions, {
          event: ev.name, description: ev.description, source: source.source_url, fetched: source.fetched_at
        })
        await write(`schemas/${p.platform}/${ev.name}.schema.json`, JSON.stringify(schema, null, 2) + '\n')
      }
    }
    await write(`docs/${p.platform}/${group.slug}/index.md`, groupPage(p, group, source))
    items.push({
      text: group.title,
      collapsed: true,
      link: `/${p.platform}/${group.slug}/`,
      items: group.events.map(e => ({ text: e.name, link: `/${p.platform}/${group.slug}/${e.name}.md` }))
    })
  }
  await write(`docs/${p.platform}/index.md`, platformPage(p))
  sidebar[`/${p.platform}/`] = [{ text: `${p.name} events`, link: `/${p.platform}/` }, ...items]
}

await write('docs/.vitepress/sidebar.generated.json', JSON.stringify(sidebar, null, 2) + '\n')

// Serve the schemas from the site too, so they can be referenced by URL.
await rm(join(root, 'docs/public/schemas'), { recursive: true, force: true })
await cp(join(root, 'schemas'), join(root, 'docs/public/schemas'), { recursive: true })

console.log('Generated docs/salla, docs/zid, schemas/ and the sidebar.')
