<script setup lang="ts">
import { computed } from 'vue'
import { ScrollArea, Stack, Text } from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'
import FileManagerEntryInfo from './FileManagerEntryInfo.vue'

defineOptions({ name: 'FileManagerDetailsPanel' })

const { controller, labels, config, getStyles } = useFileManagerContext()

const selected = computed(() => controller.selectedEntries.value)

/** Without a selection the panel describes the folder itself. */
const entry = computed(() =>
  selected.value.length === 1
    ? selected.value[0]
    : selected.value.length === 0
      ? controller.folder.value
      : null,
)

const totalSize = computed(() =>
  config.value.formatters.size(selected.value.reduce((total, item) => total + (item.size ?? 0), 0)),
)
</script>

<template>
  <ScrollArea v-bind="getStyles('detailsPanel')" role="complementary" :aria-label="labels.details">
    <FileManagerEntryInfo v-if="entry" :key="entry.id" :entry="entry" />
    <Stack v-else-if="selected.length > 1" gap="xs">
      <Text size="sm" fw="600">{{ labels.selectedCount(selected.length) }}</Text>
      <Text size="xs" c="dimmed">{{ labels.selectedSize }}: {{ totalSize }}</Text>
    </Stack>
    <Text v-else size="xs" c="dimmed">{{ labels.noSelection }}</Text>
  </ScrollArea>
</template>
