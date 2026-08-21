<script setup lang="ts">
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'

import type { MVT_RowData, MVT_TableInstance } from '../../types'

defineOptions({ name: 'MVTToggleFiltersButton', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

const title = computed(
  () => (attrs.title as string | undefined) ?? props.table.options.localization.showHideFilters,
)

const icon = computed(() => {
  const { IconFilter, IconFilterOff } = props.table.options.icons
  return props.table.getState().showColumnFilters ? IconFilterOff : IconFilter
})

const actionIconProps = computed<any>(() => ({
  'aria-label': title.value,
  color: 'gray',
  size: 'lg',
  variant: 'subtle',
  ...attrs,
  onClick: () => props.table.setShowColumnFilters((current) => !current),
}))
</script>

<template>
  <Tooltip :label="title" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps">
      <component :is="icon" />
    </ActionIcon>
  </Tooltip>
</template>
