import { createApp, h } from 'vue'
import { DirectionProvider, MantineProvider } from '@mantine-vue/core'
import { CodeHighlightAdapterProvider } from '@mantine-vue/code-highlight'
import App from './App.vue'
import { router } from './router'
import { theme } from './theme'
import { docsShikiAdapter } from './code-highlight-adapter'

// Mantine global styles (baseline, css variables, default theme variables).
// Feature packages (tiptap, code-highlight, dropzone, carousel, etc.) ship their
// styles as CSS Modules imported directly by each component, so no separate
// package-level styles.css import is needed here in dev.
import '@mantine-vue/core/styles.css'
import '@mantine-vue/charts/styles.css'
import './styles.css'

const app = createApp({
  name: 'Root',
  render: () =>
    h(DirectionProvider, { initialDirection: 'ltr' }, () =>
      h(MantineProvider, { theme, defaultColorScheme: 'auto' }, () =>
        h(CodeHighlightAdapterProvider, { adapter: docsShikiAdapter }, () => h(App)),
      ),
    ),
})

app.use(router)
app.mount('#app')
