import DefaultTheme from 'vitepress/theme'
import './styles.css'
import type { Theme } from 'vitepress'
import PageFeedback from './components/PageFeedback.vue'
import { h } from 'vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Register the feedback component globally
    app.component('PageFeedback', PageFeedback)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-image': () => h('div', { class: 'platform-logos-hero' }, [
        h('img', {
          src: '/assets/salla-logo.svg',
          alt: 'Salla Logo',
          class: 'platform-logo'
        }),
        h('img', {
          src: '/assets/zid-logo.svg',
          alt: 'Zid Logo',
          class: 'platform-logo'
        })
      ])
    })
  }
}

export default theme
