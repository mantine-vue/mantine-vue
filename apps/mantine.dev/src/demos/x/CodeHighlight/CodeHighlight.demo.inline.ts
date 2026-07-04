import { defineComponent, h } from 'vue'
import { InlineCodeHighlight } from '@mantine-vue/code-highlight'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
import { InlineCodeHighlight } from '@mantine-vue/code-highlight'
</script>

<template>
  <Text>
    You can highlight code inline:
    <InlineCodeHighlight
      code='<InlineCodeHighlight code="" language="tsx" />'
      language="tsx"
      with-border
    />
    . Is that not cool?
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightInlineDemo',
  setup: () => () =>
    h(Text, null, () => [
      'You can highlight code inline: ',
      h(InlineCodeHighlight, {
        code: '<InlineCodeHighlight code="" language="tsx" />',
        language: 'tsx',
        withBorder: true,
      }),
      '. Is that not cool?',
    ]),
})

export const inline: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
