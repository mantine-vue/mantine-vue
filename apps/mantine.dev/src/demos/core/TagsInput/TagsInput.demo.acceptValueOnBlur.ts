import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Value IS accepted on blur"
    placeholder="Enter text, then blur the field"
    :data="['React', 'Angular', 'Svelte']"
    accept-value-on-blur
  />
  <TagsInput
    label="Value IS NOT accepted on blur"
    placeholder="Enter text, then blur the field"
    :data="['React', 'Angular', 'Svelte']"
    :accept-value-on-blur="false"
    mt="md"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputAcceptValueOnBlurDemo',
  setup: () => () =>
    h('div', null, [
      h(TagsInput, {
        label: 'Value IS accepted on blur',
        placeholder: 'Enter text, then blur the field',
        data: ['React', 'Angular', 'Svelte'],
        acceptValueOnBlur: true,
      }),
      h(TagsInput, {
        label: 'Value IS NOT accepted on blur',
        placeholder: 'Enter text, then blur the field',
        data: ['React', 'Angular', 'Svelte'],
        acceptValueOnBlur: false,
        mt: 'md',
      }),
    ]),
})

export const acceptValueOnBlur: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
