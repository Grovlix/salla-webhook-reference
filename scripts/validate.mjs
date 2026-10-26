#!/usr/bin/env node
// Fails if any generated schema doesn't compile. Also checks each official example
// against its own schema; mismatches come from the vendors' docs, so they're reported
// as warnings rather than failures.

import Ajv from 'ajv'
import { readdir, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let failed = 0
let warnings = 0
let count = 0

for (const platform of ['salla', 'zid']) {
  const dir = join(root, 'schemas', platform)
  for (const file of (await readdir(dir)).filter(f => f.endsWith('.schema.json')).sort()) {
    count++
    const schema = JSON.parse(await readFile(join(dir, file), 'utf8'))
    const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false })
    let validate
    try {
      validate = ajv.compile(schema)
    } catch (err) {
      failed++
      console.error(`FAIL ${platform}/${file}: ${err.message}`)
      continue
    }
    for (const [i, example] of (schema.examples ?? []).entries()) {
      if (!validate(example)) {
        warnings++
        const first = validate.errors[0]
        console.warn(`warn ${platform}/${file} example ${i + 1}: ${first.instancePath || '/'} ${first.message} (${validate.errors.length} issue(s))`)
      }
    }
  }
}

console.log(`${count} schemas checked, ${failed} failed to compile, ${warnings} official example(s) don't match their schema.`)
process.exit(failed ? 1 : 0)
