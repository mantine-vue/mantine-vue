import clsx from 'clsx'
import { Flex } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MVT_ShowHideColumnsButton } from '../buttons/MVT_ShowHideColumnsButton'
import { MVT_ToggleDensePaddingButton } from '../buttons/MVT_ToggleDensePaddingButton'
import { MVT_ToggleFiltersButton } from '../buttons/MVT_ToggleFiltersButton'
import { MVT_ToggleFullScreenButton } from '../buttons/MVT_ToggleFullScreenButton'
import { MVT_ToggleGlobalFilterButton } from '../buttons/MVT_ToggleGlobalFilterButton'
import classes from './MVT_ToolbarInternalButtons.module.css'

export const MVT_ToolbarInternalButtons = defineComponent({
  name: 'MVTToolbarInternalButtons',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    return () => {
      const { table } = props
      const o = table.options
      const custom = parseFromValuesOrFunc(o.renderToolbarInternalActions, { table })
      const buttons = custom ?? [
        o.enableFilters && o.enableGlobalFilter && !o.initialState?.showGlobalFilter
          ? h(MVT_ToggleGlobalFilterButton, { table })
          : null,
        o.enableFilters && o.enableColumnFilters && o.columnFilterDisplayMode !== 'popover'
          ? h(MVT_ToggleFiltersButton, { table })
          : null,
        o.enableHiding || o.enableColumnOrdering || o.enableColumnPinning
          ? h(MVT_ShowHideColumnsButton, { table })
          : null,
        o.enableDensityToggle ? h(MVT_ToggleDensePaddingButton, { table }) : null,
        o.enableFullScreenToggle ? h(MVT_ToggleFullScreenButton, { table }) : null,
      ]
      return h(
        Flex,
        { ...attrs, class: clsx('mvt-toolbar-internal-buttons', classes.root, attrs.class) },
        () => buttons,
      )
    }
  },
})
