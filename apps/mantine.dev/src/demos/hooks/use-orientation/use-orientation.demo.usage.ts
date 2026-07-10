import { defineComponent, h } from 'vue'
import { Code, Text } from '@mantine-vue/core'
import { useOrientation } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Code, Text } from '@mantine-vue/core'
import { useOrientation } from '@mantine-vue/hooks'

const orientation = useOrientation()
</script>

<template>
  <Text>
    Angle: <Code>{{ orientation.angle }}</Code>
  </Text>
  <Text>
    Type: <Code>{{ orientation.type }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseOrientationUsageDemo',
  setup() {
    const orientation = useOrientation()

    return () =>
      h('div', [
        h(Text, () => ['Angle: ', h(Code, () => orientation.value.angle)]),
        h(Text, () => ['Type: ', h(Code, () => orientation.value.type)]),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
