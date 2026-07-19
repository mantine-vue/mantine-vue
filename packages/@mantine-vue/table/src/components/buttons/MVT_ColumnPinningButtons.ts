import clsx from 'clsx'
import { ActionIcon, Flex, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import classes from './MVT_ColumnPinningButtons.module.css'

export const MVT_ColumnPinningButtons = defineComponent({
  name: 'MVTColumnPinningButtons',
  props: {
    column: { type: Object as PropType<MVT_Column<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props) {
    return () => {
      const { column, table } = props
      const l = table.options.localization
      const icons = table.options.icons
      const button = (
        label: string,
        side: 'left' | 'right' | false,
        icon: any,
        className?: string,
      ) =>
        h(Tooltip, { label, withinPortal: true }, () =>
          h(
            ActionIcon,
            {
              'aria-label': label,
              color: 'gray',
              size: 'md',
              variant: 'subtle',
              onClick: () => column.pin(side),
            },
            () => h(icon, { class: className }),
          ),
        )
      return h(Flex, { class: clsx('mvt-column-pinning-buttons', classes.root) }, () =>
        column.getIsPinned()
          ? button(l.unpin, false, icons.IconPinnedOff)
          : [
              button(l.pinToLeft, 'left', icons.IconPinned, classes.left),
              button(l.pinToRight, 'right', icons.IconPinned, classes.right),
            ],
      )
    }
  },
})
