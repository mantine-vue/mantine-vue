import { defineComponent, h } from 'vue'
import { DateInput } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup() {
      return () => h(DateInput, { label: 'Date input', placeholder: 'Pick date', ...props })
    },
  })
}

const usageCode = `<script setup lang="ts">
import { DateInput } from '@mantine-vue/dates'
</script>

<template>
  <DateInput label="Date input" placeholder="Pick date" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('DateInputUsageDemo'),
  code: usageCode,
}

const presetsCode = `<script setup lang="ts">
import { DateInput } from '@mantine-vue/dates'
</script>

<template>
  <DateInput
    label="Date input"
    placeholder="Pick date"
    :presets="[
      { value: new Date().toISOString().slice(0, 10), label: 'Today' },
    ]"
  />
</template>`

export const presets: MantineDemo = {
  type: 'code',
  component: makeDemo('DateInputPresetsDemo', {
    presets: [{ value: new Date().toISOString().slice(0, 10), label: 'Today' }],
  }),
  code: presetsCode,
}

const formatCode = `<script setup lang="ts">
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { DateInput } from '@mantine-vue/dates'

dayjs.extend(customParseFormat)
</script>

<template>
  <DateInput value-format="DD/MM/YYYY" label="Date input" placeholder="Pick date" />
</template>`

export const format: MantineDemo = {
  type: 'code',
  component: makeDemo('DateInputFormatDemo', { valueFormat: 'DD/MM/YYYY' }),
  code: formatCode,
}

const clearableCode = `<script setup lang="ts">
import dayjs from 'dayjs'
import { DateInput } from '@mantine-vue/dates'
</script>

<template>
  <DateInput
    clearable
    :default-value="dayjs().format('YYYY-MM-DD')"
    label="Date input"
    placeholder="Date input"
  />
</template>`

export const clearable: MantineDemo = {
  type: 'code',
  component: makeDemo('DateInputClearableDemo', {
    clearable: true,
    defaultValue: new Date().toISOString().slice(0, 10),
    placeholder: 'Date input',
  }),
  code: clearableCode,
}

const minMaxCode = `<script setup lang="ts">
import { DateInput } from '@mantine-vue/dates'
</script>

<template>
  <DateInput
    label="Date input"
    placeholder="Pick date"
    min-date="2024-01-05"
    max-date="2024-01-20"
  />
</template>`

export const minMax: MantineDemo = {
  type: 'code',
  component: makeDemo('DateInputMinMaxDemo', { minDate: '2024-01-05', maxDate: '2024-01-20' }),
  code: minMaxCode,
}

const disabledCode = `<script setup lang="ts">
import { DateInput } from '@mantine-vue/dates'
</script>

<template>
  <DateInput disabled label="Date input" placeholder="Pick date" />
</template>`

export const disabled: MantineDemo = {
  type: 'code',
  component: makeDemo('DateInputDisabledDemo', { disabled: true }),
  code: disabledCode,
}
