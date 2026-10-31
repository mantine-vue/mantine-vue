<script setup lang="ts">
import { computed } from 'vue'
import { ScrollArea, Text, UnstyledButton } from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'
import type { FileManagerIconName } from '../../icons/icon-paths'
import type { FileManagerLocation } from '../../types'
import FileManagerActionIcon from './FileManagerActionIcon.vue'
import FileManagerFolderTree from './FileManagerFolderTree.vue'

defineOptions({ name: 'FileManagerSidebar' })

const { controller, labels, config, ui, compact, getStyles, slots } = useFileManagerContext()

interface QuickLink {
  location: FileManagerLocation
  label: string
  icon: FileManagerIconName
}

const quickLinks = computed(() => {
  const { favorites, recent, trash } = controller.capabilities.value
  const links: QuickLink[] = [
    { location: { type: 'folder', id: null }, label: labels.value.home, icon: 'home' },
  ]

  if (favorites) {
    links.push({ location: { type: 'favorites' }, label: labels.value.favorites, icon: 'star' })
  }

  if (recent) {
    links.push({ location: { type: 'recent' }, label: labels.value.recent, icon: 'clock' })
  }

  if (trash) {
    links.push({ location: { type: 'trash' }, label: labels.value.trash, icon: 'trash' })
  }

  return links
})

function isCurrent(link: QuickLink) {
  const current = controller.location.value

  if (current.type !== link.location.type) {
    return false
  }

  return current.type !== 'folder' || controller.folder.value?.parentId === null
}

function go(location: FileManagerLocation) {
  void controller.navigate(location)

  if (compact.value) {
    ui.sidebarOpened.value = false
  }
}

const onFolderSelect = (folderId: string | null) => go({ type: 'folder', id: folderId })
</script>

<template>
  <ScrollArea
    v-bind="getStyles('sidebar')"
    type="hover"
    :scrollbar-size="6"
    role="navigation"
    :aria-label="labels.sidebar"
  >
    <div v-if="config.sections.quickAccess" v-bind="getStyles('sidebarSection')">
      <Text v-bind="getStyles('sidebarLabel')" component="div">{{ labels.quickAccess }}</Text>
      <UnstyledButton
        v-for="link in quickLinks"
        v-bind="getStyles('quickLink')"
        :key="link.label"
        :data-active="isCurrent(link) || undefined"
        :aria-current="isCurrent(link) ? 'page' : undefined"
        :data-location="link.location.type"
        @click="go(link.location)"
      >
        <FileManagerActionIcon :icon="link.icon" :size="16" />
        <span>{{ link.label }}</span>
      </UnstyledButton>
    </div>

    <div v-if="config.sections.folderTree" v-bind="getStyles('sidebarSection')">
      <Text v-bind="getStyles('sidebarLabel')" component="div">{{ labels.folders }}</Text>
      <FileManagerFolderTree
        :with-drop="controller.capabilities.value.move"
        @select="onFolderSelect"
      />
    </div>

    <component :is="slots.sidebarFooter" v-if="slots.sidebarFooter" :controller="controller" />
  </ScrollArea>
</template>
