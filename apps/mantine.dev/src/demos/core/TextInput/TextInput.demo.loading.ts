import { defineComponent, h } from 'vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <TextInput placeholder="Your email" loading />
</template>
`

const Demo = defineComponent({
  name: 'TextInputLoadingDemo',
  setup: () => () => h(TextInput, { placeholder: 'Your email', loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
