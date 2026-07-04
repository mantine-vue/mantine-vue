import { defineComponent, h } from 'vue'
import { CodeHighlight } from '@mantine-vue/code-highlight'
import type { MantineDemo } from '@/demo'

const exampleCode = `
function Button() {
  return <button>Click me</button>;
}
`

const code = `
<script setup lang="ts">
import { CodeHighlight } from '@mantine-vue/code-highlight'

const exampleCode = \`${exampleCode}\`
</script>

<template>
  <CodeHighlight
    :code="'// Custom copy label' + exampleCode"
    language="tsx"
    copy-label="Copy button code"
    copied-label="Copied!"
    radius="md"
  />
  <CodeHighlight
    :code="'// Without copy button' + exampleCode"
    language="tsx"
    :with-copy-button="false"
    mt="md"
    radius="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightCopyDemo',
  setup: () => () => [
    h(CodeHighlight, {
      code: `// Custom copy label${exampleCode}`,
      language: 'tsx',
      copyLabel: 'Copy button code',
      copiedLabel: 'Copied!',
      radius: 'md',
    }),
    h(CodeHighlight, {
      code: `// Without copy button${exampleCode}`,
      language: 'tsx',
      withCopyButton: false,
      mt: 'md',
      radius: 'md',
    }),
  ],
})

export const copy: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
