import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Salla & Zid Webhook Reference',
  description: 'Comprehensive webhook documentation for Salla and Zid e-commerce platforms | دليل شامل لـ Webhooks منصتي سلة وزد',
  lang: 'en-US',
  dir: 'ltr',
  base: '/',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { property: 'og:locale:alternate', content: 'ar_SA' }],
    ['meta', { property: 'og:title', content: 'Salla & Zid Webhook Reference' }],
    ['meta', { property: 'og:description', content: 'Comprehensive webhook documentation for Salla and Zid e-commerce platforms | دليل شامل لـ Webhooks منصتي سلة وزد' }],
    ['meta', { property: 'og:site_name', content: 'Salla & Zid Webhook Reference' }],
    ['meta', { property: 'og:image', content: 'https://grovlix.github.io/salla-webhook-reference/assets/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Salla & Zid Webhook Reference' }],
    ['meta', { name: 'twitter:description', content: 'Comprehensive webhook documentation for Salla and Zid e-commerce platforms' }],
    ['meta', { name: 'twitter:image', content: 'https://grovlix.github.io/salla-webhook-reference/assets/og-image.png' }],
    ['meta', { name: 'keywords', content: 'Salla webhooks, Salla أحداث, Zid webhooks, Zid أحداث, Salla API, Zid API, Saudi Arabia e-commerce, MENA webhook documentation, تطبيقات Salla, تكامل Salla API, دليل Salla webhook' }],
    ['meta', { name: 'description', content: 'Complete webhook reference documentation for Salla and Zid e-commerce platforms. Learn about order, product, customer events and more | مرجع شامل لـ Webhots منصتي سلة وزد للتجارة الإلكترونية' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap' }],
    ['script', {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': 'https://grovlix.github.io/salla-webhook-reference/#webpage',
            'url': 'https://grovlix.github.io/salla-webhook-reference/',
            'name': 'Salla & Zid Webhook Reference',
            'description': 'Comprehensive webhook documentation for Salla and Zid e-commerce platforms | دليل شامل لـ Webhooks منصتي سلة وزد',
            'inLanguage': 'en-US',
            'isPartOf': {
              '@id': 'https://grovlix.github.io/salla-webhook-reference/#website'
            },
            'about': [
              {
                '@type': 'SoftwareApplication',
                'name': 'Salla',
                'applicationCategory': 'EcommerceApplication',
                'operatingSystem': 'Web'
              },
              {
                '@type': 'SoftwareApplication',
                'name': 'Zid',
                'applicationCategory': 'EcommerceApplication',
                'operatingSystem': 'Web'
              }
            ]
          },
          {
            '@type': 'TechArticle',
            '@id': 'https://grovlix.github.io/salla-webhook-reference/#techarticle',
            'headline': 'Salla & Zid Webhook Reference Documentation',
            'description': 'Complete webhook event reference for Saudi Arabia e-commerce platforms Salla and Zid',
            'author': {
              '@type': 'Organization',
              'name': 'Grovlix'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Grovlix',
              'url': 'https://grovlix.com'
            },
            'datePublished': '2026-03-25',
            'dateModified': '2026-03-25',
            'inLanguage': 'en-US',
            'proficiencyLevel': 'Beginner',
            'dependencies': 'Node.js, PHP, Python',
            'keywords': ['Salla webhooks', 'Zid webhooks', 'API integration', 'e-commerce events', 'Saudi Arabia']
          },
          {
            '@type': 'Organization',
            '@id': 'https://grovlix.com/#organization',
            'name': 'Grovlix',
            'url': 'https://grovlix.com',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://grovlix.github.io/salla-webhook-reference/assets/logo.png'
            },
            'description': 'Technology solutions provider specializing in e-commerce integrations for the MENA region',
            'sameAs': [
              'https://github.com/grovlix'
            ],
            'address': {
              '@type': 'PostalAddress',
              'addressCountry': 'SA',
              'addressRegion': 'Riyadh'
            }
          },
          {
            '@type': 'WebSite',
            '@id': 'https://grovlix.github.io/salla-webhook-reference/#website',
            'url': 'https://grovlix.github.io/salla-webhook-reference/',
            'name': 'Salla & Zid Webhook Reference',
            'description': 'Complete webhook documentation for Salla and Zid platforms',
            'publisher': {
              '@id': 'https://grovlix.com/#organization'
            },
            'inLanguage': ['en-US', 'ar-SA'],
            'potentialAction': {
              '@type': 'SearchAction',
              'target': {
                '@type': 'EntryPoint',
                'urlTemplate': 'https://grovlix.github.io/salla-webhook-reference/search?q={search_term_string}'
              },
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://grovlix.github.io/salla-webhook-reference/'
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Salla Events',
                'item': 'https://grovlix.github.io/salla-webhook-reference/salla/'
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': 'Zid Events',
                'item': 'https://grovlix.github.io/salla-webhook-reference/zid/'
              }
            ]
          }
        ]
      })
    }]
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      themeColor: {
        light: '#3eaf7c',
        dark: '#34947c'
      }
    },
    ar: {
      label: 'العربية',
      lang: 'ar-SA',
      link: '/ar/',
      title: 'مرجع Webhooks سلة وزد',
      description: 'دليل شامل للـ Webhooks الخاصة بمنصتي سلة وزد للتجارة الإلكترونية',
      dir: 'rtl',
      themeColor: {
        light: '#3eaf7c',
        dark: '#34947c'
      }
    }
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Salla Events', link: '/salla/' },
      { text: 'Zid Events', link: '/zid/' },
      { text: 'Guides', link: '/guides/getting-started' },
      { text: 'Grovlix.com', link: 'https://grovlix.com' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What are Webhooks?', link: '/guides/getting-started.md' },
            { text: 'Security', link: '/guides/webhook-security.md' },
            { text: 'Troubleshooting', link: '/guides/troubleshooting.md' },
            { text: 'Salla vs Zid Comparison', link: '/comparison/salla-vs-zid-webhooks.md' }
          ]
        },
        {
          text: 'Salla Platform',
          items: [
            { text: 'Overview', link: '/salla/' },
            { text: 'Order Events', link: '/salla/order/' },
            { text: 'Product Events', link: '/salla/product/' },
            { text: 'Customer Events', link: '/salla/customer/' }
          ]
        },
        {
          text: 'Zid Platform',
          items: [
            { text: 'Overview', link: '/zid/' },
            { text: 'Order Events', link: '/zid/order/' },
            { text: 'Product Events', link: '/zid/product/' },
            { text: 'Customer Events', link: '/zid/customer/' },
            { text: 'Category Events', link: '/zid/category/' },
            { text: 'Abandoned Cart', link: '/zid/abandoned_cart/' }
          ]
        }
      ],
      '/ar/': [
        {
          text: 'مقدمة',
          items: [
            { text: 'ما هي الـ Webhooks؟', link: '/ar/guides/getting-started.md' },
            { text: 'الأمان', link: '/ar/guides/webhook-security.md' },
            { text: 'استكشاف الأخطاء', link: '/ar/guides/troubleshooting.md' },
            { text: 'مقارنة سلة مع زد', link: '/ar/comparison/salla-vs-zid-webhooks.md' }
          ]
        },
        {
          text: 'منصة سلة',
          items: [
            { text: 'نظرة عامة', link: '/ar/salla/' },
            { text: 'أحداث الطلبات', link: '/ar/salla/order/' },
            { text: 'أحداث المنتجات', link: '/ar/salla/product/' },
            { text: 'أحداث العملاء', link: '/ar/salla/customer/' }
          ]
        },
        {
          text: 'منصة زد',
          items: [
            { text: 'نظرة عامة', link: '/ar/zid/' },
            { text: 'أحداث الطلبات', link: '/ar/zid/order/' },
            { text: 'أحداث المنتجات', link: '/ar/zid/product/' },
            { text: 'أحداث العملاء', link: '/ar/zid/customer/' },
            { text: 'أحداث الفئات', link: '/ar/zid/category/' },
            { text: 'السلة المتروكة', link: '/ar/zid/abandoned_cart/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/grovlix/salla-webhook-reference' }
    ],

    footer: {
      message: 'Released under MIT License | تم الإصدار تحت ترخيص MIT',
      copyright: 'Copyright © 2026-present Grovlix'
    },

    editLink: {
      pattern: 'https://github.com/grovlix/salla-webhook-reference/edit/main/docs/:path',
      text: 'Edit this page on GitHub | عدل هذه الصفحة على GitHub'
    },

    lastUpdated: {
      text: 'Last updated | آخر تحديث',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          en: {
            placeholder: 'Search documentation...',
            translations: {
              button: {
                buttonText: 'Search Documentation',
                buttonAriaLabel: 'Search Documentation'
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Clear search query',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          },
          ar: {
            placeholder: 'البحث في التوثيق...',
            translations: {
              button: {
                buttonText: 'البحث في التوثيق',
                buttonAriaLabel: 'البحث في التوثيق'
              },
              modal: {
                noResultsText: 'لا توجد نتائج لـ',
                resetButtonTitle: 'مسح طلب البحث',
                footer: {
                  selectText: 'للاختيار',
                  navigateText: 'للتنقل',
                  closeText: 'للإغلاق'
                }
              }
            }
          }
        }
      }
    }
  },

  markdown: {
    config: (md) => {
      // Add support for bilingual content
      md.use(bilingualContainers)
    }
  },

  vite: {
    css: {
      postcss: {
        plugins: [
          // RTL support
          {
            postcssPlugin: 'rtl-support',
            Once(root) {
              root.walkAtRules('rtl', (rule) => {
                // Process RTL-specific styles
              })
            }
          }
        ]
      }
    }
  },

  // Performance optimization
  srcDir: 'docs',
  srcExclude: ['**/README.md'],
  outDir: 'docs/.vitepress/dist',
  cacheDir: 'docs/.vitepress/cache'
})

function bilingualContainers(md) {
  // Add custom parser for bilingual content blocks
  md.block.ruler.before(
    'fence',
    'bilingual',
    (state, start, end, silent) => {
      // Custom parsing logic
      return false
    }
  )
}
