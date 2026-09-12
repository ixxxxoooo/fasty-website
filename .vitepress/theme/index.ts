import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PluginCatalog from './components/PluginCatalog.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PluginCatalog', PluginCatalog)
  },
} satisfies Theme
