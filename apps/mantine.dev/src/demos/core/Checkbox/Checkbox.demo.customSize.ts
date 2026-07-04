import { defineComponent, h } from 'vue'
import { Checkbox, MantineThemeProvider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'checkbox-custom-size-demo-styles'
function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .mantine-Checkbox-root[data-size='xxl'] { --checkbox-size: 42px; }
      .mantine-Checkbox-root[data-size='xxl'] .mantine-Checkbox-label { font-size: 22px; line-height: 40px; }
      .mantine-Checkbox-root[data-size='xxs'] { --checkbox-size: 14px; }
      .mantine-Checkbox-root[data-size='xxs'] .mantine-Checkbox-label { font-size: 10px; line-height: 14px; }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.root {
  --checkbox-size-xxl: 42px;
  --checkbox-size-xxs: 14px;

  &[data-size='xxl'] {
    .label {
      font-size: 22px;
      line-height: 40px;
    }
  }

  &[data-size='xxs'] {
    .label {
      font-size: 10px;
      line-height: 14px;
    }
  }
}`

const code = `
<script setup lang="ts">
import { MantineThemeProvider, Checkbox } from '@mantine-vue/core'
import classes from './Demo.module.css'

const theme = {
  components: {
    Checkbox: { classNames: classes },
  },
}
</script>

<template>
  <MantineThemeProvider :theme="theme">
    <Checkbox size="xxs" label="Extra small checkbox" />
    <Checkbox size="xxl" label="Extra large checkbox" mt="md" />
  </MantineThemeProvider>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxCustomSizeDemo',
  setup() {
    ensureStyles()
    const theme = {
      components: {
        Checkbox: {
          classNames: {
            root: 'mantine-Checkbox-root',
          },
        },
      },
    }
    return () =>
      h(
        MantineThemeProvider,
        { theme },
        {
          default: () => [
            h(Checkbox, { size: 'xxs', label: 'Extra small checkbox' }),
            h(Checkbox, { size: 'xxl', label: 'Extra large checkbox', mt: 'md' }),
          ],
        },
      )
  },
})

export const customSize: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code: [
    { fileName: 'Demo.vue', code, language: 'html' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
