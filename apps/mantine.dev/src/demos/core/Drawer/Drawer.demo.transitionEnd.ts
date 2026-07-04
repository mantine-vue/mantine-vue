import { defineComponent, h, ref } from 'vue'
import { Button, Drawer, Group } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Drawer } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'

const [firstOpened, firstHandlers] = useDisclosure(false)
const [secondOpened, secondHandlers] = useDisclosure(false)

const drawerData = ref({ title: '', message: '' })
</script>

<template>
  <Drawer
    :opened="firstOpened"
    :on-close="() => { firstHandlers.close(); drawerData = { title: '', message: '' } }"
    :title="drawerData.title"
    :transition-props="{ duration: 300, exitDuration: 1000 }"
  >
    {{ drawerData.message }}
  </Drawer>

  <Drawer
    :opened="secondOpened"
    :on-close="secondHandlers.close"
    :on-exit-transition-end="() => { drawerData = { title: '', message: '' } }"
    :title="drawerData.title"
    :transition-props="{ duration: 300, exitDuration: 1000 }"
  >
    {{ drawerData.message }}
  </Drawer>

  <Group>
    <Button
      variant="default"
      @click="() => {
        firstHandlers.open()
        drawerData = { title: 'Edit your profile', message: 'Imagine a form here' }
      }"
    >
      Clear data in onClose
    </Button>
    <Button
      variant="default"
      @click="() => {
        secondHandlers.open()
        drawerData = { title: 'Edit your profile', message: 'Imagine a form here' }
      }"
    >
      Clear data in onExitTransitionEnd
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'DrawerTransitionEndDemo',
  setup() {
    const [firstOpened, firstHandlers] = useDisclosure(false)
    const [secondOpened, secondHandlers] = useDisclosure(false)
    const drawerData = ref({ title: '', message: '' })

    return () =>
      h('div', null, [
        h(
          Drawer,
          {
            opened: firstOpened.value,
            onClose: () => {
              firstHandlers.close()
              drawerData.value = { title: '', message: '' }
            },
            title: drawerData.value.title,
            transitionProps: { duration: 300, exitDuration: 1000 },
          },
          {
            default: () => drawerData.value.message,
          },
        ),
        h(
          Drawer,
          {
            opened: secondOpened.value,
            onClose: secondHandlers.close,
            onExitTransitionEnd: () => {
              drawerData.value = { title: '', message: '' }
            },
            title: drawerData.value.title,
            transitionProps: { duration: 300, exitDuration: 1000 },
          },
          {
            default: () => drawerData.value.message,
          },
        ),
        h(Group, null, () => [
          h(
            Button,
            {
              variant: 'default',
              onClick: () => {
                firstHandlers.open()
                drawerData.value = { title: 'Edit your profile', message: 'Imagine a form here' }
              },
            },
            () => 'Clear data in onClose',
          ),
          h(
            Button,
            {
              variant: 'default',
              onClick: () => {
                secondHandlers.open()
                drawerData.value = { title: 'Edit your profile', message: 'Imagine a form here' }
              },
            },
            () => 'Clear data in onExitTransitionEnd',
          ),
        ]),
      ])
  },
})

export const transitionEnd: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
  defaultExpanded: false,
}
