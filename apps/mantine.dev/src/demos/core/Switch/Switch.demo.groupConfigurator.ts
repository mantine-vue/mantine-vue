import { defineComponent, h } from 'vue'
import { Group, Switch, SwitchGroup } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Switch, SwitchGroup, Group } from '@mantine-vue/core'
</script>

<template>
  <SwitchGroup :default-value="['react']" {{props}}>
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
  name: 'SwitchGroupConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        SwitchGroup,
        { defaultValue: ['react'], ...attrs },
        {
          default: () =>
            h(Group, { mt: 'xs' }, () => [
              h(Switch, { value: 'react', label: 'React' }),
              h(Switch, { value: 'svelte', label: 'Svelte' }),
              h(Switch, { value: 'ng', label: 'Angular' }),
              h(Switch, { value: 'vue', label: 'Vue' }),
            ]),
        },
      )
  },
})

export const groupConfigurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  controls: [
    {
      prop: 'label',
      type: 'string',
      initialValue: 'Select your favorite framework/library',
      libraryValue: '',
    },
    { prop: 'description', type: 'string', initialValue: 'This is anonymous', libraryValue: '' },
    { prop: 'error', type: 'string', initialValue: '', libraryValue: '' },
    { prop: 'withAsterisk', type: 'boolean', initialValue: true, libraryValue: false },
  ],
}
