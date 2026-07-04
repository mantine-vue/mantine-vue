import { defineComponent, h } from 'vue'
import { Checkbox, CheckboxGroup, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, CheckboxGroup, Stack } from '@mantine-vue/core'
</script>

<template>
  <CheckboxGroup
    disabled
    label="Select your favorite frameworks/libraries"
    description="This is anonymous"
  >
    <Stack mt="xs">
      <Checkbox value="react" label="React" />
      <Checkbox value="svelte" label="Svelte" />
      <Checkbox value="angular" label="Angular" />
      <Checkbox value="vue" label="Vue" />
    </Stack>
  </CheckboxGroup>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxGroupDisabledDemo',
  setup: () => () =>
    h(
      CheckboxGroup,
      {
        disabled: true,
        label: 'Select your favorite frameworks/libraries',
        description: 'This is anonymous',
      },
      {
        default: () =>
          h(
            Stack,
            { mt: 'xs' },
            {
              default: () => [
                h(Checkbox, { value: 'react', label: 'React' }),
                h(Checkbox, { value: 'svelte', label: 'Svelte' }),
                h(Checkbox, { value: 'angular', label: 'Angular' }),
                h(Checkbox, { value: 'vue', label: 'Vue' }),
              ],
            },
          ),
      },
    ),
})

export const groupDisabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
