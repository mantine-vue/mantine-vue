import { defineComponent, h } from 'vue'
import { CodeHighlight } from '@mantine-vue/code-highlight'
import type { MantineDemo } from '@/demo'

const exampleCode = `
type FilterPropsRes<T extends Record<string, any>> = {
  [Key in keyof T]-?: T[Key] extends undefined ? never : T[Key];
};

export function filterProps<T extends Record<string, any>>(props: T) {
  return Object.keys(props).reduce<FilterPropsRes<T>>((acc, key: keyof T) => {
    if (props[key] !== undefined) {
      acc[key] = props[key];
    }
    return acc;
  }, {} as FilterPropsRes<T>);
}
`

const code = `
<script setup lang="ts">
import { CodeHighlight } from '@mantine-vue/code-highlight'

const exampleCode = \`${exampleCode}\`
</script>

<template>
  <CodeHighlight :code="exampleCode" language="tsx" radius="md" />
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightUsageDemo',
  setup: () => () => h(CodeHighlight, { code: exampleCode, language: 'tsx', radius: 'md' }),
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
