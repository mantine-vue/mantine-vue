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
  <Drawer :offset="8" radius="md" :opened="opened" :on-close="close" title="Authentication">
    <!-- Drawer content -->
  </Drawer>

  <Button variant="default" @click="open">Open Drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerOffsetDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Drawer,
          {
            offset: 8,
            radius: 'md',
            opened: opened.value,
            onClose: close,
            title: 'Authentication',
          },
          {
            default: () => h('p', null, 'Drawer content goes here'),
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open Drawer'),
      ])
  },
})

export const offset: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
