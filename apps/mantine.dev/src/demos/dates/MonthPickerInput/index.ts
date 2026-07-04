import { defineComponent, h } from 'vue'
import { MonthPickerInput } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup: () => () =>
      h(MonthPickerInput, { label: 'Pick month', placeholder: 'Pick month', ...props }),
  })
}

const usageCode = `<script setup lang="ts">
import { MonthPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <MonthPickerInput label="Pick month" placeholder="Pick month" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerInputUsageDemo'),
  code: usageCode,
}

const rangeCode = `<script setup lang="ts">
import { MonthPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <MonthPickerInput type="range" label="Pick months range" placeholder="Pick months range" />
</template>`

export const range: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerInputRangeDemo', {
    type: 'range',
    label: 'Pick months range',
    placeholder: 'Pick months range',
  }),
  code: rangeCode,
}

const clearableCode = `<script setup lang="ts">
import { MonthPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <MonthPickerInput clearable label="Pick month" placeholder="Pick month" />
</template>`

export const clearable: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerInputClearableDemo', { clearable: true }),
  code: clearableCode,
}
