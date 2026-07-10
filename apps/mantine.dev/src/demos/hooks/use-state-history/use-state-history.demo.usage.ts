import { defineComponent, h } from 'vue'
import { Button, Code, Group, Text } from '@mantine-vue/core'
import { useStateHistory } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Code, Group, Text } from '@mantine-vue/core'
import { useStateHistory } from '@mantine-vue/hooks'

const [value, handlers, history] = useStateHistory(1)
</script>

<template>
  <Text>Current value: {{ value }}</Text>
  <Group my="md">
    <Button @click="handlers.set(Math.ceil(Math.random() * 100) + 1)">Set value</Button>
    <Button @click="handlers.back()">Back</Button>
    <Button @click="handlers.forward()">Forward</Button>
    <Button @click="handlers.reset()">Reset</Button>
  </Group>
  <Code block>{{ JSON.stringify(history, null, 2) }}</Code>
</template>
`

const Demo = defineComponent({
  name: 'UseStateHistoryUsageDemo',
  setup() {
    const [value, handlers, history] = useStateHistory(1)

    return () => [
      h(Text, null, () => `Current value: ${value.value}`),
      h(Group, { my: 'md' }, () => [
        h(
          Button,
          { onClick: () => handlers.set(Math.ceil(Math.random() * 100) + 1) },
          () => 'Set value',
        ),
        h(Button, { onClick: () => handlers.back() }, () => 'Back'),
        h(Button, { onClick: () => handlers.forward() }, () => 'Forward'),
        h(Button, { onClick: () => handlers.reset() }, () => 'Reset'),
      ]),
      h(Code, { block: true }, () => JSON.stringify(history.value, null, 2)),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
