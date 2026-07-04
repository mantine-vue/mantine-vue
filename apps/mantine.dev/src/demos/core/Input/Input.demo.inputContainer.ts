import { defineComponent, h, ref } from 'vue'
import { TextInput, Tooltip } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { TextInput, Tooltip } from '@mantine-vue/core'

const focused = ref(false)
</script>

<template>
  <TextInput
    label="TextInput with tooltip"
    description="Tooltip will be relative to the input"
    placeholder="Focus me to see tooltip"
    @focus="focused = true"
    @blur="focused = false"
    :inputContainer="(children) => h(Tooltip, { label: 'Additional information', position: 'top-start', opened: focused }, () => children)"
  />
</template>
`

const Demo = defineComponent({
  name: 'InputContainerDemo',
  setup() {
    const focused = ref(false)
    return () =>
      h(TextInput, {
        label: 'TextInput with tooltip',
        description: 'Tooltip will be relative to the input',
        placeholder: 'Focus me to see tooltip',
        onFocus: () => {
          focused.value = true
        },
        onBlur: () => {
          focused.value = false
        },
        inputContainer: (children: any) =>
          h(
            Tooltip,
            { label: 'Additional information', position: 'top-start', opened: focused.value },
            () => children,
          ),
      })
  },
})

export const inputContainer: MantineDemo = {
  type: 'code',
  centered: true,
  maxWidth: 400,
  component: Demo,
  code,
}
