import { defineComponent, h, ref } from 'vue'
import { Button, Text } from '@mantine-vue/core'
import { useIsFirstRender } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Text } from '@mantine-vue/core'
import { useIsFirstRender } from '@mantine-vue/hooks'

const counter = ref(0)
const firstRender = useIsFirstRender()
</script>

<template>
  <div>
    <Text>
      Is first render:
      <Text span :c="firstRender ? 'teal' : 'red'">{{ firstRender ? 'Yes' : 'No!' }}</Text>
    </Text>
    <Button @click="counter++" mt="sm">Rerendered {{ counter }} times, click to rerender</Button>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'UseIsFirstRenderUsageDemo',
  setup() {
    const counter = ref(0)
    const firstRender = useIsFirstRender()

    return () =>
      h('div', [
        h(Text, () => [
          'Is first render: ',
          h(Text, { span: true, c: firstRender.value ? 'teal' : 'red' }, () =>
            firstRender.value ? 'Yes' : 'No!',
          ),
        ]),
        h(
          Button,
          { onClick: () => counter.value++, mt: 'sm' },
          { default: () => `Rerendered ${counter.value} times, click to rerender` },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
