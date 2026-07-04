import { defineComponent, h } from 'vue'
import { Fieldset, TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Fieldset, TextInput } from '@mantine-vue/core'
</script>

<template>
  <Fieldset legend="Personal information"{{props}}>
    <TextInput label="Your name" placeholder="Your name" />
    <TextInput label="Email" placeholder="Email" mt="md" />
  </Fieldset>
</template>
`

const Wrapper = defineComponent({
  name: 'FieldsetUsageDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Fieldset,
        { legend: 'Personal information', ...attrs },
        {
          default: () => [
            h(TextInput, { label: 'Your name', placeholder: 'Your name' }),
            h(TextInput, { label: 'Email', placeholder: 'Email', mt: 'md' }),
          ],
        },
      )
  },
})

export const usage: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  maxWidth: 500,
  centered: true,
  controls: [
    {
      type: 'segmented',
      prop: 'variant',
      initialValue: 'default',
      libraryValue: 'default',
      data: ['default', 'filled', 'unstyled'],
    },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
  ],
}
