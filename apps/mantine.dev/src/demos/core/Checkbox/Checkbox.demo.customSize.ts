import { defineComponent, h } from 'vue'
import { Checkbox, MantineThemeProvider } from '@mantine-vue/core'
import classes from './Checkbox.demo.customSize.module.css'
import type { MantineDemo } from '@/demo'

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

const theme = {
  components: {
    Checkbox: { classNames: classes },
  },
}

const Demo = defineComponent({
  name: 'CheckboxCustomSizeDemo',
  setup: () => () =>
    h(
      MantineThemeProvider,
      { theme },
      {
        default: () => [
          h(Checkbox, { size: 'xxs', label: 'Extra small checkbox' }),
          h(Checkbox, { size: 'xxl', label: 'Extra large checkbox', mt: 'md' }),
        ],
      },
    ),
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
