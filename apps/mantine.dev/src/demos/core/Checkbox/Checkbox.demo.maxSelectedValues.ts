import { defineComponent, h } from 'vue'
import { Checkbox, CheckboxGroup, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, CheckboxGroup, Group } from '@mantine-vue/core'
</script>

<template>
  <CheckboxGroup :defaultValue="['react']" :maxSelectedValues="2">
    <Group>
      <Checkbox value="react" label="React" />
      <Checkbox value="svelte" label="Svelte" />
      <Checkbox value="ng" label="Angular" />
      <Checkbox value="vue" label="Vue" />
    </Group>
  </CheckboxGroup>
</template>
`

const Demo = defineComponent({
  name: 'CheckboxMaxSelectedValuesDemo',
  setup: () => () =>
    h(
      CheckboxGroup,
      { defaultValue: ['react'], maxSelectedValues: 2 },
      {
        default: () =>
          h(Group, null, {
            default: () => [
              h(Checkbox, { value: 'react', label: 'React' }),
              h(Checkbox, { value: 'svelte', label: 'Svelte' }),
              h(Checkbox, { value: 'ng', label: 'Angular' }),
              h(Checkbox, { value: 'vue', label: 'Vue' }),
            ],
          }),
      },
    ),
})

export const maxSelectedValues: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
