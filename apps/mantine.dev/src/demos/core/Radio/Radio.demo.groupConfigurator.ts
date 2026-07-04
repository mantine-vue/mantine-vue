import { defineComponent, h } from 'vue'
import { Group, Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio, Group } from '@mantine-vue/core'
</script>

<template>
  <Radio.Group
    name="favoriteFramework"
    default-value="react"
    {{props}}
  >
    <Group mt="xs">
      <Radio value="react" label="React" />
      <Radio value="svelte" label="Svelte" />
      <Radio value="ng" label="Angular" />
      <Radio value="vue" label="Vue" />
    </Group>
  </Radio.Group>
</template>
`

const Demo = defineComponent({
  name: 'RadioGroupConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        Radio.Group,
        { defaultValue: 'react', name: 'favoriteFramework', ...attrs },
        {
          default: () =>
            h(
              Group,
              { mt: 'xs' },
              {
                default: () => [
                  h(Radio, { value: 'react', label: 'React' }),
                  h(Radio, { value: 'svelte', label: 'Svelte' }),
                  h(Radio, { value: 'ng', label: 'Angular' }),
                  h(Radio, { value: 'vue', label: 'Vue' }),
                ],
              },
            ),
        },
      )
  },
})

export const groupConfigurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  centered: true,
  code,
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
