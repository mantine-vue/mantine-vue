<script setup lang="ts">
import { computed } from 'vue'
import { Breadcrumbs, Menu, UnstyledButton } from '@mantine-vue/core'
import { ROOT_FOLDER_KEY } from '../../composables/use-file-manager-ui'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import type { FileEntry } from '../../types'

defineOptions({ name: 'FileManagerBreadcrumbs' })

const { controller, labels, ui, compact, getStyles } = useFileManagerContext()

const virtualLabel = computed(() => {
  const { type } = controller.location.value

  return type === 'folder' ? null : labels.value[type]
})

const path = computed<FileEntry[]>(() =>
  controller.folder.value ? [...controller.ancestors.value, controller.folder.value] : [],
)

/** Long paths keep both ends and fold the middle, so the row never wraps. */
const maxVisible = computed(() => (compact.value ? 2 : 5))
const collapsed = computed(() =>
  path.value.length > maxVisible.value ? path.value.slice(1, -(maxVisible.value - 1)) : [],
)
const tail = computed(() =>
  collapsed.value.length > 0 ? path.value.slice(-(maxVisible.value - 1)) : path.value.slice(1),
)
const root = computed(() => path.value[0])

const nameOf = (entry: FileEntry) => (entry.parentId === null ? labels.value.home : entry.name)
const open = (entry: FileEntry) => controller.openFolder(entry.parentId === null ? null : entry.id)

const dropProps = (entry: FileEntry) =>
  ui.getDropTargetProps(
    () => (entry.parentId === null ? null : entry.id),
    () => entry,
  )

const isDropTarget = (entry: FileEntry) =>
  ui.dropTarget.value === (entry.parentId === null ? ROOT_FOLDER_KEY : entry.id)
</script>

<template>
  <nav v-bind="getStyles('breadcrumbs')" :aria-label="labels.breadcrumbs">
    <span v-if="virtualLabel" data-current aria-current="page">{{ virtualLabel }}</span>

    <Breadcrumbs v-else-if="root" :separator-margin="4">
      <UnstyledButton
        v-bind="dropProps(root)"
        :aria-current="path.length === 1 ? 'page' : undefined"
        :data-current="path.length === 1 || undefined"
        :data-drop-target="isDropTarget(root) || undefined"
        @click="open(root)"
      >
        {{ nameOf(root) }}
      </UnstyledButton>

      <Menu v-if="collapsed.length > 0" shadow="md" position="bottom-start">
        <Menu.Target>
          <UnstyledButton :aria-label="labels.moreActions">
            <FileManagerIcon name="dots" :size="14" />
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item v-for="entry in collapsed" :key="entry.id" @click="open(entry)">
            {{ entry.name }}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <UnstyledButton
        v-for="(entry, index) in tail"
        v-bind="dropProps(entry)"
        :key="entry.id"
        :aria-current="index === tail.length - 1 ? 'page' : undefined"
        :data-current="index === tail.length - 1 || undefined"
        :data-drop-target="isDropTarget(entry) || undefined"
        @click="open(entry)"
      >
        {{ entry.name }}
      </UnstyledButton>
    </Breadcrumbs>
  </nav>
</template>
