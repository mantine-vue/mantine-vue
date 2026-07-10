import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, rawValue } = useMask({
  mask: [/[0-2]/, /\\d/, ':', /[0-5]/, /\\d/],
})
</script>

<template>
  <TextInput :root-ref="ref" label="Time (HH:MM)" placeholder="__:__" />
  <Text size="sm" mt="sm">Raw value: {{ rawValue }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskRegexDemo',
  setup() {
    const { ref, rawValue } = useMask({
      mask: [/[0-2]/, /\d/, ':', /[0-5]/, /\d/],
    })

    return () =>
      h('div', [
        h(TextInput, { rootRef: ref, label: 'Time (HH:MM)', placeholder: '__:__' }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Raw value: ${rawValue.value}` }),
      ])
  },
})

export const regex: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
