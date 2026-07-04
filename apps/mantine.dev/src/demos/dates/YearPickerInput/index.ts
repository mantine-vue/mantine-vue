import { defineComponent, h } from 'vue'
import { YearPickerInput } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup: () => () =>
      h(YearPickerInput, { label: 'Pick year', placeholder: 'Pick year', ...props }),
  })
}

const usageCode = `<script setup lang="ts">
import { YearPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <YearPickerInput label="Pick year" placeholder="Pick year" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('YearPickerInputUsageDemo'),
  code: usageCode,
}

const clearableCode = `<script setup lang="ts">
import { YearPickerInput } from '@mantine-vue/dates'
</script>

<template>
  <YearPickerInput clearable label="Pick year" placeholder="Pick year" />
</template>`

export const clearable: MantineDemo = {
  type: 'code',
  component: makeDemo('YearPickerInputClearableDemo', { clearable: true }),
  code: clearableCode,
}
