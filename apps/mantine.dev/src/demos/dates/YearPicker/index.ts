import { defineComponent, h } from 'vue'
import { YearPicker } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({ name, setup: () => () => h(YearPicker, props) })
}

const usageCode = `<script setup lang="ts">
import { YearPicker } from '@mantine-vue/dates'
</script>

<template>
  <YearPicker />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('YearPickerUsageDemo'),
  code: usageCode,
}

const multipleCode = `<script setup lang="ts">
import { YearPicker } from '@mantine-vue/dates'
</script>

<template>
  <YearPicker type="multiple" />
</template>`

export const multiple: MantineDemo = {
  type: 'code',
  component: makeDemo('YearPickerMultipleDemo', { type: 'multiple' }),
  code: multipleCode,
}

const minMaxCode = `<script setup lang="ts">
import { YearPicker } from '@mantine-vue/dates'
</script>

<template>
  <YearPicker min-date="2020-01-01" max-date="2029-01-01" />
</template>`

export const minMax: MantineDemo = {
  type: 'code',
  component: makeDemo('YearPickerMinMaxDemo', { minDate: '2020-01-01', maxDate: '2029-01-01' }),
  code: minMaxCode,
}
