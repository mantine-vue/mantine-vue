import { defineComponent, h } from 'vue'
import { DateTimePicker } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup() {
      return () =>
        h(DateTimePicker, {
          label: 'Pick date and time',
          placeholder: 'Pick date and time',
          ...props,
        })
    },
  })
}

const usageCode = `<script setup lang="ts">
import { DateTimePicker } from '@mantine-vue/dates'
</script>

<template>
  <DateTimePicker label="Pick date and time" placeholder="Pick date and time" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('DateTimePickerUsageDemo'),
  code: usageCode,
}

const formatCode = `<script setup lang="ts">
import { DateTimePicker } from '@mantine-vue/dates'
</script>

<template>
  <DateTimePicker
    value-format="DD MMM YYYY hh:mm A"
    label="Pick date and time"
    placeholder="Pick date and time"
  />
</template>`

export const format: MantineDemo = {
  type: 'code',
  component: makeDemo('DateTimePickerFormatDemo', { valueFormat: 'DD MMM YYYY hh:mm A' }),
  code: formatCode,
}

const clearableCode = `<script setup lang="ts">
import { DateTimePicker } from '@mantine-vue/dates'
</script>

<template>
  <DateTimePicker clearable label="Pick date and time" placeholder="Pick date and time" />
</template>`

export const clearable: MantineDemo = {
  type: 'code',
  component: makeDemo('DateTimePickerClearableDemo', { clearable: true }),
  code: clearableCode,
}

const modalCode = `<script setup lang="ts">
import { DateTimePicker } from '@mantine-vue/dates'
</script>

<template>
  <DateTimePicker
    dropdown-type="modal"
    label="Pick date and time"
    placeholder="Pick date and time"
  />
</template>`

export const modal: MantineDemo = {
  type: 'code',
  component: makeDemo('DateTimePickerModalDemo', { dropdownType: 'modal' }),
  code: modalCode,
}
