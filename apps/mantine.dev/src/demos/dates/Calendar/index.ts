import { defineComponent, h, ref } from 'vue'
import { Calendar } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { Calendar } from '@mantine-vue/dates'
</script>

<template>
  <Calendar />
</template>`

const UsageDemo = defineComponent({
  name: 'CalendarUsageDemo',
  setup() {
    return () => h(Calendar)
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: UsageDemo,
  code: usageCode,
}

const pickerCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Calendar } from '@mantine-vue/dates'

const dates = ref<string[]>([])

function handleSelect(date: string) {
  const isSelected = dates.value.includes(date)
  if (isSelected) {
    dates.value = dates.value.filter((d) => d !== date)
  } else if (dates.value.length < 3) {
    dates.value = [...dates.value, date]
  }
}
</script>

<template>
  <Calendar
    type="multiple"
    :value="dates"
    :get-day-props="(date) => ({
      selected: dates.includes(date),
      onClick: () => handleSelect(date),
    })"
  />
</template>`

const PickerDemo = defineComponent({
  name: 'CalendarPickerDemo',
  setup() {
    const dates = ref<string[]>([])
    return () =>
      h(Calendar, {
        type: 'multiple',
        value: dates.value,
        getDayProps: (date: string) => ({
          selected: dates.value.includes(date),
          onClick: () => {
            dates.value = dates.value.includes(date)
              ? dates.value.filter((d) => d !== date)
              : dates.value.length < 3
                ? [...dates.value, date]
                : dates.value
          },
        }),
      })
  },
})

export const picker: MantineDemo = {
  type: 'code',
  component: PickerDemo,
  code: pickerCode,
}

const fullWidthCode = `<script setup lang="ts">
import { Calendar } from '@mantine-vue/dates'
</script>

<template>
  <Calendar full-width />
</template>`

const FullWidthDemo = defineComponent({
  name: 'CalendarFullWidthDemo',
  setup() {
    return () => h(Calendar, { fullWidth: true })
  },
})

export const fullWidth: MantineDemo = {
  type: 'code',
  component: FullWidthDemo,
  code: fullWidthCode,
}

const isStaticCode = `<script setup lang="ts">
import { Calendar } from '@mantine-vue/dates'
</script>

<template>
  <Calendar static />
</template>`

const IsStaticDemo = defineComponent({
  name: 'CalendarIsStaticDemo',
  setup() {
    return () => h(Calendar, { static: true })
  },
})

export const isStatic: MantineDemo = {
  type: 'code',
  component: IsStaticDemo,
  code: isStaticCode,
}
