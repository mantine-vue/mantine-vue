import { defineComponent, h } from 'vue'
import { Box, Button, Group, LoadingOverlay, PasswordInput, TextInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/types'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { LoadingOverlay, Button, Group, Box } from '@mantine-vue/core'

const [visible, { toggle }] = useDisclosure(false)
</script>

<template>
  <Box pos="relative">
    <LoadingOverlay :visible="visible" :loader-props="{ children: 'Loading...' }" />
    <!-- ...other content -->
  </Box>

  <Group justify="center">
    <Button @click="toggle">Toggle overlay</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'LoadingOverlayCustomLoaderDemo',
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
                loaderProps: { children: 'Loading...' },
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

export const customLoader: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
