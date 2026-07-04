import { defineComponent, h } from 'vue'
import { PhXCircle } from '@phosphor-icons/vue'
import { Button, Drawer } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhXCircle } from '@phosphor-icons/vue'
import { useDisclosure } from '@mantine-vue/hooks'
import { Drawer, Button } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Drawer
    :opened="opened"
    :on-close="close"
    title="Authentication"
    :close-button-props="{ icon: h(PhXCircle, { size: 20 }) }"
  >
    <!-- Drawer content -->
  </Drawer>

  <Button variant="default" @click="open">Open Drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerCloseIconDemo',
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
            closeButtonProps: { icon: h(PhXCircle, { size: 20 }) },
          },
          {
            default: () => h('p', null, 'Drawer content goes here'),
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open Drawer'),
      ])
  },
})

export const closeIcon: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
