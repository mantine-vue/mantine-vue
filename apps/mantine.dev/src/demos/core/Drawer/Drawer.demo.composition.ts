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
  <Drawer.Root :opened="opened" :on-close="close">
    <Drawer.Overlay />
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Drawer title</Drawer.Title>
        <Drawer.CloseButton />
      </Drawer.Header>
      <Drawer.Body>Drawer content</Drawer.Body>
    </Drawer.Content>
  </Drawer.Root>

  <Button variant="default" @click="open">Open Drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerCompositionDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Drawer.Root,
          { opened: opened.value, onClose: close },
          {
            default: () => [
              h(Drawer.Overlay),
              h(Drawer.Content, null, {
                default: () => [
                  h(Drawer.Header, null, {
                    default: () => [
                      h(Drawer.Title, null, () => 'Drawer title'),
                      h(Drawer.CloseButton),
                    ],
                  }),
                  h(Drawer.Body, null, () => 'Drawer content'),
                ],
              }),
            ],
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open Drawer'),
      ])
  },
})

export const composition: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
