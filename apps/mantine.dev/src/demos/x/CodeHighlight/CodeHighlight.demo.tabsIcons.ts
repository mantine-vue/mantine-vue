import { defineComponent, h } from 'vue'
import { CodeHighlightTabs } from '@mantine-vue/code-highlight'
import { PhBracketsCurly, PhPalette } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const tsxCode = `
function Button() {
  return <button>Click me</button>;
}
`

const cssCode = `
.button {
  background-color: transparent;
  color: var(--mantine-color-blue-9);
}
`

const code = `
<script setup lang="ts">
import { CodeHighlightTabs } from '@mantine-vue/code-highlight'
import { PhBracketsCurly, PhPalette } from '@phosphor-icons/vue'
import { h } from 'vue'

const tsxCode = \`${tsxCode}\`

const cssCode = \`${cssCode}\`

const code = [
  {
    fileName: 'Button.vue',
    code: tsxCode,
    language: 'tsx',
    icon: h(PhBracketsCurly, { size: 14 }),
  },
  {
    fileName: 'Button.module.css',
    code: cssCode,
    language: 'scss',
    icon: h(PhPalette, { size: 14 }),
  },
]
</script>

<template>
  <CodeHighlightTabs radius="md" :code="code" />
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightTabsIconsDemo',
  setup: () => () =>
    h(CodeHighlightTabs, {
      radius: 'md',
      code: [
        {
          fileName: 'Button.vue',
          code: tsxCode,
          language: 'tsx',
          icon: h(PhBracketsCurly, { size: 14 }),
        },
        {
          fileName: 'Button.module.css',
          code: cssCode,
          language: 'scss',
          icon: h(PhPalette, { size: 14 }),
        },
      ],
    }),
})

export const tabsIcons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
