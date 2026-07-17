import { defineComponent, h } from 'vue'
import { Button, ComboboxPopover } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Button, ComboboxPopover } from '@mantine-vue/core'
</script>

<template>
  <ComboboxPopover
    :data="['React', 'Angular', 'Svelte', 'Vue']"
    dropdown-opened
    default-value="React"{{props}}
  >
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200" :mb="150">Select framework</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const Wrapper = defineComponent({
  name: 'ComboboxPopoverCheckIconDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        ComboboxPopover,
        {
          data: ['React', 'Angular', 'Svelte', 'Vue'],
          dropdownOpened: true,
          defaultValue: 'React',
          ...attrs,
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200, mb: 150 }, () => 'Select framework'),
          ),
      )
  },
})

export const checkIcon: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
  controls: [
    { type: 'boolean', prop: 'withCheckIcon', initialValue: true, libraryValue: true },
    { type: 'boolean', prop: 'withAlignedLabels', initialValue: false, libraryValue: false },
    {
      type: 'segmented',
      prop: 'checkIconPosition',
      initialValue: 'left',
      libraryValue: 'left',
      data: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
    },
  ],
}
