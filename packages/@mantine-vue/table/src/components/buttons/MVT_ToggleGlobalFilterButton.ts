import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'

export const MVT_ToggleGlobalFilterButton = defineComponent({
  name: 'MVTToggleGlobalFilterButton',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    return () => {
      const { table } = props
      const state = table.getState()
      const { IconSearch, IconSearchOff } = table.options.icons
      const title = (attrs.title as string | undefined) ?? table.options.localization.showHideSearch
      return h(Tooltip, { label: title, withinPortal: true }, () =>
        h(
          ActionIcon,
          {
            'aria-label': title,
            color: 'gray',
            disabled: !!state.globalFilter,
            size: 'lg',
            variant: 'subtle',
            ...attrs,
            onClick: () => {
              table.setShowGlobalFilter(!state.showGlobalFilter)
              setTimeout(() => table.refs.searchInputRef.value?.focus(), 100)
            },
          },
          () => h(state.showGlobalFilter ? IconSearchOff : IconSearch),
        ),
      )
    }
  },
})
