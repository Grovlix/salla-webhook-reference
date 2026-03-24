import DefaultTheme from 'vitepress/theme'
import './styles.css'
import type { Theme } from 'vitepress'
import PageFeedback from './components/PageFeedback.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // Register the feedback component globally
    app.component('PageFeedback', PageFeedback)
  }
}

export default theme
