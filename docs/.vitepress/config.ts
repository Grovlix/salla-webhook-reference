import { defineConfig } from 'vitepress'
import generatedSidebar from './sidebar.generated.json'

const base = '/salla-webhook-reference/'
const siteUrl = `https://grovlix.github.io${base}`
const title = 'Salla & Zid Webhook Reference'
const description = 'Every Salla and Zid webhook event with official example payloads, field lists and JSON Schemas | مرجع أحداث الويب هوك في سلة وزد'

const guides = [
  {
    text: 'Guides',
    items: [
      { text: 'Getting started', link: '/guides/getting-started.md' },
      { text: 'Verifying requests', link: '/guides/webhook-security.md' },
      { text: 'Retries and troubleshooting', link: '/guides/troubleshooting.md' },
      { text: 'Salla vs Zid', link: '/comparison/salla-vs-zid-webhooks.md' }
    ]
  },
  {
    text: 'Events',
    items: [
      { text: 'Salla events', link: '/salla/' },
      { text: 'Zid events', link: '/zid/' }
    ]
  }
]

export default defineConfig({
  title,
  description,
  lang: 'en-US',
  base,
  // Event names contain dots (order.created), so keep .html URLs that static hosts resolve reliably.
  cleanUrls: false,
  lastUpdated: true,
  sitemap: { hostname: siteUrl },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: title }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: 'ar_SA' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap' }]
  ],
  transformHead ({ pageData }) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    return [
      ['link', { rel: 'canonical', href: `${siteUrl}${path}` }],
      ['meta', { property: 'og:url', content: `${siteUrl}${path}` }],
      ['meta', { property: 'og:title', content: pageData.title ? `${pageData.title} | ${title}` : title }],
      ['meta', { property: 'og:description', content: pageData.description || description }]
    ]
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guides', link: '/guides/getting-started.md' },
      { text: 'Salla', link: '/salla/' },
      { text: 'Zid', link: '/zid/' },
      { text: 'Grovlix', link: 'https://grovlix.com' }
    ],
    sidebar: {
      ...Object.fromEntries(Object.entries(generatedSidebar).map(([path, items]) => [path, [...guides, ...items]])),
      '/': guides
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Grovlix/salla-webhook-reference' }
    ],
    editLink: {
      pattern: 'https://github.com/Grovlix/salla-webhook-reference/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Not affiliated with Salla or Zid. Payloads and schemas come from their official documentation. | غير تابع لسلة أو زد',
      copyright: 'Maintained by <a href="https://grovlix.com">Grovlix</a> · MIT License'
    },
    search: { provider: 'local' },
    outline: { level: [2, 3] }
  }
})
