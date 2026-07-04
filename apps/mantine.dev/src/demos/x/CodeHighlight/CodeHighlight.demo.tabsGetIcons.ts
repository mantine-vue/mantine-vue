import { defineComponent, h, type VNodeChild } from 'vue'
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
import { h } from 'vue'
import { CodeHighlightTabs } from '@mantine-vue/code-highlight'
import { PhBracketsCurly, PhPalette } from '@phosphor-icons/vue'

const tsxCode = \`${tsxCode}\`

const cssCode = \`${cssCode}\`

function getFileIcon(fileName: string) {
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.vue')) {
    return h(PhBracketsCurly, { size: 14 })
  }

  if (fileName.endsWith('.css')) {
    return h(PhPalette, { size: 14 })
  }

  return null
}

const code = [
  { fileName: 'Button.vue', code: tsxCode, language: 'tsx' },
  { fileName: 'Button.module.css', code: cssCode, language: 'scss' },
]
</script>

<template>
  <CodeHighlightTabs :get-file-icon="getFileIcon" radius="md" :code="code" />
</template>
`

function getFileIcon(fileName: string): VNodeChild {
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx') || fileName.endsWith('.vue')) {
    return h(PhBracketsCurly, { size: 14 })
  }

  if (fileName.endsWith('.css')) {
    return h(PhPalette, { size: 14 })
  }

  return null
}

const Demo = defineComponent({
  name: 'CodeHighlightTabsGetIconsDemo',
  setup: () => () =>
    h(CodeHighlightTabs, {
      getFileIcon,
      radius: 'md',
      code: [
        { fileName: 'Button.vue', code: tsxCode, language: 'tsx' },
        { fileName: 'Button.module.css', code: cssCode, language: 'scss' },
      ],
    }),
})

export const tabsGetIcons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
