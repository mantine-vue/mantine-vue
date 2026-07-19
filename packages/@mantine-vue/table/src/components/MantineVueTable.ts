import { defineComponent, h, type PropType, type Slots, type SlotsType } from 'vue'

import { useMantineVueTable } from '../hooks/useMantineVueTable'
import { type MVT_RowData, type MVT_TableInstance, type MVT_TableOptions } from '../types'
import { type MVT_TableSlots, provideMVT_Slots } from './MVT_TableSlots'
import { MVT_TablePaper } from './table/MVT_TablePaper'

export const MantineVueTable = defineComponent({
  name: 'MantineVueTable',
  inheritAttrs: false,
  props: {
    table: {
      type: Object as PropType<object>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<MVT_TableSlots>,
  setup(props, { attrs, slots }) {
    const table =
      (props.table as MVT_TableInstance<MVT_RowData> | undefined) ??
      useMantineVueTable(attrs as unknown as MVT_TableOptions<MVT_RowData>)

    const rawSlots = slots as unknown as Slots
    provideMVT_Slots(rawSlots)

    ;(table as any).setMVTSlots?.(rawSlots)
    return () => h(MVT_TablePaper, { table } as any)
  },
})
