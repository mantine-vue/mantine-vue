import { defineComponent, h } from 'vue'
import { Code, Text } from '@mantine-vue/core'
import { useMousePosition } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Code, Text } from '@mantine-vue/core'
import { useMousePosition } from '@mantine-vue/hooks'

const { x, y } = useMousePosition()
</script>

<template>
  <Text ta="center">
    Mouse coordinates <Code>{{ \`{ x: \${x}, y: \${y} }\` }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMouseUsageDemo',
  setup() {
    const { x, y } = useMousePosition()

    return () =>
      h(
        Text,
        { ta: 'center' },
        {
          default: () => [
            'Mouse coordinates ',
            h(Code, null, { default: () => `{ x: ${x.value}, y: ${y.value} }` }),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
