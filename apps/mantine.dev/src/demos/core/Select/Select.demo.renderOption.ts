import { defineComponent, h } from 'vue'
import {
  PhTextAlignCenter,
  PhTextAlignJustify,
  PhTextAlignLeft,
  PhTextAlignRight,
  PhCheck,
} from '@phosphor-icons/vue'
import { Group, Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhTextAlignCenter, PhTextAlignJustify, PhTextAlignLeft, PhTextAlignRight, PhCheck } from '@phosphor-icons/vue'
import { Group, Select } from '@mantine-vue/core'

const iconProps = {
  color: 'currentColor',
  opacity: 0.6,
  size: 18,
}

const icons = {
  left: h(PhTextAlignLeft, iconProps),
  center: h(PhTextAlignCenter, iconProps),
  right: h(PhTextAlignRight, iconProps),
  justify: h(PhTextAlignJustify, iconProps),
}

const renderSelectOption = ({ option, checked }) =>
  h(Group, { flex: '1', gap: 'xs' }, () => [
    icons[option.value],
    option.label,
    checked ? h(PhCheck, { style: { marginInlineStart: 'auto' }, ...iconProps }) : null,
  ])
</script>

<template>
  <Select
    label="Select with renderOption"
    placeholder="Select text align"
    :data="[
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
      { value: 'justify', label: 'Justify' },
    ]"
    :render-option="renderSelectOption"
  />
</template>
`

const iconProps = {
  color: 'currentColor',
  opacity: 0.6,
  size: 18,
}

const icons: Record<string, ReturnType<typeof h>> = {
  left: h(PhTextAlignLeft, iconProps),
  center: h(PhTextAlignCenter, iconProps),
  right: h(PhTextAlignRight, iconProps),
  justify: h(PhTextAlignJustify, iconProps),
}

const renderOptionFn = ({
  option,
  checked,
}: {
  option: { value: string; label: string }
  checked: boolean
}) =>
  h(Group, { flex: '1', gap: 'xs' }, () => [
    icons[option.value],
    option.label,
    checked ? h(PhCheck, { style: { marginInlineStart: 'auto' }, ...iconProps }) : null,
  ])

const Demo = defineComponent({
  name: 'SelectRenderOptionDemo',
  setup: () => () =>
    h(Select, {
      label: 'Select with renderOption',
      placeholder: 'Select text align',
      data: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
        { value: 'justify', label: 'Justify' },
      ],
      renderOption: renderOptionFn,
    }),
})

export const renderOption: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
  defaultExpanded: false,
}
