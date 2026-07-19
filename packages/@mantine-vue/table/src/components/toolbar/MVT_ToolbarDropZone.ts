import clsx from 'clsx'
import { Flex, Text, Transition } from '@mantine-vue/core'
import { defineComponent, h, watch, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_ToolbarDropZone.module.css'

export const MVT_ToolbarDropZone = defineComponent({
  name: 'MVTToolbarDropZone',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
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
    return () => {
      const { table } = props
      const state = table.getState()
      return h(Transition, { mounted: state.showToolbarDropZone, transition: 'fade' } as any, () =>
        h(
          Flex,
          {
            class: clsx(
              'mvt-toolbar-dropzone',
              classes.root,
              state.hoveredColumn?.id === 'drop-zone' && classes.hovered,
            ),
            ...attrs,
            onDragenter: () => table.setHoveredColumn({ id: 'drop-zone' }),
          },
          () =>
            h(Text, null, () =>
              table.options.localization.dropToGroupBy.replace(
                '{column}',
                String(state.draggingColumn?.columnDef?.header ?? ''),
              ),
            ),
        ),
      )
    }
  },
})
