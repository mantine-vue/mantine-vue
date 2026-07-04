import { defineComponent, h, ref } from 'vue'
import { Button, Drawer, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer, Group } from '@mantine-vue/core'

type Position = 'top' | 'left' | 'right' | 'bottom'

const opened = ref(false)
const position = ref<Position>('top')

function open(p: Position) {
  position.value = p
  opened.value = true
}
</script>

<template>
  <Drawer
    :opened="opened"
    @close="opened = false"
    padding="md"
    :position="position"
    :with-close-button="false"
  >
    Press escape to close the drawer
  </Drawer>

  <Group justify="center">
    <Button variant="default" @click="open('left')">Left</Button>
    <Button variant="default" @click="open('right')">Right</Button>
    <Button variant="default" @click="open('top')">Top</Button>
    <Button variant="default" @click="open('bottom')">Bottom</Button>
  </Group>
</template>
`

type Position = 'top' | 'left' | 'right' | 'bottom'

const Demo = defineComponent({
  name: 'DrawerPositionsDemo',
  setup() {
    const opened = ref(false)
    const position = ref<Position>('top')

    function open(p: Position) {
      position.value = p
      opened.value = true
    }

    return () =>
      h('div', null, [
        h(
          Drawer,
          {
            opened: opened.value,
            onClose: () => {
              opened.value = false
            },
            padding: 'md',
            position: position.value,
            withCloseButton: false,
          },
          {
            default: () => 'Press escape to close the drawer',
          },
        ),
        h(Group, { justify: 'center' }, () => [
          h(Button, { variant: 'default', onClick: () => open('left') }, () => 'Left'),
          h(Button, { variant: 'default', onClick: () => open('right') }, () => 'Right'),
          h(Button, { variant: 'default', onClick: () => open('top') }, () => 'Top'),
          h(Button, { variant: 'default', onClick: () => open('bottom') }, () => 'Bottom'),
        ]),
      ])
  },
})

export const positions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
