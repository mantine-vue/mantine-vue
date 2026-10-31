<script setup lang="ts">
import { computed } from 'vue'
import { Loader } from '@mantine-vue/core'
import { useFileManagerContext } from '../../FileManager.context'

defineOptions({ name: 'FileManagerStatusBar' })

const { controller, labels, config, getStyles } = useFileManagerContext()

const selected = computed(() => controller.selectedEntries.value)
const hasSelection = computed(() => selected.value.length > 0)

const selectedSize = computed(() => {
  const total = selected.value.reduce((sum, entry) => sum + (entry.size ?? 0), 0)

  return total > 0 ? config.value.formatters.size(total) : ''
})

const busy = computed(
  () =>
    controller.pendingOperations.value > 0 ||
    controller.searching.value ||
    controller.loading.value,
)

const count = computed(() => controller.total.value ?? controller.visibleEntries.value.length)

const summary = computed(() =>
  controller.isSearching.value || Object.keys(controller.filters.value).length > 0
    ? labels.value.itemsCount(controller.visibleEntries.value.length)
    : labels.value.itemsCount(count.value),
)
</script>

<template>
  <div v-bind="getStyles('statusBar')" role="status" :aria-label="labels.statusBar">
    <span>{{ summary }}</span>
    <span v-if="hasSelection">
      {{ labels.selectedCount(selected.length) }}
      <template v-if="selectedSize">· {{ selectedSize }}</template>
    </span>
    <Loader v-if="busy" size="12" ml="auto" :aria-label="labels.loading" />
  </div>
</template>
