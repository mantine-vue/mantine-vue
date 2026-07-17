import { defineComponent, h, ref, type VNodeChild } from 'vue'
import { Button, CheckIcon, ComboboxPopover, Group } from '@mantine-vue/core'
import {
  PhTextAlignCenter,
  PhTextAlignJustify,
  PhTextAlignLeft,
  PhTextAlignRight,
} from '@phosphor-icons/vue'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { ref } from 'vue'
import { Button, CheckIcon, ComboboxPopover, Group } from '@mantine-vue/core'
import type { ComboboxLikeRenderOptionInput, ComboboxItem } from '@mantine-vue/core'
import {
  PhTextAlignLeft,
  PhTextAlignCenter,
  PhTextAlignRight,
  PhTextAlignJustify,
} from '@phosphor-icons/vue'

const value = ref<string | null>(null)

const iconProps = { color: 'currentColor', opacity: 0.6, size: 18 }
const icons: Record<string, any> = {
  left: PhTextAlignLeft,
  center: PhTextAlignCenter,
  right: PhTextAlignRight,
  justify: PhTextAlignJustify,
}

const data = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' },
]

function renderOption({ option, checked }: ComboboxLikeRenderOptionInput<ComboboxItem>) {
  return h(Group, { flex: '1', gap: 'xs' }, () => [
    h(icons[option.value], iconProps),
    option.label,
    checked ? h(CheckIcon, { style: { marginInlineStart: 'auto' }, ...iconProps }) : null,
  ])
}
</script>

<template>
  <ComboboxPopover :data="data" :value="value" :render-option="renderOption" @change="value = $event">
    <ComboboxPopover.Target>
      <Button variant="default" :miw="200">{{ value || 'Select alignment' }}</Button>
    </ComboboxPopover.Target>
  </ComboboxPopover>
</template>
`

const iconProps = { color: 'currentColor', opacity: 0.6, size: 18 }
const icons: Record<string, any> = {
  left: PhTextAlignLeft,
  center: PhTextAlignCenter,
  right: PhTextAlignRight,
  justify: PhTextAlignJustify,
}

const data = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' },
]

const renderSelectOption = ({
  option,
  checked,
}: {
  option: { value: string; label: string }
  checked?: boolean
}): VNodeChild =>
  h(Group, { flex: '1', gap: 'xs' }, () => [
    icons[option.value] ? h(icons[option.value], iconProps) : null,
    option.label,
    checked ? h(CheckIcon, { style: { marginInlineStart: 'auto' }, ...iconProps }) : null,
  ])

const Demo = defineComponent({
  name: 'ComboboxPopoverRenderOptionDemo',
  setup() {
    const value = ref<string | null>(null)
    return () =>
      h(
        ComboboxPopover,
        {
          data,
          value: value.value,
          renderOption: renderSelectOption as any,
          onChange: (val: string | null) => {
            value.value = val
          },
        },
        () =>
          h(ComboboxPopover.Target, null, () =>
            h(Button, { variant: 'default', miw: 200 }, () => value.value || 'Select alignment'),
          ),
      )
  },
})

export const renderOption: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  defaultExpanded: false,
}
