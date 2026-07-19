import clsx from 'clsx'
import { ActionIcon, Tooltip, useDirection } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_Row, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_EditCellTextInput } from '../inputs/MVT_EditCellTextInput'
import { useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_ExpandButton.module.css'

export const MVT_ExpandButton = defineComponent({
  name: 'MVTExpandButton',
  inheritAttrs: false,
  props: {
    row: { type: Object as PropType<MVT_Row<MVT_RowData>>, required: true },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    const direction = useDirection()
    const mvtSlots = useMVT_Slots()
    return () => {
      const { row, table } = props
      const o = table.options
      const actionProps = {
        ...parseFromValuesOrFunc(o.mantineExpandButtonProps, { row, table }),
        ...attrs,
      } as Record<string, any>
      const edits = row
        .getAllCells()
        .filter((cell) => cell.column.columnDef.columnDefType === 'data')
        .map((cell) => h(MVT_EditCellTextInput, { key: cell.id, cell, table }))
      const canExpand = row.getCanExpand()
      const expanded = row.getIsExpanded()
      const detail =
        !!mvtSlots.detailPanel ||
        !!o.renderDetailPanel?.({ internalEditComponents: edits, row, table })
      const rtl = direction.dir.value === 'rtl' || o.positionExpandColumn === 'last'
      const label =
        actionProps.title ?? (expanded ? o.localization.collapse : o.localization.expand)
      return h(
        Tooltip,
        { disabled: !canExpand && !detail, label, openDelay: 1000, withinPortal: true },
        () =>
          h(
            ActionIcon,
            {
              'aria-label': o.localization.expand,
              color: 'gray',
              disabled: !canExpand && !detail,
              variant: 'subtle',
              ...actionProps,
              class: clsx(
                'mvt-expand-button',
                classes.root,
                classes[`root-${rtl ? 'rtl' : 'ltr'}`],
                actionProps.class,
              ),
              style: { '--mvt-row-depth': `${row.depth}`, ...actionProps.style },
              title: undefined,
              onClick: (event: MouseEvent) => {
                event.stopPropagation()
                row.toggleExpanded()
                actionProps.onClick?.(event)
              },
            } as any,
            () =>
              slots.default?.({ row, table }) ??
              h(o.icons.IconChevronDown, {
                class: clsx(
                  'mvt-expand-button-chevron',
                  classes.chevron,
                  !canExpand && !detail ? classes.right : expanded ? classes.up : undefined,
                ),
              }),
          ),
      )
    }
  },
})
