import { defineComponent, h } from 'vue'
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text, TextInput } from '@mantine-vue/core'
import { useMask } from '@mantine-vue/hooks'

const { ref, value, rawValue } = useMask({ mask: '(999) 999-9999' })
</script>

<template>
  <TextInput :root-ref="ref" label="Phone number" placeholder="(___) ___-____" />
  <Text size="sm" mt="sm">Masked value: {{ value }}</Text>
  <Text size="sm">Raw value: {{ rawValue }}</Text>
</template>
`

const Demo = defineComponent({
  name: 'UseMaskUsageDemo',
  setup() {
    const { ref, value, rawValue } = useMask({ mask: '(999) 999-9999' })

    return () =>
      h('div', [
        h(TextInput, { rootRef: ref, label: 'Phone number', placeholder: '(___) ___-____' }),
        h(Text, { size: 'sm', mt: 'sm' }, { default: () => `Masked value: ${value.value}` }),
        h(Text, { size: 'sm' }, { default: () => `Raw value: ${rawValue.value}` }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
