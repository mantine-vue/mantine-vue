import { defineComponent, h } from 'vue'
import { Checkbox, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Checkbox :checked="false" label="Default checkbox" />
    <Checkbox :checked="false" indeterminate label="Indeterminate checkbox" />
    <Checkbox :checked="true" label="Checked checkbox" />
    <Checkbox :checked="true" variant="outline" label="Outline checked checkbox" />
    <Checkbox variant="outline" indeterminate label="Outline indeterminate checkbox" />
    <Checkbox disabled label="Disabled checkbox" />
    <Checkbox disabled :checked="true" label="Disabled checked checkbox" />
    <Checkbox disabled indeterminate label="Disabled indeterminate checkbox" />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxStatesDemo',
  setup: () => () =>
    h(Stack, null, {
      default: () => [
        h(Checkbox, { checked: false, label: 'Default checkbox' }),
        h(Checkbox, { checked: false, indeterminate: true, label: 'Indeterminate checkbox' }),
        h(Checkbox, { checked: true, label: 'Checked checkbox' }),
        h(Checkbox, { checked: true, variant: 'outline', label: 'Outline checked checkbox' }),
        h(Checkbox, {
          variant: 'outline',
          indeterminate: true,
          label: 'Outline indeterminate checkbox',
        }),
        h(Checkbox, { disabled: true, label: 'Disabled checkbox' }),
        h(Checkbox, { disabled: true, checked: true, label: 'Disabled checked checkbox' }),
        h(Checkbox, {
          disabled: true,
          indeterminate: true,
          label: 'Disabled indeterminate checkbox',
        }),
      ],
    }),
})

export const states: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
