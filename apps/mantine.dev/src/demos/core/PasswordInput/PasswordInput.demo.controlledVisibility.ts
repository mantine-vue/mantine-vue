import { defineComponent, h } from 'vue'
import { PasswordInput, Stack } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PasswordInput, Stack } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [visible, { toggle }] = useDisclosure(false)
</script>

<template>
  <Stack>
    <PasswordInput
      label="Password"
      defaultValue="secret"
      :visible="visible"
      :onVisibilityChange="toggle"
    />
    <PasswordInput
      label="Confirm password"
      defaultValue="secret"
      :visible="visible"
      :onVisibilityChange="toggle"
    />
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'PasswordInputControlledVisibilityDemo',
  setup() {
    const [visible, { toggle }] = useDisclosure(false)
    return () =>
      h(Stack, null, {
        default: () => [
          h(PasswordInput, {
            label: 'Password',
            defaultValue: 'secret',
            visible: visible.value,
            onVisibilityChange: toggle,
          }),
          h(PasswordInput, {
            label: 'Confirm password',
            defaultValue: 'secret',
            visible: visible.value,
            onVisibilityChange: toggle,
          }),
        ],
      })
  },
})

export const controlledVisibility: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
