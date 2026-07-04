import { defineComponent, h, ref } from 'vue'
import 'dayjs/locale/ru'
import { MiniCalendar } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { MiniCalendar } from '@mantine-vue/dates'

const value = ref<string | null>('2025-04-15')
</script>

<template>
  <MiniCalendar :value="value" :number-of-days="6" @change="value = $event" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'MiniCalendarUsageDemo',
    setup() {
      const value = ref<string | null>('2025-04-15')
      return () =>
        h(MiniCalendar, {
          value: value.value,
          numberOfDays: 6,
          onChange: (date: string) => (value.value = date),
        })
    },
  }),
  code: usageCode,
}

const minMaxCode = `<script setup lang="ts">
import { ref } from 'vue'
import { MiniCalendar } from '@mantine-vue/dates'

const value = ref<string | null>('2025-04-15')
</script>

<template>
  <MiniCalendar
    :value="value"
    @change="value = $event"
    :number-of-days="6"
    default-date="2025-04-13"
    min-date="2025-04-14"
    max-date="2025-04-24"
  />
</template>`

export const minMax: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'MiniCalendarMinMaxDemo',
    setup() {
      const value = ref<string | null>('2025-04-15')
      return () =>
        h(MiniCalendar, {
          value: value.value,
          onChange: (date: string) => (value.value = date),
          numberOfDays: 6,
          defaultDate: '2025-04-13',
          minDate: '2025-04-14',
          maxDate: '2025-04-24',
        })
    },
  }),
  code: minMaxCode,
}

const localeCode = `<script setup lang="ts">
import 'dayjs/locale/ru'
import { MiniCalendar } from '@mantine-vue/dates'
</script>

<template>
  <MiniCalendar :number-of-days="6" default-date="2025-04-15" locale="ru" />
</template>`

export const locale: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'MiniCalendarLocaleDemo',
    setup: () => () =>
      h(MiniCalendar, { numberOfDays: 6, defaultDate: '2025-04-15', locale: 'ru' }),
  }),
  code: localeCode,
}
