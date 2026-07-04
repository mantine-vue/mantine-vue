import { defineComponent, h } from 'vue'
import { PasswordInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PasswordInput } from '@mantine-vue/core'
</script>

<template>
  <PasswordInput label="Boolean error" placeholder="Boolean error" error />
  <PasswordInput
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
  />
</template>
`

const Demo = defineComponent({
  name: 'PasswordInputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(PasswordInput, { label: 'Boolean error', placeholder: 'Boolean error', error: true }),
      h(PasswordInput, {
        mt: 'md',
        label: 'With error message',
        placeholder: 'With error message',
        error: 'Invalid name',
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
