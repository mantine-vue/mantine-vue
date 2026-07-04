import { defineComponent, h } from 'vue'
import { TimeInput } from '@mantine-vue/dates'
import type { MantineDemo } from '@/demo'

function makeDemo(name: string, props: Record<string, any> = {}) {
  return defineComponent({
    name,
    setup: () => () => h(TimeInput, { label: 'Enter time', ...props }),
  })
}

const usageCode = `<script setup lang="ts">
import { TimeInput } from '@mantine-vue/dates'
</script>

<template>
  <TimeInput label="Enter time" />
</template>`

export const usage: MantineDemo = {
  type: 'code',
  component: makeDemo('TimeInputUsageDemo'),
  code: usageCode,
}

const withSecondsCode = `<script setup lang="ts">
import { TimeInput } from '@mantine-vue/dates'
</script>

<template>
  <TimeInput with-seconds label="Enter time" />
</template>`

export const withSeconds: MantineDemo = {
  type: 'code',
  component: makeDemo('TimeInputWithSecondsDemo', { withSeconds: true }),
  code: withSecondsCode,
}

const disabledCode = `<script setup lang="ts">
import { TimeInput } from '@mantine-vue/dates'
</script>

<template>
  <TimeInput disabled label="Enter time" />
</template>`

export const disabled: MantineDemo = {
  type: 'code',
  component: makeDemo('TimeInputDisabledDemo', { disabled: true }),
  code: disabledCode,
}
