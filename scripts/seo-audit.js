#!/usr/bin/env node

/**
 * SEO Audit Script for Salla & Zid Webhook Reference
 * برنامج تدقيق SEO لمرجع Webhooks سلة وزد
 */

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const SEO_KEYWORDS = {
  english: [
    'Salla webhook',
    'Salla webhooks',
    'Zid webhook',
    'Zid webhooks',
    'Salla API',
    'Zid API',
    'Saudi Arabia e-commerce',
    'MENA webhook',
    'webhook documentation'
  ],
  arabic: [
    'سلة webhook',
    'سلة onevents',
    'زد webhook',
    'زد onevents',
    'أحداث سلة',
    'أحداث زد',
    'تكامل API',
    'دليل webhook'
  ]
}

function checkFileForSEO(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const issues = []
  const warnings = []

  // Check for heading hierarchy
  const headings = content.match(/^#+\s+.+$/gm) || []
  if (headings.length > 0) {
    const firstHeading = headings[0]
    if (!firstHeading.startsWith('# ')) {
      warnings.push('First heading should be H1 (#)')
    }
  }

  // Check for title
  if (!content.includes('# ')) {
    issues.push('Missing H1 heading')
  }

  // Check for description
  if (!content.includes('Description') && !content.includes('نظرة عامة')) {
    warnings.push('Consider adding a description section')
  }

  // Check for code examples
  if (!content.includes('```')) {
    warnings.push('Consider adding code examples')
  }

  // Check for bilingual content
  const hasArabic = /[\u0600-\u06FF]/.test(content)
  const hasEnglish = /[a-zA-Z]/.test(content)

  if (filePath.includes('comparison') || filePath.includes('index')) {
    if (!hasArabic || !hasEnglish) {
      warnings.push('Consider adding bilingual content')
    }
  }

  return { issues, warnings, hasArabic, hasEnglish }
}

function auditDocs() {
  const docsDir = './docs'
  const results = {
    files: 0,
    totalIssues: 0,
    totalWarnings: 0,
    bilingualFiles: 0,
    filesWithIssues: []
  }

  function scanDir(dir) {
    const entries = readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dir, entry.name)

      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.name.endsWith('.md')) {
        results.files++
        const { issues, warnings, hasArabic, hasEnglish } = checkFileForSEO(fullPath)

        if (hasArabic && hasEnglish) {
          results.bilingualFiles++
        }

        if (issues.length > 0 || warnings.length > 0) {
          results.filesWithIssues.push({
            file: fullPath.replace('./docs/', ''),
            issues,
            warnings
          })
        }

        results.totalIssues += issues.length
        results.totalWarnings += warnings.length
      }
    }
  }

  scanDir(docsDir)

  // Print results
  console.log('\n=== SEO Audit Results / نتائج تدقيق SEO ===\n')
  console.log(`Files scanned: ${results.files}`)
  console.log(`Bilingual files: ${results.bilingualFiles}`)
  console.log(`Total issues: ${results.totalIssues}`)
  console.log(`Total warnings: ${results.totalWarnings}\n`)

  if (results.filesWithIssues.length > 0) {
    console.log('Files with issues:\n')
    results.filesWithIssues.forEach(({ file, issues, warnings }) => {
      console.log(`📄 ${file}`)
      issues.forEach(i => console.log(`  ❌ ${i}`))
      warnings.forEach(w => console.log(`  ⚠️  ${w}`))
      console.log()
    })
  }

  console.log('✅ Audit complete!\n')
}

auditDocs()
