import { defineComponent, h } from 'vue'
import { Input, InputPlaceholder } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Input, InputPlaceholder } from '@mantine-vue/core'
</script>

<template>
  <Input component="button" pointer>
    <InputPlaceholder>Placeholder content</InputPlaceholder>
  </Input>
</template>
`

const Demo = defineComponent({
  name: 'InputPlaceholderDemo',
  setup: () => () =>
    h(
      Input,
      { component: 'button', pointer: true },
      {
        default: () => h(InputPlaceholder, {}, { default: () => 'Placeholder content' }),
      },
    ),
})

export const placeholder: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
