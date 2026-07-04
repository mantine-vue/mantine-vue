import { defineComponent, h } from 'vue'
import { CodeHighlight, CodeHighlightControl } from '@mantine-vue/code-highlight'
import { PhChatCircle, PhCodesandboxLogo } from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const exampleCode = `
function greet() {
  return 'Hello, World!';
}
`

const code = `
<script setup lang="ts">
import { CodeHighlight, CodeHighlightControl } from '@mantine-vue/code-highlight'
import { PhCodesandboxLogo, PhChatCircle } from '@phosphor-icons/vue'
import { h } from 'vue'

const exampleCode = \`${exampleCode}\`

const controls = [
  h(
    CodeHighlightControl,
    {
      component: 'a',
      href: 'https://codesandbox.io',
      target: '_blank',
      tooltipLabel: 'Open on codesandbox',
      key: 'sandbox',
    },
    () => h(PhCodesandboxLogo),
  ),
  h(
    CodeHighlightControl,
    { tooltipLabel: 'Discuss with GPT', key: 'gpt' },
    () => h(PhChatCircle),
  ),
]
</script>

<template>
  <CodeHighlight :code="exampleCode" language="tsx" radius="md" :controls="controls" />
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightCustomControlDemo',
  setup: () => () =>
    h(CodeHighlight, {
      code: exampleCode,
      language: 'tsx',
      radius: 'md',
      controls: [
        h(
          CodeHighlightControl,
          {
            component: 'a',
            href: 'https://codesandbox.io',
            target: '_blank',
            tooltipLabel: 'Open on codesandbox',
            key: 'sandbox',
          },
          () => h(PhCodesandboxLogo),
        ),
        h(CodeHighlightControl, { tooltipLabel: 'Discuss with GPT', key: 'gpt' }, () =>
          h(PhChatCircle),
        ),
      ],
    }),
})

export const customControl: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
