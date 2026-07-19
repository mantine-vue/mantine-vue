import { Box } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_RowPinButton } from '../buttons/MVT_RowPinButton'

export const MVT_TableBodyRowPinButton = defineComponent({
  name: 'MVTTableBodyRowPinButton',
  inheritAttrs: false,
  props: {
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    return () => {
      const { row, table } = props
      if (!parseFromValuesOrFunc(table.options.enableRowPinning, row as any)) return null
      const common = { ...attrs, row, table }
      if (table.options.rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
        return h(
          Box,
          {
            style: {
              display: 'flex',
              flexDirection: table.getState().density === 'xs' ? 'row' : 'column',
            },
          },
          () => [
            h(MVT_RowPinButton, { ...common, pinningPosition: 'top' } as any),
            h(MVT_RowPinButton, { ...common, pinningPosition: 'bottom' } as any),
          ],
        )
      }
      return h(MVT_RowPinButton, {
        ...common,
        pinningPosition: table.options.rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top',
      } as any)
    }
  },
})
