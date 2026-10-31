<script setup lang="ts">
import { computed } from 'vue'
import { ActionIcon, CloseButton, Menu, Text, Tooltip } from '@mantine-vue/core'
import {
  resolveMenuItems,
  useActionContext,
  useFileManagerContext,
} from '../../FileManager.context'
import type { ResolvedMenuAction } from '../../FileManager.context'
import FileManagerIcon from '../../icons/FileManagerIcon.vue'
import FileManagerActionIcon from './FileManagerActionIcon.vue'
import FileManagerActionMenu from './FileManagerActionMenu.vue'

defineOptions({ name: 'FileManagerSelectionBar' })

const ctx = useFileManagerContext()
const { controller, labels, config, ui, getStyles } = ctx

const context = useActionContext(ctx, 'selection', () => controller.selectedEntries.value)

const count = computed(() => controller.selectedEntries.value.length)

const primary = computed(() =>
  resolveMenuItems(config.value.selectionActions, context.value, config.value).filter(
    (item) => item.action,
  ),
)

const secondary = computed(() => {
  const shown = new Set(primary.value.map((item) => item.key))

  return resolveMenuItems(config.value.itemMenu, context.value, config.value).filter(
    (item) => !shown.has(item.key),
  )
})

const run = (item: ResolvedMenuAction) => {
  void item.action?.run(context.value)
}

function close() {
  controller.clearSelection()
  ui.selectionMode.value = false
}
</script>

<template>
  <div
    v-if="count > 0"
    v-bind="getStyles('selectionBar')"
    role="toolbar"
    :aria-label="labels.toolbar"
  >
    <CloseButton size="md" :aria-label="labels.clearSelection" @click="close" />
    <Text size="sm" fw="500" style="flex: 1">{{ labels.selectedCount(count) }}</Text>
    <Tooltip v-for="item in primary" :key="item.key" :label="item.label">
      <ActionIcon
        variant="subtle"
        :color="item.action?.color ?? 'gray'"
        size="xl"
        :disabled="!item.enabled"
        :aria-label="item.label"
        :data-action="item.action?.id"
        @click="run(item)"
      >
        <FileManagerActionIcon :icon="item.action?.icon" :size="20" />
      </ActionIcon>
    </Tooltip>
    <Menu position="top-end" shadow="md" width="max-content">
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" size="xl" :aria-label="labels.moreActions">
          <FileManagerIcon name="dots" :size="20" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <FileManagerActionMenu :items="secondary" :context="context" />
      </Menu.Dropdown>
    </Menu>
  </div>
</template>
