import { ActionIcon, Menu, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import type { MVT_Header, MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_ColumnActionMenu.module.css'

export const MVT_ColumnActionMenu = defineComponent({
  name: 'MVTColumnActionMenu',
  inheritAttrs: false,
  props: {
    header: { type: Object as PropType<MVT_Header<MVT_RowData>>, required: true },
    onChange: { type: Function as PropType<(opened: boolean) => void>, default: undefined },
    opened: { type: Boolean, default: undefined },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  setup(props, { attrs, slots }) {
    const mvtSlots = useMVT_Slots()
    return () => {
      const { header, table } = props
      const { column } = header
      const def = column.columnDef
      const o = table.options
      const state = table.getState()
      const icons = o.icons
      const l = o.localization
      const actionProps = {
        ...parseFromValuesOrFunc(o.mantineColumnActionsButtonProps, { column, table }),
        ...parseFromValuesOrFunc(def.mantineColumnActionsButtonProps, { column, table }),
      } as Record<string, any>
      const item = (
        label: string,
        icon: any,
        onClick: () => void,
        disabled = false,
        iconClass?: string,
      ) =>
        h(Menu.Item, { disabled, leftSection: h(icon, { class: iconClass }), onClick }, () => label)
      const internal: VNodeChild[] = []
      if (o.enableSorting && column.getCanSort()) {
        if (o.enableSortingRemoval !== false)
          internal.push(
            item(
              l.clearSort,
              icons.IconClearAll,
              () => column.clearSorting(),
              !column.getIsSorted(),
            ),
          )
        internal.push(
          item(
            l.sortByColumnAsc.replace('{column}', String(def.header)),
            icons.IconSortAscending,
            () => column.toggleSorting(false),
            column.getIsSorted() === 'asc',
          ),
        )
        internal.push(
          item(
            l.sortByColumnDesc.replace('{column}', String(def.header)),
            icons.IconSortDescending,
            () => column.toggleSorting(true),
            column.getIsSorted() === 'desc',
          ),
        )
        if (o.enableColumnFilters || o.enableGrouping || o.enableHiding)
          internal.push(h(Menu.Divider))
      }
      if (
        o.enableColumnFilters &&
        o.columnFilterDisplayMode !== 'popover' &&
        column.getCanFilter()
      ) {
        internal.push(
          item(
            l.clearFilter,
            icons.IconFilterOff,
            () => column.setFilterValue(''),
            !column.getFilterValue(),
          ),
        )
        internal.push(
          item(l.filterByColumn.replace('{column}', String(def.header)), icons.IconFilter, () => {
            table.setShowColumnFilters(true)
            setTimeout(() => table.refs.filterInputRefs.value[`${column.id}-0`]?.focus(), 100)
          }),
        )
        if (o.enableGrouping || o.enableHiding) internal.push(h(Menu.Divider))
      }
      if (o.enableGrouping && column.getCanGroup()) {
        internal.push(
          item(
            l[column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'].replace(
              '{column}',
              String(def.header),
            ),
            icons.IconBoxMultiple,
            () => {
              column.toggleGrouping()
              table.setColumnOrder((old: string[]) => ['mvt-row-expand', ...old])
            },
          ),
        )
        if (o.enableColumnPinning) internal.push(h(Menu.Divider))
      }
      if (o.enableColumnPinning && column.getCanPin()) {
        internal.push(
          item(
            l.pinToLeft,
            icons.IconPinned,
            () => column.pin('left'),
            column.getIsPinned() === 'left',
            classes.left,
          ),
        )
        internal.push(
          item(
            l.pinToRight,
            icons.IconPinned,
            () => column.pin('right'),
            column.getIsPinned() === 'right',
            classes.right,
          ),
        )
        internal.push(
          item(l.unpin, icons.IconPinnedOff, () => column.pin(false), !column.getIsPinned()),
        )
        if (o.enableHiding) internal.push(h(Menu.Divider))
      }
      if (o.enableColumnResizing && column.getCanResize())
        internal.push(
          item(
            l.resetColumnSize,
            icons.IconArrowAutofitContent,
            () => {
              table.setColumnSizingInfo((old: typeof state.columnSizingInfo) => ({
                ...old,
                isResizingColumn: false,
              }))
              column.resetSize()
            },
            !state.columnSizing[column.id],
          ),
        )
      if (o.enableHiding) {
        internal.push(
          item(
            l.hideColumn.replace('{column}', String(def.header)),
            icons.IconEyeOff,
            () => column.toggleVisibility(false),
            !column.getCanHide(),
          ),
        )
        internal.push(
          item(
            l.showAllColumns.replace('{column}', String(def.header)),
            icons.IconColumns,
            () => table.toggleAllColumnsVisible(true),
            !Object.values(state.columnVisibility).some((visible) => !visible),
          ),
        )
      }

      const menuArg = { column, internalColumnMenuItems: internal, table }
      const custom =
        slots.default?.(menuArg) ??
        mvtSlots.columnActionsMenuItems?.(menuArg) ??
        def.renderColumnActionsMenuItems?.(menuArg) ??
        o.renderColumnActionsMenuItems?.(menuArg)
      return h(
        Menu,
        {
          closeOnItemClick: true,
          position: 'bottom-start',
          withinPortal: true,
          ...attrs,
          opened: props.opened,
          onChange: props.onChange,
        },
        () => [
          h(
            Tooltip,
            { label: actionProps.title ?? l.columnActions, openDelay: 1000, withinPortal: true },
            () =>
              h(Menu.Target, null, () =>
                h(
                  ActionIcon,
                  {
                    'aria-label': l.columnActions,
                    color: 'gray',
                    size: 'sm',
                    variant: 'subtle',
                    ...actionProps,
                  },
                  () => h(icons.IconDotsVertical, { size: '100%' }),
                ),
              ),
          ),
          h(Menu.Dropdown, null, () => custom ?? internal),
        ],
      )
    }
  },
})
