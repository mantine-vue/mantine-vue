import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'

import type { MVT_RowData, MVT_TableInstance } from '../../types'

export const MVT_ToggleFiltersButton = defineComponent({
  name: 'MVTToggleFiltersButton',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    return () => {
      const { table } = props
      const { IconFilter, IconFilterOff } = table.options.icons
      const title =
        (attrs.title as string | undefined) ?? table.options.localization.showHideFilters
      const shown = table.getState().showColumnFilters
      return h(Tooltip, { label: title, withinPortal: true }, () =>
        h(
          ActionIcon,
          {
            'aria-label': title,
            color: 'gray',
            size: 'lg',
            variant: 'subtle',
            ...attrs,
            onClick: () => table.setShowColumnFilters((current) => !current),
          },
          () => h(shown ? IconFilterOff : IconFilter),
        ),
      )
    }
  },
})
