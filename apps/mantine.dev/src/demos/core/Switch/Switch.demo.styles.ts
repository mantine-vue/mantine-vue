import { defineComponent, h } from 'vue'
import { Switch } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const cssCode = `.track {
  transition:
    background-color 200ms ease,
    border-color 200ms ease;

  input:checked + & {
    background-color: var(--mantine-color-lime-5);
    border-color: var(--mantine-color-lime-5);

    & > .thumb {
      background-color: var(--mantine-color-black);

      &::before {
        background-color: var(--mantine-color-lime-5);
      }
    }
  }
}`

const code = `
<script setup lang="ts">
import { Switch } from '@mantine-vue/core'
import classes from './Demo.module.css'
</script>

<template>
  <Switch :class-names="classes" size="lg" />
</template>
`

const Demo = defineComponent({
  name: 'SwitchStylesDemo',
  setup: () => () => h(Switch, { size: 'lg' }),
})

export const styles: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.module.css', code: cssCode, language: 'scss' },
    { fileName: 'Demo.vue', code, language: 'html' },
  ],
  centered: true,
  defaultExpanded: false,
}
