import { defineComponent, h, ref } from 'vue'
import { Button, Group, Modal } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '55rem', '70%', '100%']

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group, Modal } from '@mantine-vue/core'

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '55rem', '70%', '100%']
const opened = ref(false)
const size = ref('md')
</script>

<template>
  <Modal
    :opened="opened"
    @close="opened = false"
    title="Introduce yourself!"
    :size="size"
  >
    Modal content goes here
  </Modal>

  <Group justify="center">
    <Button
      v-for="s in SIZES"
      :key="s"
      variant="default"
      @click="() => { size = s; opened = true }"
    >
      {{ s }}
    </Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'ModalSizesDemo',
  setup() {
    const opened = ref(false)
    const size = ref<string | number>('md')

    return () =>
      h('div', null, [
        h(
          Modal,
          {
            opened: opened.value,
            onClose: () => (opened.value = false),
            title: 'Introduce yourself!',
            size: size.value,
          },
          { default: () => h('p', null, 'Modal content goes here') },
        ),
        h(
          Group,
          { justify: 'center' },
          {
            default: () =>
              SIZES.map((s) =>
                h(
                  Button,
                  {
                    key: s,
                    variant: 'default',
                    onClick: () => {
                      size.value = s
                      opened.value = true
                    },
                  },
                  () => s,
                ),
              ),
          },
        ),
      ])
  },
})

export const sizes: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
