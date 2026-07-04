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
  <Drawer :opened="opened" :on-close="close" title="Header is sticky">
    <p v-for="i in 100" :key="i">Drawer with scroll</p>
  </Drawer>

  <Button variant="default" @click="open">Open Drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerOverflowDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    const content = Array.from({ length: 100 }, (_, i) => h('p', { key: i }, 'Drawer with scroll'))
    return () =>
      h('div', null, [
        h(
          Drawer,
          { opened: opened.value, onClose: close, title: 'Header is sticky' },
          {
            default: () => content,
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open Drawer'),
      ])
  },
})

export const overflow: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
