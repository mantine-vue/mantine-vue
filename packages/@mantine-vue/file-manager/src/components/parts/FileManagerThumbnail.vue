<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { Image } from '@mantine-vue/core'
import { getFileCategory } from '../../core/file-types'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileManagerIconName } from '../../icons/icon-paths'
import type { FileCategory, FileEntry } from '../../types'

defineOptions({ name: 'FileManagerThumbnail' })

const props = withDefaults(
  defineProps<{
    /** Entry to depict. */
    entry: FileEntry

    /** Icon size. */
    size?: number

    /** Whether an image thumbnail replaces the icon when one is available. */
    withThumbnail?: boolean
  }>(),
  { size: 20, withThumbnail: false },
)

const CATEGORY_ICONS: Record<FileCategory, FileManagerIconName> = {
  folder: 'folder',
  image: 'fileImage',
  video: 'fileVideo',
  audio: 'fileAudio',
  pdf: 'filePdf',
  document: 'fileDocument',
  spreadsheet: 'fileSpreadsheet',
  presentation: 'filePresentation',
  archive: 'fileArchive',
  code: 'fileCode',
  text: 'fileText',
  other: 'file',
}

const { controller, config, getStyles, slots } = useFileManagerContext()

const category = computed(() => getFileCategory(props.entry))
const custom = computed(() => config.value.fileIcons[category.value])
const url = shallowRef<string | null>(null)

// Only images are asked for, the rest would be a request per row for a generic icon.
watch(
  () =>
    props.withThumbnail && (category.value === 'image' || category.value === 'video')
      ? props.entry
      : null,
  (entry) => {
    url.value = null

    if (entry) {
      void controller.getThumbnail(entry).then((result) => {
        if (props.entry.id === entry.id) {
          url.value = result
        }
      })
    }
  },
  { immediate: true },
)

const onImageError = () => {
  url.value = null
}
</script>

<template>
  <span
    v-bind="getStyles('itemIcon')"
    :data-category="category"
    :data-thumbnail="!!url || undefined"
  >
    <component :is="slots.itemIcon" v-if="slots.itemIcon" :entry="props.entry" />
    <Image v-else-if="url" :src="url" alt="" loading="lazy" @error="onImageError" />
    <component :is="custom" v-else-if="custom" :size="props.size" />
    <FileManagerIcon v-else :name="CATEGORY_ICONS[category]" :size="props.size" />
  </span>
</template>
