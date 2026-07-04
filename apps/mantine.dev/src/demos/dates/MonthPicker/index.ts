import { defineComponent, h } from 'vue'
import { MonthPicker } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({ name, setup: () => () => h(MonthPicker, props) })
}

const usageCode = `<script setup lang="ts">
import { MonthPicker } from '@mantine-vue/dates'
</script>

<template>
  <MonthPicker />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerUsageDemo'),
  code: usageCode,
}

const multipleCode = `<script setup lang="ts">
import { MonthPicker } from '@mantine-vue/dates'
</script>

<template>
  <MonthPicker type="multiple" />
</template>`

export const multiple: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerMultipleDemo', { type: 'multiple' }),
  code: multipleCode,
}

const rangeCode = `<script setup lang="ts">
import { MonthPicker } from '@mantine-vue/dates'
</script>

<template>
  <MonthPicker type="range" />
</template>`

export const range: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerRangeDemo', { type: 'range' }),
  code: rangeCode,
}

const minMaxCode = `<script setup lang="ts">
import { MonthPicker } from '@mantine-vue/dates'
</script>

<template>
  <MonthPicker min-date="2024-02-01" max-date="2024-10-01" />
</template>`

export const minMax: MantineDemo = {
  type: 'code',
  component: makeDemo('MonthPickerMinMaxDemo', { minDate: '2024-02-01', maxDate: '2024-10-01' }),
  code: minMaxCode,
}
