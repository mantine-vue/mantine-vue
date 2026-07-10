import { defineComponent, h } from 'vue'
import { Button, Group, Text } from '@mantine-vue/core'
import { randomId, useForceUpdate } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, Group, Text } from '@mantine-vue/core'
import { randomId, useForceUpdate } from '@mantine-vue/hooks'

const forceUpdate = useForceUpdate()
</script>

<template>
  <Group justify="center">
    <Text>{{ randomId() }}</Text>
    <Button @click="forceUpdate">Force update</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'UseForceUpdateUsageDemo',
  setup() {
    const forceUpdate = useForceUpdate()

    return () =>
      h(Group, { justify: 'center' }, () => [
        h(Text, null, () => randomId()),
        h(Button, { onClick: forceUpdate }, () => 'Force update'),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
