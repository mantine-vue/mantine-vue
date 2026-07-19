import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, ref, type PropType } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'

export const MVT_RowPinButton = defineComponent({
  name: 'MVTRowPinButton',
  inheritAttrs: false,
  props: {
    pinningPosition: { type: String as PropType<'bottom' | 'top'>, required: true },
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs }) {
    const opened = ref(false)
    return () => {
      const { row, table } = props
      const pinned = row.getIsPinned()
      const label = pinned ? table.options.localization.unpin : table.options.localization.pin
      return h(Tooltip, { label, openDelay: 1000, opened: opened.value }, () =>
        h(
          ActionIcon,
          {
            'aria-label': table.options.localization.pin,
            color: 'gray',
            size: 'xs',
            style: { height: '24px', width: '24px' },
            variant: 'subtle',
            ...attrs,
            onMouseenter: () => {
              opened.value = true
            },
            onMouseleave: () => {
              opened.value = false
            },
            onClick: (event: MouseEvent) => {
              opened.value = false
              event.stopPropagation()
              row.pin(pinned ? false : props.pinningPosition)
            },
          } as any,
          () =>
            pinned
              ? h(table.options.icons.IconX)
              : h(table.options.icons.IconPinned, {
                  style: {
                    transform: `rotate(${table.options.rowPinningDisplayMode === 'sticky' ? 135 : props.pinningPosition === 'top' ? 180 : 0}deg)`,
                  },
                }),
        ),
      )
    }
  },
})
