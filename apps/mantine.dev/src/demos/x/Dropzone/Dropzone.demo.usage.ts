import { defineComponent, h } from 'vue'
import type { MantineDemo } from '@/demo'
import { BaseDemo } from './_base'

const code = `
<script setup lang="ts">
import { Group, Text } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import { PhUploadSimple, PhImage, PhX } from '@phosphor-icons/vue'
</script>

<template>
  <Dropzone
    @drop="(files) => console.log('accepted files', files)"
    @reject="(files) => console.log('rejected files', files)"
    :max-size="5 * 1024 ** 2"
    :accept="IMAGE_MIME_TYPE"
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

      <div>
        <Text size="xl" inline>Drag images here or click to select files</Text>
        <Text size="sm" c="dimmed" inline :mt="7">
          Attach as many files as you like, each file should not exceed 5mb
        </Text>
      </div>
    </Group>
  </Dropzone>
</template>
`

const Demo = defineComponent({
  name: 'DropzoneUsageDemo',
  setup: () => () => h(BaseDemo),
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
