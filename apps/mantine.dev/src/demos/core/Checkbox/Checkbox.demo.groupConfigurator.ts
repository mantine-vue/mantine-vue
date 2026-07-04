import { defineComponent, h } from 'vue'
import { Checkbox, CheckboxGroup, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox, CheckboxGroup, Group } from '@mantine-vue/core'
</script>

<template>
  <CheckboxGroup defaultValue="['react']"{{props}}>
    <Group mt="xs">
      <Checkbox value="react" label="React" />
      <Checkbox value="svelte" label="Svelte" />
      <Checkbox value="ng" label="Angular" />
      <Checkbox value="vue" label="Vue" />
    </Group>
  </CheckboxGroup>
</template>
`

const Wrapper = defineComponent({
  name: 'CheckboxGroupConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        CheckboxGroup,
        { defaultValue: ['react'], ...attrs },
        {
          default: () =>
            h(
              Group,
              { mt: 'xs' },
              {
                default: () => [
                  h(Checkbox, { value: 'react', label: 'React' }),
                  h(Checkbox, { value: 'svelte', label: 'Svelte' }),
                  h(Checkbox, { value: 'ng', label: 'Angular' }),
                  h(Checkbox, { value: 'vue', label: 'Vue' }),
                ],
              },
            ),
        },
      )
  },
})

export const groupConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    {
      prop: 'label',
      type: 'string',
      initialValue: 'Select your favorite frameworks/libraries',
      libraryValue: '',
    },
    { prop: 'description', type: 'string', initialValue: 'This is anonymous', libraryValue: '' },
    { prop: 'error', type: 'string', initialValue: '', libraryValue: '' },
    { prop: 'withAsterisk', type: 'boolean', initialValue: true, libraryValue: false },
  ],
}
