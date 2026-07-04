import { defineComponent, h } from 'vue'
import { Button, Drawer } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Drawer, Button } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Drawer
    :opened="opened"
    :on-close="close"
    title="Authentication"
    :transition-props="{ transition: 'rotate-left', duration: 150, timingFunction: 'linear' }"
  >
    <!-- Drawer content -->
  </Drawer>

  <Button variant="default" @click="open">Open Drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerTransitionsDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Drawer,
          {
            opened: opened.value,
            onClose: close,
            title: 'Authentication',
            transitionProps: { transition: 'rotate-left', duration: 150, timingFunction: 'linear' },
          },
          {
            default: () => h('p', null, 'Drawer content goes here'),
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open Drawer'),
      ])
  },
})

export const transitions: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
