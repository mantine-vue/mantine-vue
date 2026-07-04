import { defineComponent, h } from 'vue'
import { InlineDateTimePicker } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

// NOTE: mantine-vue's InlineDateTimePicker is currently an alias of
// DateTimePicker (see @mantine-vue/dates/src/index.ts) rather than a
// dedicated always-open inline layout - it still renders inside a
// popover/modal dropdown. This is a documented simplification.
function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup() {
      return () =>
        h(InlineDateTimePicker, {
          label: 'Pick date and time',
          placeholder: 'Pick date and time',
          ...props,
        })
    },
  })
}

const usageCode = `<script setup lang="ts">
import { InlineDateTimePicker } from '@mantine-vue/dates'
</script>

<template>
  <InlineDateTimePicker label="Pick date and time" placeholder="Pick date and time" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('InlineDateTimePickerUsageDemo'),
  code: usageCode,
}

const clearableCode = `<script setup lang="ts">
import { InlineDateTimePicker } from '@mantine-vue/dates'
</script>

<template>
  <InlineDateTimePicker
    clearable
    label="Pick date and time"
    placeholder="Pick date and time"
  />
</template>`

export const clearable: MantineDemo = {
  type: 'code',
  component: makeDemo('InlineDateTimePickerClearableDemo', { clearable: true }),
  code: clearableCode,
}
