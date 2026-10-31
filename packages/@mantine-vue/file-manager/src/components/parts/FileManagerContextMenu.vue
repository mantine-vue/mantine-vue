<script setup lang="ts">
import { computed } from 'vue'
import { Menu } from '@mantine-vue/core'
import {
  resolveMenuItems,
  useFileManagerContext,
  useActionContext,
} from '../../FileManager.context'
import FileManagerActionMenu from './FileManagerActionMenu.vue'

defineOptions({ name: 'FileManagerContextMenu' })

const ctx = useFileManagerContext()
const { ui, config, labels } = ctx

const state = ui.contextMenu

const context = useActionContext(
  ctx,
  state.value?.scope ?? 'item',
  () => state.value?.entries ?? [],
)

const actionContext = computed(() => ({
  ...context.value,
  scope: state.value?.scope ?? ('item' as const),
}))

const items = computed(() => {
  const menu = state.value

  if (!menu) {
    return []
  }

  return resolveMenuItems(
    menu.scope === 'background' ? config.value.backgroundMenu : config.value.itemMenu,
    actionContext.value,
    config.value,
  )
})

const anchorStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${state.value?.y ?? 0}px`,
  left: `${state.value?.x ?? 0}px`,
  width: '0',
  height: '0',
}))

function onOpenedChange(opened: boolean) {
  if (!opened && state.value) {
    ui.closeContextMenu()
  }
}
</script>

<template>
  <Menu
    :opened="!!state && items.length > 0"
    position="bottom-start"
    shadow="md"
    width="max-content"
    :transition-props="{ duration: 0 }"
    :return-focus="false"
    @update:opened="onOpenedChange"
  >
    <Menu.Target>
      <span :style="anchorStyle" />
    </Menu.Target>
    <Menu.Dropdown :aria-label="labels.moreActions">
      <FileManagerActionMenu :items="items" :context="actionContext" with-shortcuts />
    </Menu.Dropdown>
  </Menu>
</template>
