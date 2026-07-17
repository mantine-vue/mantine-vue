import { createApp, h } from 'vue'
import { DirectionProvider, MantineProvider } from '@mantine-vue/core'
import { ModalsProvider } from '@mantine-vue/modals'
import App from './App.vue'
import { theme } from './theme'

import '@mantine-vue/core/styles.css'
import '@mantine-vue/charts/styles.css'
import '@mantine-vue/schedule/styles.css'
import './styles.css'

const app = createApp({
  name: 'ShowcaseRoot',
  render: () =>
    h(DirectionProvider, { initialDirection: 'ltr' }, () =>
      h(MantineProvider, { theme, defaultColorScheme: 'auto' }, () =>
        h(ModalsProvider, null, () => h(App)),
      ),
    ),
})

app.mount('#app')
