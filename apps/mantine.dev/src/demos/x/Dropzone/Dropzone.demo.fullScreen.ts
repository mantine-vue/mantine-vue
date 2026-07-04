import { defineComponent, h, ref } from 'vue'
import { Button, Group } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import type { MantineDemo } from '@/demo'
import { DropzoneDemoChildren } from './_base'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { Group, Button } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import { PhUploadSimple, PhImage, PhX } from '@phosphor-icons/vue'

const active = ref(false)
</script>

<template>
  <Group justify="center">
    <Button :color="active ? 'red' : 'blue'" @click="active = !active">
      {{ active ? 'Deactivate' : 'Activate' }} full screen dropzone
    </Button>
  </Group>

  <Dropzone.FullScreen
    :active="active"
    :accept="IMAGE_MIME_TYPE"
    @drop="(files) => { console.log(files); active = false }"
  >
    <Group justify="center" gap="xl" :mih="220" style="pointer-events: none">
      <Dropzone.Accept>
        <PhUploadSimple :size="52" color="var(--mantine-color-blue-6)" />
      </Dropzone.Accept>
      <Dropzone.Reject>
        <PhX :size="52" color="var(--mantine-color-red-6)" />
      </Dropzone.Reject>
      <Dropzone.Idle>
        <PhImage :size="52" color="var(--mantine-color-dimmed)" />
      </Dropzone.Idle>
    </Group>
  </Dropzone.FullScreen>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneFullScreenDemo',
  setup() {
    const active = ref(false)

    return () => [
      h(Group, { justify: 'center' }, () =>
        h(
          Button,
          { color: active.value ? 'red' : 'blue', onClick: () => (active.value = !active.value) },
          () => `${active.value ? 'Deactivate' : 'Activate'} full screen dropzone`,
        ),
      ),
      h(
        Dropzone.FullScreen,
        {
          active: active.value,
          accept: IMAGE_MIME_TYPE,
          onDrop: (files: any) => {
            console.log(files)
            active.value = false
          },
        },
        () => h(DropzoneDemoChildren),
      ),
    ]
  },
})

export const fullScreen: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
