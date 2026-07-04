import { defineComponent, h } from 'vue'
import { Input, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const cssCode = `
.input {
  transition: none;

  &:focus-within {
    outline: 2px solid var(--mantine-color-blue-filled);
    border-color: transparent;
  }
}
`

const code = `
<script setup lang="ts">
import { Input, TextInput } from '@mantine-vue/core'
import classes from './Demo.module.css'
</script>

<template>
  <div>
    <Input placeholder="Regular Input component" :classNames="classes" />
    <TextInput
      placeholder="TextInput component"
      label="TextInput component"
      mt="md"
      :classNames="classes"
    />
  </div>
</template>
`

function ensureStyles() {
  const id = 'input-focus-styles-demo'
  if (document.getElementById(id)) return
  const style = document.createElement('style')
  style.id = id
  style.textContent = `
    .input-focus-demo-input {
      transition: none;
    }
    .input-focus-demo-input:focus-within {
      outline: 2px solid var(--mantine-color-blue-filled);
      border-color: transparent;
    }
  `
  document.head.appendChild(style)
}

const Demo = defineComponent({
  name: 'InputFocusStylesDemo',
  setup() {
    ensureStyles()
    const classes = { input: 'input-focus-demo-input' }
    return () =>
      h('div', null, [
        h(Input, { placeholder: 'Regular Input component', classNames: classes }),
        h(TextInput, {
          placeholder: 'TextInput component',
          label: 'TextInput component',
          mt: 'md',
          classNames: classes,
        }),
      ])
  },
})

export const focusStyles: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code: [
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
    { fileName: 'Demo.vue', code, language: 'vue' },
  ],
}
