import { defineComponent, h } from 'vue'
import { Calendar, DatePickerInput, DatesProvider } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { DatePickerInput, DatesProvider } from '@mantine-vue/dates'
</script>

<template>
  <DatesProvider :settings="{ locale: 'en', firstDayOfWeek: 1, timezone: 'UTC' }">
    <DatePickerInput label="Pick date" placeholder="Pick date" />
  </DatesProvider>
</template>`

const UsageDemo = defineComponent({
  name: 'DatesProviderUsageDemo',
  setup() {
    return () =>
      h(DatesProvider, { settings: { locale: 'en', firstDayOfWeek: 1, timezone: 'UTC' } }, () =>
        h(DatePickerInput, { label: 'Pick date', placeholder: 'Pick date' }),
      )
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: UsageDemo,
  code: usageCode,
}

const consistentWeeksCode = `<script setup lang="ts">
import { Calendar, DatesProvider } from '@mantine-vue/dates'
</script>

<template>
  <DatesProvider :settings="{ consistentWeeks: true }">
    <Calendar />
  </DatesProvider>
</template>`

const ConsistentWeeksDemo = defineComponent({
  name: 'DatesProviderConsistentWeeksDemo',
  setup() {
    return () => h(DatesProvider, { settings: { consistentWeeks: true } }, () => h(Calendar))
  },
})

export const consistentWeeks: MantineDemo = {
  type: 'code',
  component: ConsistentWeeksDemo,
  code: consistentWeeksCode,
}
