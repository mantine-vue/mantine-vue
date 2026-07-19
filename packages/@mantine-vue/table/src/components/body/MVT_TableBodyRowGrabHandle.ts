import { defineComponent, h, type PropType, type Ref } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_GrabHandleButton } from '../buttons/MVT_GrabHandleButton'

export const MVT_TableBodyRowGrabHandle = defineComponent({
  name: 'MVTTableBodyRowGrabHandle',
  inheritAttrs: false,
  props: {
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    rowRef: { type: Object as PropType<Ref<HTMLTableRowElement | null>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const { row, table } = props
      const actionIconProps = {
        ...parseFromValuesOrFunc(table.options.mantineRowDragHandleProps, { row, table }),
        ...attrs,
      }
      return h(MVT_GrabHandleButton, {
        actionIconProps,
        table,
        onDragStart: (event: DragEvent) => {
          actionIconProps.onDragStart?.(event)
          if (props.rowRef.value) event.dataTransfer?.setDragImage(props.rowRef.value, 0, 0)
          table.setDraggingRow(row)
        },
        onDragEnd: (event: DragEvent) => {
          actionIconProps.onDragEnd?.(event)
          table.setDraggingRow(null)
          table.setHoveredRow(null)
        },
      } as any)
    }
  },
})
