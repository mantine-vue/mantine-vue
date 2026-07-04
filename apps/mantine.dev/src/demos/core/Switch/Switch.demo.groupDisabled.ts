import { defineComponent, h } from 'vue'
import { Group, Switch, SwitchGroup } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch, SwitchGroup, Group } from '@mantine-vue/core'
</script>

<template>
  <SwitchGroup
    disabled
    label="Select your favorite framework/library"
    description="This is anonymous"
  >
    <Group mt="xs">
      <Switch value="react" label="React" />
      <Switch value="svelte" label="Svelte" />
      <Switch value="ng" label="Angular" />
      <Switch value="vue" label="Vue" />
    </Group>
  </SwitchGroup>
</template>
`

const Demo = defineComponent({
  name: 'SwitchGroupDisabledDemo',
  setup: () => () =>
    h(
      SwitchGroup,
      {
        disabled: true,
        label: 'Select your favorite framework/library',
        description: 'This is anonymous',
      },
      {
        default: () =>
          h(Group, { mt: 'xs' }, () => [
            h(Switch, { value: 'react', label: 'React' }),
            h(Switch, { value: 'svelte', label: 'Svelte' }),
            h(Switch, { value: 'ng', label: 'Angular' }),
            h(Switch, { value: 'vue', label: 'Vue' }),
          ]),
      },
    ),
})

export const groupDisabled: MantineDemo = {
  type: 'code',
  centered: true,
  component: Demo,
  code,
}
