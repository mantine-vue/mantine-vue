import { defineComponent, h } from 'vue'
import { Input } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Input } from '@mantine-vue/core'
</script>

<template>
  <Input placeholder="Your email" loading />
</template>
`

const Demo = defineComponent({
  name: 'InputLoadingDemo',
  setup: () => () => h(Input, { placeholder: 'Your email', loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
