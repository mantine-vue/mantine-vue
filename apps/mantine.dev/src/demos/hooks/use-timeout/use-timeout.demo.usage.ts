import { defineComponent, h, ref } from 'vue'
import { Button, Group, Text } from '@mantine-vue/core'
import { randomId, useTimeout } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Text, Group } from '@mantine-vue/core'
import { randomId, useTimeout } from '@mantine-vue/hooks'

const value = ref('')
const { start, clear } = useTimeout(() => (value.value = randomId()), 1000)
</script>

<template>
  <Group>
    <Button @click="start">Start</Button>
    <Button @click="clear" color="red">Clear</Button>
    <Text>Random value: {{ value }}</Text>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseTimeoutUsageDemo',
  setup() {
    const value = ref('')
    const { start, clear } = useTimeout(() => {
      value.value = randomId()
    }, 1000)

    return () =>
      h(Group, null, () => [
        h(Button, { onClick: start }, { default: () => 'Start' }),
        h(Button, { onClick: clear, color: 'red' }, { default: () => 'Clear' }),
        h(Text, null, { default: () => `Random value: ${value.value}` }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
