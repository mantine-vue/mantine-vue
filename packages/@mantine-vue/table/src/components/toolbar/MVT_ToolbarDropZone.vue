<script setup lang="ts">
import clsx from 'clsx'
import { Flex, Text, Transition as MantineTransition } from '@mantine-vue/core'
import { computed, useAttrs, watch } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_ToolbarDropZone.module.css'

defineOptions({ name: 'MVTToolbarDropZone', inheritAttrs: false })

const props = defineProps<{ table: MVT_TableInstance<MVT_RowData> }>()

const attrs = useAttrs()

// Only drive the drop zone when the consumer keeps it in controlled state.
watch(
  () => {
    const state = props.table.getState()
    return [props.table.options.enableGrouping, state.draggingColumn, state.grouping] as const
  },
  ([enableGrouping, draggingColumn, grouping]) => {
    if (props.table.options.state?.showToolbarDropZone !== undefined) {
      props.table.setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      )
    }
  },
  { deep: true },
)

const isMounted = computed(() => props.table.getState().showToolbarDropZone)

const dropZoneProps = computed(() => ({
  class: clsx(
    'mvt-toolbar-dropzone',
    classes.root,
    props.table.getState().hoveredColumn?.id === 'drop-zone' && classes.hovered,
  ),
  ...attrs,
  onDragenter: () => props.table.setHoveredColumn({ id: 'drop-zone' }),
}))

const label = computed(() =>
  props.table.options.localization.dropToGroupBy.replace(
    '{column}',
    String(props.table.getState().draggingColumn?.columnDef?.header ?? ''),
  ),
)
</script>

<template>
  <MantineTransition :mounted="isMounted" transition="fade">
    <Flex v-bind="dropZoneProps">
      <Text>{{ label }}</Text>
    </Flex>
  </MantineTransition>
</template>
