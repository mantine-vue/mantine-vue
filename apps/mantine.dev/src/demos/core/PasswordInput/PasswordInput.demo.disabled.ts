import { defineComponent, h } from 'vue'
import { PasswordInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PasswordInput } from '@mantine-vue/core'
</script>

<template>
  <PasswordInput disabled label="Disabled password input" placeholder="Disabled password input" />
</template>
`

const Demo = defineComponent({
  name: 'PasswordInputDisabledDemo',
  setup: () => () =>
    h(PasswordInput, {
      disabled: true,
      label: 'Disabled password input',
      placeholder: 'Disabled password input',
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
