import { defineComponent, h } from 'vue'
import { Checkbox, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Checkbox :checked="true" label="regular checkbox" size="lg" color="lime.4" />
    <Checkbox autoContrast :checked="true" label="autoContrast checkbox" size="lg" color="lime.4" />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxAutoContrastDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(Checkbox, { checked: true, label: 'regular checkbox', size: 'lg', color: 'lime.4' }),
        h(Checkbox, {
          autoContrast: true,
          checked: true,
          label: 'autoContrast checkbox',
          size: 'lg',
          color: 'lime.4',
        }),
      ],
    }),
})

export const autoContrast: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
