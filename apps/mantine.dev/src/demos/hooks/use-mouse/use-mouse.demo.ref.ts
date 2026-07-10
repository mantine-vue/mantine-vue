import { defineComponent, h } from 'vue'
import { Code, Group, Text } from '@mantine-vue/core'
import { useMouse } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Code, Group, Text } from '@mantine-vue/core'
import { useMouse } from '@mantine-vue/hooks'

const { ref: mouseRef, x, y } = useMouse()
</script>

<template>
  <Group justify="center">
    <!-- Bind the hook's ref to a plain native element, not a Mantine
         Vue component -- components don't forward refs to their root DOM node. -->
    <div ref="mouseRef" style="width: 300px; height: 180px; background: var(--mantine-color-blue-light)" />
  </Group>
  <Text ta="center" mt="sm">
    Mouse coordinates <Code>{{ \`{ x: \${x}, y: \${y} }\` }}</Code>
  </Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMouseRefDemo',
  setup() {
    const { ref: mouseRef, x, y } = useMouse<HTMLDivElement>()

    return () =>
      h('div', [
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              h('div', {
                ref: mouseRef,
                style: {
                  width: '300px',
                  height: '180px',
                  background: 'var(--mantine-color-blue-light)',
                },
              }),
          },
        ),
        h(
          Text,
          { ta: 'center', mt: 'sm' },
          {
            default: () => [
              'Mouse coordinates ',
              h(Code, null, { default: () => `{ x: ${x.value}, y: ${y.value} }` }),
            ],
          },
        ),
      ])
  },
})

export const ref: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
