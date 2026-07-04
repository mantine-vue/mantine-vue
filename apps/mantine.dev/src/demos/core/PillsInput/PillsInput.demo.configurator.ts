import { defineComponent, h } from 'vue'
import { Pill, PillsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PillsInput, Pill } from '@mantine-vue/core'
</script>

<template>
  <PillsInput {{props}}>
    <Pill.Group>
      <Pill>React</Pill>
      <Pill>Vue</Pill>
      <Pill>Svelte</Pill>
      <PillsInput.Field placeholder="Enter tags" />
    </Pill.Group>
  </PillsInput>
</template>
`

const Demo = defineComponent({
  name: 'PillsInputConfiguratorDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(PillsInput, { ...attrs }, () => [
        h(Pill.Group, null, () => [
          h(Pill, null, () => 'React'),
          h(Pill, null, () => 'Vue'),
          h(Pill, null, () => 'Svelte'),
          h(PillsInput.Field, { placeholder: 'Enter tags' }),
        ]),
      ])
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  maxWidth: 440,
  controls: [
    {
      type: 'segmented',
      prop: 'variant',
      data: ['default', 'filled', 'unstyled'],
      initialValue: 'default',
      libraryValue: 'default',
    },
    { type: 'size', prop: 'size', initialValue: 'sm', libraryValue: 'sm' },
    { type: 'size', prop: 'radius', initialValue: 'md', libraryValue: 'md' },
    { type: 'string', prop: 'label', initialValue: 'Input label', libraryValue: '' },
    { type: 'boolean', prop: 'withAsterisk', initialValue: false, libraryValue: false },
    { type: 'string', prop: 'description', initialValue: 'Input description', libraryValue: '' },
    { type: 'string', prop: 'error', initialValue: '', libraryValue: '' },
  ],
}
