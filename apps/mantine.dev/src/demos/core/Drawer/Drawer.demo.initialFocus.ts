import { defineComponent, h } from 'vue'
import { Button, Drawer, TextInput } from '@mantine-vue/core'
import { useDisclosure } from '@mantine-vue/hooks'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useDisclosure } from '@mantine-vue/hooks'
import { Drawer, Button, TextInput } from '@mantine-vue/core'

const [opened, { open, close }] = useDisclosure(false)
</script>

<template>
  <Drawer :opened="opened" :on-close="close" title="Focus demo">
    <TextInput label="First input" placeholder="First input" />
    <TextInput
      data-autofocus
      label="Input with initial focus"
      placeholder="It has data-autofocus attribute"
      mt="md"
    />
  </Drawer>

  <Button variant="default" @click="open">Open Drawer</Button>
</template>
`

const Demo = defineComponent({
  name: 'DrawerInitialFocusDemo',
  setup() {
    const [opened, { open, close }] = useDisclosure(false)
    return () =>
      h('div', null, [
        h(
          Drawer,
          { opened: opened.value, onClose: close, title: 'Focus demo' },
          {
            default: () => [
              h(TextInput, { label: 'First input', placeholder: 'First input' }),
              h(TextInput, {
                'data-autofocus': true,
                label: 'Input with initial focus',
                placeholder: 'It has data-autofocus attribute',
                mt: 'md',
              }),
            ],
          },
        ),
        h(Button, { variant: 'default', onClick: open }, () => 'Open Drawer'),
      ])
  },
})

export const initialFocus: MantineDemo = {
  type: 'code',
  code,
  centered: true,
  component: Demo,
}
