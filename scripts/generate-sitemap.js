#!/usr/bin/env node

/**
 * Sitemap Generator for Salla & Zid Webhook Reference
 * مولد Sitemap لمرجع Webhooks سلة وزد
 */

import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'fs'
import { glob } from 'glob'

const BASE_URL = 'https://grovlix.github.io/salla-webhook-reference'

// All pages to include in sitemap
const pages = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/salla/', changefreq: 'monthly', priority: 0.9 },
  { url: '/zid/', changefreq: 'monthly', priority: 0.9 },
  { url: '/guides/getting-started.html', changefreq: 'monthly', priority: 0.8 },
  { url: '/guides/webhook-security.html', changefreq: 'monthly', priority: 0.8 },
  { url: '/guides/troubleshooting.html', changefreq: 'monthly', priority: 0.8 },
  { url: '/comparison/salla-vs-zid-webhooks.html', changefreq: 'monthly', priority: 0.9 },
]

// Generate sitemap
async function generateSitemap() {
  const smStream = new SitemapStream({
    hostname: BASE_URL,
    lastmodDate: new Date()
  })

  // Add static pages
  pages.forEach(page => {
    smStream.write({
      url: page.url,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString()
    })
  })

  // Add Zid event pages
  const zidEvents = [
    'order/order.create',
    'order/order.status.update',
    'order/order.payment_status.update',
    'product/product.create',
    'product/product.update',
    'product/product.publish',
    'product/product.delete',
    'customer/customer.create',
    'customer/customer.update',
    'customer/customer.merchant.update',
    'customer/customer.login',
    'abandoned_cart/abandoned_cart.created',
    'abandoned_cart/abandoned_cart.completed',
    'category/category.create',
    'category/category.update',
    'category/category.delete'
  ]

  zidEvents.forEach(event => {
    smStream.write({
      url: `/zid/${event}.html`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString()
    })
  })

  smStream.end()

  // Write to file
  const writeStream = createWriteStream('./sitemap.xml')
  streamToPromise(smStream.pipe(writeStream))
    .then(() => console.log('Sitemap generated successfully! تم إنشاء Sitemap بنجاح!'))
    .catch(err => console.error('Error generating sitemap:', err))
}

generateSitemap()
