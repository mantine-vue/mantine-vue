import clsx from 'clsx'
import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { useMVT_Slots } from '../MVT_TableSlots'
import classes from './MVT_ExpandAllButton.module.css'

export const MVT_ExpandAllButton = defineComponent({
  name: 'MVTExpandAllButton',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs, slots }) {
    const mvtSlots = useMVT_Slots()
    return () => {
      const { table } = props
      const o = table.options
      const hasDetailPanel = !!o.renderDetailPanel || !!mvtSlots.detailPanel
      const state = table.getState()
      const actionProps = {
        ...parseFromValuesOrFunc(o.mantineExpandAllButtonProps, { table }),
        ...attrs,
      } as Record<string, any>
      const expanded = table.getIsAllRowsExpanded()
      const label =
        actionProps.title ?? (expanded ? o.localization.collapseAll : o.localization.expandAll)
      return h(Tooltip, { label, openDelay: 1000, withinPortal: true }, () =>
        h(
          ActionIcon,
          {
            'aria-label': o.localization.expandAll,
            color: 'gray',
            variant: 'subtle',
            ...actionProps,
            class: clsx('mvt-expand-all-button', classes.root, actionProps.class, state.density),
            disabled: state.isLoading || (!hasDetailPanel && !table.getCanSomeRowsExpand()),
            title: undefined,
            onClick: () => table.toggleAllRowsExpanded(!expanded),
          } as any,
          () =>
            slots.default?.({ expanded, table }) ??
            h(o.icons.IconChevronsDown, {
              class: clsx(
                classes.chevron,
                expanded ? classes.up : table.getIsSomeRowsExpanded() ? classes.right : undefined,
              ),
            }),
        ),
      )
    }
  },
})
