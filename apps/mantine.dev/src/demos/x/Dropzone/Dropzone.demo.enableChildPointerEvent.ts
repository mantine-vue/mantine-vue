import { defineComponent, h, ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { Dropzone } from '@mantine-vue/dropzone'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { Dropzone } from '@mantine-vue/dropzone'

const openRef = ref<() => void>()
</script>

<template>
  <Dropzone :open-ref="openRef" @drop="() => {}" :activate-on-click="false">
    <Group justify="center">
      <Button @click="openRef?.()" style="pointer-events: all">Select files</Button>
    </Group>
  </Dropzone>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneEnableChildPointerEventDemo',
  setup() {
    const openRef = ref<(() => void) | null>(null)

    return () =>
      h(Dropzone, { openRef, onDrop: () => {}, activateOnClick: false }, () =>
        h(Group, { justify: 'center' }, () =>
          h(
            Button,
            { onClick: () => openRef.value?.(), style: { pointerEvents: 'all' } },
            () => 'Select files',
          ),
        ),
      )
  },
})

export const enableChildPointerEvent: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
