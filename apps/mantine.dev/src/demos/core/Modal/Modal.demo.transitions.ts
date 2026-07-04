import { defineComponent, h, ref } from 'vue'
import { Button, Group, Modal } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Modal, Group, Button } from '@mantine-vue/core'

const noTransitionOpened = ref(false)
const slowTransitionOpened = ref(false)
</script>

<template>
  <Modal
    :opened="slowTransitionOpened"
    :on-close="() => (slowTransitionOpened = false)"
    title="Please consider this"
    :transition-props="{ transition: 'rotate-left' }"
  >
    rotate-left transition
  </Modal>

  <Modal
    :opened="noTransitionOpened"
    :on-close="() => (noTransitionOpened = false)"
    title="Please consider this"
    :transition-props="{ transition: 'fade', duration: 600, timingFunction: 'linear' }"
  >
    fade transition 600ms linear transition
  </Modal>

  <Group justify="center">
    <Button variant="default" @click="slowTransitionOpened = true">Rotate left transition</Button>
    <Button variant="default" @click="noTransitionOpened = true">Fade transition</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ModalTransitionsDemo',
  setup() {
    const noTransitionOpened = ref(false)
    const slowTransitionOpened = ref(false)
    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: slowTransitionOpened.value,
            onClose: () => (slowTransitionOpened.value = false),
            title: 'Please consider this',
            transitionProps: { transition: 'rotate-left' },
          },
          { default: () => 'rotate-left transition' },
        ),
        h(
          Modal,
          {
            opened: noTransitionOpened.value,
            onClose: () => (noTransitionOpened.value = false),
            title: 'Please consider this',
            transitionProps: { transition: 'fade', duration: 600, timingFunction: 'linear' },
          },
          { default: () => 'fade transition 600ms linear transition' },
        ),
        h(
          Group,
          { justify: 'center' },
          {
            default: () => [
              h(
                Button,
                { variant: 'default', onClick: () => (slowTransitionOpened.value = true) },
                () => 'Rotate left transition',
              ),
              h(
                Button,
                { variant: 'default', onClick: () => (noTransitionOpened.value = true) },
                () => 'Fade transition',
              ),
            ],
          },
        ),
      ])
  },
})

export const transitions: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
