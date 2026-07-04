import { defineComponent, h, ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'
import { BaseDemo } from './_base'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { Dropzone } from '@mantine-vue/dropzone'

const openRef = ref<() => void>()
</script>

<template>
  <Dropzone :open-ref="openRef" @drop="() => {}">
    <!-- children -->
  </Dropzone>

  <Group justify="center" mt="md">
    <Button @click="openRef?.()">Select files</Button>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneManualDemo',
  setup() {
    const openRef = ref<(() => void) | null>(null)

    return () => [
      h(BaseDemo, { openRef }),
      h(Group, { justify: 'center', mt: 'md' }, () =>
        h(Button, { onClick: () => openRef.value?.() }, () => 'Select files'),
      ),
    ]
  },
})

export const manual: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
