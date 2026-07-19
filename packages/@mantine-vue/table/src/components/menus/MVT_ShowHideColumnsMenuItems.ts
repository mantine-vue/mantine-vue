import clsx from 'clsx'
import { Box, Menu, Switch, Text, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, ref, resolveComponent, type PropType, type VNodeChild } from 'vue'
import type { MVT_Column, MVT_RowData, MVT_TableInstance } from '../../types'
import { reorderColumn } from '../../utils/column.utils'
import { MVT_ColumnPinningButtons } from '../buttons/MVT_ColumnPinningButtons'
import { MVT_GrabHandleButton } from '../buttons/MVT_GrabHandleButton'
import classes from './MVT_ShowHideColumnsMenuItems.module.css'

export const MVT_ShowHideColumnsMenuItems = defineComponent({
  name: 'MVTShowHideColumnsMenuItems',
  props: {
    allColumns: { type: Array as PropType<MVT_Column<MVT_RowData>[]>, required: true },
    column: { type: Object as PropType<MVT_Column<MVT_RowData>>, required: true },
    hoveredColumn: { type: Object as PropType<MVT_Column<MVT_RowData> | null>, default: null },
    getHoveredColumn: {
      type: Function as PropType<() => MVT_Column<MVT_RowData> | null>,
      default: undefined,
    },
    table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true },
  },
  emits: { hoveredColumnChange: (_value: MVT_Column<MVT_RowData> | null) => true },
  setup(props, { emit }) {
    const menuItemRef = ref<HTMLElement | null>(null)
    const dragging = ref(false)
    return () => {
      const { column, table } = props
      const def = column.columnDef
      const group = def.columnDefType === 'group'
      if (!def.header || def.visibleInShowHideMenu === false) return null
      const checked = !group
        ? column.getIsVisible()
        : column.getLeafColumns().some((c) => c.getIsVisible())
      const toggle = () =>
        group
          ? column.columns?.forEach((c) => c.toggleVisibility(!checked))
          : column.toggleVisibility()
      const children: VNodeChild[] =
        column.columns?.map((child) =>
          h(resolveComponent('MVT_ShowHideColumnsMenuItems'), {
            key: child.id,
            ...props,
            column: child,
            onHoveredColumnChange: (value: MVT_Column<MVT_RowData> | null) =>
              emit('hoveredColumnChange', value),
          }),
        ) ?? []
      return [
        h(
          Menu.Item,
          {
            class: clsx(classes.root),
            component: 'span',
            ref: (el: any) => {
              menuItemRef.value = el?.$el ?? el
            },
            style: { '--_column-depth': `${(column.depth + 0.5) * 2}rem` },
            'data-dragging': dragging.value || undefined,
            'data-order-hovered': props.hoveredColumn?.id === column.id || undefined,
            onDragenter: () => {
              if (!dragging.value && def.enableColumnOrdering !== false)
                emit('hoveredColumnChange', column)
            },
          },
          () =>
            h(Box, { class: classes.menu }, () => [
              !group &&
              table.options.enableColumnOrdering &&
              !props.allColumns.some((c) => c.columnDef.columnDefType === 'group')
                ? def.enableColumnOrdering !== false
                  ? h(MVT_GrabHandleButton, {
                      table,
                      onDragStart: (e: DragEvent) => {
                        dragging.value = true
                        if (menuItemRef.value) e.dataTransfer?.setDragImage(menuItemRef.value, 0, 0)
                      },
                      onDragEnd: () => {
                        dragging.value = false

                        const hovered = props.getHoveredColumn?.() ?? props.hoveredColumn
                        if (hovered)
                          table.setColumnOrder(
                            reorderColumn(column, hovered, table.getState().columnOrder),
                          )
                        emit('hoveredColumnChange', null)
                      },
                    } as any)
                  : h(Box, { class: classes.grab })
                : null,
              table.options.enableColumnPinning
                ? column.getCanPin()
                  ? h(MVT_ColumnPinningButtons, { column, table })
                  : h(Box, { class: classes.pin })
                : null,
              table.options.enableHiding
                ? h(
                    Tooltip,
                    {
                      label: table.options.localization.toggleVisibility,
                      openDelay: 1000,
                      withinPortal: true,
                    },
                    () =>
                      h(Switch, {
                        checked,
                        class: classes.switch,
                        disabled: !column.getCanHide(),
                        label: def.header,
                        onChange: toggle,
                      }),
                  )
                : h(Text, { class: classes.header }, () => def.header),
            ]),
        ),
        ...children,
      ]
    }
  },
})
