import { defineComponent, h, ref } from 'vue'
import { Button, Drawer, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer, Group } from '@mantine-vue/core'

const opened = ref(false)
const size = ref<number | string>('md')

function open(s: number | string) {
  size.value = s
  opened.value = true
}
</script>

<template>
  <Drawer
    :opened="opened"
    @close="opened = false"
    padding="md"
    :size="size"
    :with-close-button="false"
  >
    Press escape to close the drawer
  </Drawer>

  <Group justify="center">
    <Button v-for="s in ['xs', 'sm', 'md', 'lg', 'xl', '100%', '40rem', '25%']" :key="s"
      variant="default" @click="open(s)">{{ s }}</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'DrawerSizesDemo',
  setup() {
    const opened = ref(false)
    const size = ref<number | string>('md')

    function open(s: number | string) {
      size.value = s
      opened.value = true
    }

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '100%', '40rem', '25%'] as const

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
            size: size.value,
            withCloseButton: false,
          },
          {
            default: () => 'Press escape to close the drawer',
          },
        ),
        h(Group, { justify: 'center' }, () =>
          sizes.map((s) =>
            h(Button, { key: s, variant: 'default', onClick: () => open(s) }, () => s),
          ),
        ),
      ])
  },
})

export const sizes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
