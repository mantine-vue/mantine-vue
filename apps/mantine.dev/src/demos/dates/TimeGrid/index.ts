import { defineComponent, h, ref } from 'vue'
import { getTimeRange, TimeGrid } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { getTimeRange, TimeGrid } from '@mantine-vue/dates'

const value = ref<string | undefined>()
const data = getTimeRange('08:00', '18:00', 60 * 60)
</script>

<template>
  <TimeGrid :data="data" v-model="value" />
</template>`

const UsageDemo = defineComponent({
  name: 'TimeGridUsageDemo',
  setup() {
    const value = ref<string | undefined>()
    const data = getTimeRange('08:00', '18:00', 60 * 60)
    return () =>
      h(TimeGrid, {
        data,
        value: value.value,
        onChange: (v: string | null) => (value.value = v ?? undefined),
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: UsageDemo,
  code: usageCode,
}
