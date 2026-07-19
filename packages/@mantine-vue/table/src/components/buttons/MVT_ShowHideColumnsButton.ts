import { ActionIcon, Menu, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'
import { MVT_ShowHideColumnsMenu } from '../menus/MVT_ShowHideColumnsMenu'

export const MVT_ShowHideColumnsButton = defineComponent({
  name: 'MVTShowHideColumnsButton',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    return () => {
      const title =
        (attrs.title as string | undefined) ?? props.table.options.localization.showHideColumns
      return h(Menu, { closeOnItemClick: false, withinPortal: true }, () => [
        h(Tooltip, { label: title, withinPortal: true }, () =>
          h(Menu.Target, null, () =>
            h(
              ActionIcon,
              {
                'aria-label': title,
                color: 'gray',
                size: 'lg',
                variant: 'subtle',
                ...attrs,
              },
              () => h(props.table.options.icons.IconColumns),
            ),
          ),
        ),
        h(MVT_ShowHideColumnsMenu, { table: props.table }),
      ])
    }
  },
})
