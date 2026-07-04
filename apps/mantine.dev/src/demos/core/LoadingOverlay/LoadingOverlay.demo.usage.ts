import { defineComponent, h } from 'vue'
import { Box, Button, Group, LoadingOverlay, PasswordInput, TextInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { LoadingOverlay, Button, Group, Box } from '@mantine-vue/core'

const [visible, { toggle }] = useDisclosure(false)
</script>

<template>
  <!-- Note that position: relative is required -->
  <Box pos="relative">
    <LoadingOverlay :visible="visible" :z-index="1000" :overlay-props="{ radius: 'sm', blur: 2 }" />
    <!-- ...other content -->
  </Box>

  <Group justify="center">
    <Button @click="toggle">Toggle overlay</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'LoadingOverlayUsageDemo',
  setup() {
    const [visible, { toggle }] = useDisclosure(false)

    return () =>
      h('div', null, [
        h(
          Box,
          { pos: 'relative' },
          {
            default: () => [
              h(LoadingOverlay, {
                visible: visible.value,
                zIndex: 1000,
                overlayProps: { radius: 'sm', blur: 2 },
              }),
              h(TextInput, {
                label: 'Email',
                placeholder: 'your@email.com',
                required: true,
                mt: 'md',
              }),
              h(PasswordInput, {
                label: 'Password',
                placeholder: 'Your password',
                required: true,
                mt: 'md',
              }),
              h(Button, { fullWidth: true, mt: 'xl' }, () => 'Sign in'),
            ],
          },
        ),
        h(
          Group,
          { justify: 'center', mt: 'xl' },
          {
            default: () => h(Button, { onClick: () => toggle() }, () => 'Toggle overlay'),
          },
        ),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
