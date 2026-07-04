import { defineComponent, h } from 'vue'
import { MantineThemeProvider, NativeSelect, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const cssCode = `
.label {
  background-color: var(--mantine-color-blue-light);
}

.input {
  border: 1px solid var(--mantine-color-violet-filled);
}
`

const code = `
<script setup lang="ts">
import { MantineThemeProvider, TextInput, NativeSelect } from '@mantine-vue/core'
import classes from './Demo.module.css'

const theme = {
  components: {
    Input: {
      classNames: { input: classes.input },
    },
    InputWrapper: {
      classNames: { label: classes.label },
    },
  },
}
</script>

<template>
  <MantineThemeProvider :theme="theme">
    <TextInput label="Text input" placeholder="Text input" />
    <NativeSelect
      mt="md"
      label="Native select"
      :data="['React', 'Angular', 'Vue', 'Svelte']"
    />
  </MantineThemeProvider>
</template>
`

function ensureStyles() {
  const id = 'input-shared-styles-demo'
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    .input-demo-label { background-color: var(--mantine-color-blue-light); }
    .input-demo-input { border: 1px solid var(--mantine-color-violet-filled); }
  `
  document.head.appendChild(style)
}

const Demo = defineComponent({
  name: 'InputSharedStylesDemo',
  setup() {
    ensureStyles()
    const theme = {
      components: {
        Input: { classNames: { input: 'input-demo-input' } },
        InputWrapper: { classNames: { label: 'input-demo-label' } },
      },
    }
    return () =>
      h(
        MantineThemeProvider,
        { theme },
        {
          default: () => [
            h(TextInput, { label: 'Text input', placeholder: 'Text input' }),
            h(NativeSelect, {
              mt: 'md',
              label: 'Native select',
              data: ['React', 'Angular', 'Vue', 'Svelte'],
            }),
          ],
        },
      )
  },
})

export const sharedStyles: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  maxWidth: 340,
  code: [
    { fileName: 'Demo.vue', code, language: 'vue' },
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
  ],
}
