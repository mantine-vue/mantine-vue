import { defineComponent, h } from 'vue'
import { Group, Switch, SwitchGroup } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Group, Switch, SwitchGroup } from '@mantine-vue/core'
</script>

<template>
  <SwitchGroup :default-value="['react']" :max-selected-values="2">
    <Group>
      <Switch value="react" label="React" />
      <Switch value="svelte" label="Svelte" />
      <Switch value="ng" label="Angular" />
      <Switch value="vue" label="Vue" />
    </Group>
  </SwitchGroup>
</template>
`

const Demo = defineComponent({
  name: 'SwitchMaxSelectedValuesDemo',
  setup: () => () =>
    h(
      SwitchGroup,
      { defaultValue: ['react'], maxSelectedValues: 2 },
      {
        default: () =>
          h(Group, null, () => [
            h(Switch, { value: 'react', label: 'React' }),
            h(Switch, { value: 'svelte', label: 'Svelte' }),
            h(Switch, { value: 'ng', label: 'Angular' }),
            h(Switch, { value: 'vue', label: 'Vue' }),
          ]),
      },
    ),
})

export const maxSelectedValues: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
