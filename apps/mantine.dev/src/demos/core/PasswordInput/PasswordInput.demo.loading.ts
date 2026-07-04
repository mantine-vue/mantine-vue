import { defineComponent, h } from 'vue'
import { PasswordInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PasswordInput } from '@mantine-vue/core'
</script>

<template>
  <PasswordInput placeholder="Your password" loading />
</template>
`

const Demo = defineComponent({
  name: 'PasswordInputLoadingDemo',
  setup: () => () => h(PasswordInput, { placeholder: 'Your password', loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
