import { defineComponent, h, ref } from 'vue'
import { Image, SimpleGrid, Text } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE, type FileWithPath } from '@mantine-vue/dropzone'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Text, Image, SimpleGrid } from '@mantine-vue/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine-vue/dropzone'
import type { FileWithPath } from '@mantine-vue/dropzone'

const files = ref<FileWithPath[]>([])

const previews = computed(() =>
  files.value.map((file) => {
    const imageUrl = URL.createObjectURL(file)
    return { url: imageUrl, key: file.name }
  }),
)
</script>

<template>
  <div>
    <Dropzone :accept="IMAGE_MIME_TYPE" @drop="(dropped) => (files = dropped)">
      <Text ta="center">Drop images here</Text>
    </Dropzone>

    <SimpleGrid :cols="{ base: 1, sm: 4 }" :mt="previews.length > 0 ? 'xl' : 0">
      <Image
        v-for="preview in previews"
        :key="preview.key"
        :src="preview.url"
        @load="() => URL.revokeObjectURL(preview.url)"
      />
    </SimpleGrid>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'DropzonePreviewDemo',
  setup() {
    const files = ref<FileWithPath[]>([])

    return () => {
      const previews = files.value.map((file, index) => {
        const imageUrl = URL.createObjectURL(file)
        return h(Image, {
          key: index,
          src: imageUrl,
          onLoad: () => URL.revokeObjectURL(imageUrl),
        })
      })

      return h('div', null, [
        h(
          Dropzone,
          { accept: IMAGE_MIME_TYPE, onDrop: (dropped: FileWithPath[]) => (files.value = dropped) },
          () => h(Text, { ta: 'center' }, () => 'Drop images here'),
        ),
        h(
          SimpleGrid,
          { cols: { base: 1, sm: 4 }, mt: previews.length > 0 ? 'xl' : 0 },
          () => previews,
        ),
      ])
    }
  },
})

export const preview: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
