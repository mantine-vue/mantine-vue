import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { Button, Stack, Text } from '@mantine-vue/core'
import { useInterval } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Button, Stack, Text } from '@mantine-vue/core'
import { useInterval } from '@mantine-vue/hooks'

const seconds = ref(0)
const interval = useInterval(() => seconds.value++, 1000)

onMounted(interval.start)
onBeforeUnmount(interval.stop)
</script>

<template>
  <Stack align="center">
    <Text>Page loaded <b>{{ seconds }}</b> seconds ago</Text>
    <Button @click="interval.toggle" :color="interval.active.value ? 'red' : 'teal'">
      {{ interval.active.value ? 'Stop' : 'Start' }} counting
    </Button>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'UseIntervalUsageDemo',
  setup() {
    const seconds = ref(0)
    const interval = useInterval(() => seconds.value++, 1000)

    onMounted(interval.start)
    onBeforeUnmount(interval.stop)

    return () =>
      h(Stack, { align: 'center' }, () => [
        h(Text, null, () => ['Page loaded ', h('b', null, String(seconds.value)), ' seconds ago']),
        h(
          Button,
          { onClick: interval.toggle, color: interval.active.value ? 'red' : 'teal' },
          () => `${interval.active.value ? 'Stop' : 'Start'} counting`,
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
