<script setup lang="ts">
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { computed, useAttrs } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'

defineOptions({ name: 'MVTToggleGlobalFilterButton', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

const title = computed(
  () => (attrs.title as string | undefined) ?? props.table.options.localization.showHideSearch,
)

const icon = computed(() => {
  const { IconSearch, IconSearchOff } = props.table.options.icons
  return props.table.getState().showGlobalFilter ? IconSearchOff : IconSearch
})

const actionIconProps = computed<any>(() => {
  const { table } = props
  const state = table.getState()
  return {
    'aria-label': title.value,
    color: 'gray',
    disabled: !!state.globalFilter,
    size: 'lg',
    variant: 'subtle',
    ...attrs,
    onClick: () => {
      table.setShowGlobalFilter(!state.showGlobalFilter)
      setTimeout(() => table.refs.searchInputRef.value?.focus(), 100)
    },
  }
})
</script>

<template>
  <Tooltip :label="title" :withinPortal="true">
    <ActionIcon v-bind="actionIconProps">
      <component :is="icon" />
    </ActionIcon>
  </Tooltip>
</template>
