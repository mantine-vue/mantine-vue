<script setup lang="ts">
import { Kbd, Menu } from '@mantine-vue/core'
import type { FileManagerActionContext } from '../../actions'
import type { ResolvedMenuAction } from '../../FileManager.context'
import FileManagerActionIcon from './FileManagerActionIcon.vue'

defineOptions({ name: 'FileManagerActionMenu' })

const props = defineProps<{
  /** Resolved items of the menu. */
  items: ResolvedMenuAction[]

  /** Context passed to the actions. */
  context: FileManagerActionContext

  /** Whether keyboard hints are shown. */
  withShortcuts?: boolean
}>()

const onSelect = (item: ResolvedMenuAction) => {
  void item.action?.run(props.context)
}
</script>

<template>
  <template v-for="item in props.items" :key="item.key">
    <Menu.Divider v-if="!item.action" />
    <Menu.Item
      v-else
      :disabled="!item.enabled"
      :color="item.action.color"
      :data-action="item.action.id"
      @click="onSelect(item)"
    >
      <template #leftSection>
        <FileManagerActionIcon :icon="item.action.icon" :size="16" />
      </template>
      <template v-if="props.withShortcuts && item.action.shortcutLabel" #rightSection>
        <Kbd size="xs">{{ item.action.shortcutLabel }}</Kbd>
      </template>
      {{ item.label }}
    </Menu.Item>
  </template>
</template>
