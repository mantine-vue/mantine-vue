import { defineComponent, h } from 'vue'
import { Checkbox, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Checkbox label="With boolean error" :error="true" />
    <Checkbox label="With error message" error="Must be checked" />
    <Checkbox label="No error styles" error="No error styles" :withErrorStyles="false" />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxErrorDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(Checkbox, { label: 'With boolean error', error: true }),
        h(Checkbox, { label: 'With error message', error: 'Must be checked' }),
        h(Checkbox, { label: 'No error styles', error: 'No error styles', withErrorStyles: false }),
      ],
    }),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
