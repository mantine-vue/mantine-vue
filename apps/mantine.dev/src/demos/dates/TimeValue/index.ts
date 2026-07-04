import { defineComponent, h } from 'vue'
import { TimeValue } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { TimeValue } from '@mantine-vue/dates'
</script>

<template>
  <TimeValue value="12:34" />
  <TimeValue value="12:34" format="hh:mm A" />
</template>`

const UsageDemo = defineComponent({
  name: 'TimeValueUsageDemo',
  setup() {
    return () => [
      h(TimeValue, { value: '12:34' }),
      h('br'),
      h(TimeValue, { value: '12:34', format: 'hh:mm A' }),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: UsageDemo,
  code: usageCode,
}
