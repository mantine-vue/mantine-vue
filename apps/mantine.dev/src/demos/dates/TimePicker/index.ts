import { defineComponent, h } from 'vue'
import { TimePicker } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

const usageCode = `<script setup lang="ts">
import { TimePicker } from '@mantine-vue/dates'
</script>

<template>
  <TimePicker />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: defineComponent({ name: 'TimePickerUsageDemo', setup: () => () => h(TimePicker) }),
  code: usageCode,
}

const withSecondsCode = `<script setup lang="ts">
import { TimePicker } from '@mantine-vue/dates'
</script>

<template>
  <TimePicker with-seconds />
</template>`

export const withSeconds: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'TimePickerWithSecondsDemo',
    setup: () => () => h(TimePicker, { withSeconds: true }),
  }),
  code: withSecondsCode,
}

const presetsCode = `<script setup lang="ts">
import { TimePicker } from '@mantine-vue/dates'
</script>

<template>
  <TimePicker
    with-dropdown
    :presets="[
      { value: '08:00', label: '8:00 am' },
      { value: '12:00', label: '12:00 pm' },
      { value: '18:00', label: '6:00 pm' },
    ]"
  />
</template>`

export const presets: MantineDemo = {
  type: 'code',
  component: defineComponent({
    name: 'TimePickerPresetsDemo',
    setup: () => () =>
      h(TimePicker, {
        withDropdown: true,
        presets: [
          { value: '08:00', label: '8:00 am' },
          { value: '12:00', label: '12:00 pm' },
          { value: '18:00', label: '6:00 pm' },
        ],
      }),
  }),
  code: presetsCode,
}
