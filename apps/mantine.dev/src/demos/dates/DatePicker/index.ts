import { defineComponent, h, ref } from 'vue'
import 'dayjs/locale/ru'
import { DatePicker } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup() {
      return () => h(DatePicker, props)
    },
  })
}

const usageCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerUsageDemo'),
  code: usageCode,
}

const deselectCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker allow-deselect />
</template>`

export const deselect: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerDeselectDemo', { allowDeselect: true }),
  code: deselectCode,
}

const multipleCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker type="multiple" />
</template>`

export const multiple: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerMultipleDemo', { type: 'multiple' }),
  code: multipleCode,
}

const rangeCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker type="range" />
</template>`

export const range: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerRangeDemo', { type: 'range' }),
  code: rangeCode,
}

const presetsCode = `<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@mantine-vue/dates'

const value = ref<string | null>(null)
</script>

<template>
  <DatePicker
    v-model="value"
    :presets="[
      { value: new Date().toISOString().slice(0, 10), label: 'Today' },
    ]"
  />
</template>`

const PresetsDemo = defineComponent({
  name: 'DatePickerPresetsDemo',
  setup() {
    const value = ref<string | null>(null)
    return () =>
      h(DatePicker, {
        value: value.value,
        onChange: (v: any) => (value.value = v),
        presets: [{ value: new Date().toISOString().slice(0, 10), label: 'Today' }],
      })
  },
})

export const presets: MantineDemo = {
  type: 'code',
  component: PresetsDemo,
  code: presetsCode,
}

const defaultDateCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker default-date="2015-02-01" />
</template>`

export const defaultDate: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerDefaultDateDemo', { defaultDate: '2015-02-01' }),
  code: defaultDateCode,
}

const minMaxCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker min-date="2024-01-05" max-date="2024-01-20" />
</template>`

export const minMax: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerMinMaxDemo', { minDate: '2024-01-05', maxDate: '2024-01-20' }),
  code: minMaxCode,
}

const firstDayOfWeekCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker :first-day-of-week="0" />
</template>`

export const firstDayOfWeek: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerFirstDayOfWeekDemo', { firstDayOfWeek: 0 }),
  code: firstDayOfWeekCode,
}

const hideOutsideDatesCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker hide-outside-dates />
</template>`

export const hideOutsideDates: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerHideOutsideDatesDemo', { hideOutsideDates: true }),
  code: hideOutsideDatesCode,
}

const withWeekNumbersCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker with-week-numbers />
</template>`

export const withWeekNumbers: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerWithWeekNumbersDemo', { withWeekNumbers: true }),
  code: withWeekNumbersCode,
}

const excludeDateCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'

function excludeDate(date: string) {
  const day = new Date(date).getDay()
  return day !== 5
}
</script>

<template>
  <DatePicker :exclude-date="excludeDate" />
</template>`

export const excludeDate: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerExcludeDateDemo', {
    excludeDate: (date: string) => new Date(date).getDay() !== 5,
  }),
  code: excludeDateCode,
}

const numberOfColumnsCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker :number-of-columns="2" />
</template>`

export const numberOfColumns: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerNumberOfColumnsDemo', { numberOfColumns: 2 }),
  code: numberOfColumnsCode,
}

const fullWidthCode = `<script setup lang="ts">
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker full-width />
</template>`

export const fullWidth: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerFullWidthDemo', { fullWidth: true }),
  code: fullWidthCode,
}

const localeCode = `<script setup lang="ts">
import 'dayjs/locale/ru'
import { DatePicker } from '@mantine-vue/dates'
</script>

<template>
  <DatePicker locale="ru" />
</template>`

export const locale: MantineDemo = {
  type: 'code',
  component: makeDemo('DatePickerLocaleDemo', { locale: 'ru' }),
  code: localeCode,
}
