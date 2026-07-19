import { defineComponent, h, type PropType, type Ref } from 'vue'

import { type MVT_Column, type MVT_RowData, type MVT_TableInstance } from '../../types'
import { reorderColumn } from '../../utils/column.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_GrabHandleButton } from '../buttons/MVT_GrabHandleButton'

export const MVT_TableHeadCellGrabHandle = defineComponent({
  name: 'MVTTableHeadCellGrabHandle',
  inheritAttrs: false,
  props: {
    column: {
      type: Object as PropType<MVT_Column<MVT_RowData>>,
      required: true,
    },
    table: {
      type: Object as PropType<MVT_TableInstance<MVT_RowData>>,
      required: true,
    },
    tableHeadCellRef: {
      type: Object as PropType<Ref<HTMLTableCellElement | null>>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () => {
      const { column, table, tableHeadCellRef } = props
      const {
        getState,
        options: { enableColumnOrdering, mantineColumnDragHandleProps },
        setColumnOrder,
        setDraggingColumn,
        setHoveredColumn,
      } = table
      const { columnDef } = column

      const arg = { column, table }
      const actionIconProps = {
        ...parseFromValuesOrFunc(mantineColumnDragHandleProps, arg),
        ...parseFromValuesOrFunc(columnDef.mantineColumnDragHandleProps, arg),
        ...attrs,
      }

      const handleDragStart = (event: DragEvent) => {
        ;(actionIconProps as any)?.onDragStart?.(event)
        setDraggingColumn(column)
        event.dataTransfer?.setDragImage(tableHeadCellRef.value as HTMLElement, 0, 0)
      }

      const handleDragEnd = (event: DragEvent) => {
        ;(actionIconProps as any)?.onDragEnd?.(event)

        const { columnOrder, draggingColumn, hoveredColumn } = getState()
        if (hoveredColumn?.id === 'drop-zone') {
          column.toggleGrouping()
        } else if (
          enableColumnOrdering &&
          hoveredColumn &&
          hoveredColumn?.id !== draggingColumn?.id
        ) {
          setColumnOrder(
            reorderColumn(column, hoveredColumn as MVT_Column<MVT_RowData>, columnOrder),
          )
        }
        setDraggingColumn(null)
        setHoveredColumn(null)
      }

      return h(MVT_GrabHandleButton, {
        actionIconProps,
        onDragEnd: handleDragEnd,
        onDragStart: handleDragStart,
        table,
      } as any)
    }
  },
})
