import { defineComponent, h } from 'vue'
import { Button, Group, Text } from '@mantine-vue/core'
import { useCounter } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, Text } from '@mantine-vue/core'
import { useCounter } from '@mantine-vue/hooks'

const [count, handlers] = useCounter(0, { min: 0, max: 10 })
</script>

<template>
  <Text size="md" ta="center" py="xs">Count: {{ count }}</Text>
  <Group justify="center">
    <Button size="xs" @click="handlers.increment">Increment</Button>
    <Button size="xs" @click="handlers.decrement">Decrement</Button>
    <Button size="xs" @click="handlers.reset">Reset</Button>
    <Button size="xs" @click="handlers.set(5)">Set 5</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseCounterUsageDemo',
  setup() {
    const [count, handlers] = useCounter(0, { min: 0, max: 10 })

    return () =>
      h('div', [
        h(Text, { size: 'md', ta: 'center', py: 'xs' }, { default: () => `Count: ${count.value}` }),
        h(
          Group,
          { justify: 'center' },
          {
            default: () => [
              h(
                Button,
                { size: 'xs', onClick: handlers.increment },
                { default: () => 'Increment' },
              ),
              h(
                Button,
                { size: 'xs', onClick: handlers.decrement },
                { default: () => 'Decrement' },
              ),
              h(Button, { size: 'xs', onClick: handlers.reset }, { default: () => 'Reset' }),
              h(Button, { size: 'xs', onClick: () => handlers.set(5) }, { default: () => 'Set 5' }),
            ],
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
