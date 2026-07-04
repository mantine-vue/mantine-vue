import { defineComponent, h } from 'vue'
import { PhCalendar } from '@phosphor-icons/vue'
import { DatePickerInput } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup() {
      return () => h(DatePickerInput, { label: 'Pick date', placeholder: 'Pick date', ...props })
    },
  })
}

const usageCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput label="Pick date" placeholder="Pick date" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputUsageDemo'),
  code: usageCode,
}

const multipleCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput type="multiple" label="Pick dates" placeholder="Pick dates" />
</template>`

export const multiple: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputMultipleDemo', {
    type: 'multiple',
    label: 'Pick dates',
    placeholder: 'Pick dates',
  }),
  code: multipleCode,
}

const rangeCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput type="range" label="Pick dates range" placeholder="Pick dates range" />
</template>`

export const range: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputRangeDemo', {
    type: 'range',
    label: 'Pick dates range',
    placeholder: 'Pick dates range',
  }),
  code: rangeCode,
}

const presetsCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput
    label="Pick date"
    placeholder="Pick date"
    :presets="[
      { value: new Date().toISOString().slice(0, 10), label: 'Today' },
    ]"
  />
</template>`

export const presets: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputPresetsDemo', {
    presets: [{ value: new Date().toISOString().slice(0, 10), label: 'Today' }],
  }),
  code: presetsCode,
}

const valueFormatCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput
    value-format="DD/MM/YYYY"
    label="Pick date"
    placeholder="Pick date"
  />
</template>`

export const valueFormat: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputValueFormatDemo', { valueFormat: 'DD/MM/YYYY' }),
  code: valueFormatCode,
}

const clearableCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput clearable label="Pick date" placeholder="Pick date" />
</template>`

export const clearable: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputClearableDemo', { clearable: true }),
  code: clearableCode,
}

const minMaxCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput
    label="Pick date"
    placeholder="Pick date"
    min-date="2024-01-05"
    max-date="2024-01-20"
  />
</template>`

export const minMax: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputMinMaxDemo', {
    minDate: '2024-01-05',
    maxDate: '2024-01-20',
  }),
  code: minMaxCode,
}

const iconCode = `<script setup lang="ts">
import { PhCalendar } from '@phosphor-icons/vue'
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput
    label="Pick date"
    placeholder="Pick date"
    :left-section="h(PhCalendar, { size: 18 })"
  />
</template>`

export const icon: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputIconDemo', { leftSection: h(PhCalendar, { size: 18 }) }),
  code: iconCode,
}

const modalCode = `<script setup lang="ts">
import { DatePickerInput } from '@mantine-vue/dates'
</script>

<template>
  <DatePickerInput
    dropdown-type="modal"
    label="Pick date"
    placeholder="Pick date"
  />
</template>`

export const modal: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerInputModalDemo', { dropdownType: 'modal' }),
  code: modalCode,
}
