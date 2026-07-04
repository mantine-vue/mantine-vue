import { defineComponent, h } from 'vue'
import { MaskInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MaskInput } from '@mantine-vue/core'
</script>

<template>
  <MaskInput
    label="Time (HH:MM)"
    placeholder="__:__"
    :mask="[/[0-2]/, /\\d/, ':', /[0-5]/, /\\d/]"
  />
</template>
`

const Demo = defineComponent({
  name: 'MaskInputRegexDemo',
  setup: () => () =>
    h(MaskInput, {
      label: 'Time (HH:MM)',
      placeholder: '__:__',
      mask: [/[0-2]/, /\d/, ':', /[0-5]/, /\d/],
    }),
})

export const regex: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
