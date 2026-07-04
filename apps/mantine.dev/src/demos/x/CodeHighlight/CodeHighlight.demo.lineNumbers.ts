import { defineComponent, h } from 'vue'
import { CodeHighlight } from '@mantine-vue/code-highlight'
import type { MantineDemo } from '@/demo'

const exampleCode = `
import { Group, Avatar, Text } from '@mantine-vue/core'

interface ItemProps {
  image: string
  label: string
  description: string
}

const SelectItem = defineComponent({
  props: { image: String, label: String, description: String },
  setup(props) {
    return () => (
      <Group>
        <Avatar src={props.image} />
        <div>
          <Text size="sm">{props.label}</Text>
          <Text size="xs" opacity={0.65}>
            {props.description}
          </Text>
        </div>
      </Group>
    )
  },
})
`

const code = `
<script setup lang="ts">
import { CodeHighlight } from '@mantine-vue/code-highlight'

const exampleCode = \`...\`
</script>

<template>
  <CodeHighlight :code="exampleCode" language="tsx" with-line-numbers />
</template>
`

const Demo = defineComponent({
  name: 'CodeHighlightLineNumbersDemo',
  setup: () => () =>
    h(CodeHighlight, { code: exampleCode, language: 'tsx', withLineNumbers: true }),
})

export const lineNumbers: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
