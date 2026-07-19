import { ActionIcon, Tooltip } from '@mantine-vue/core'
import { defineComponent, h, ref, type PropType } from 'vue'
import type { MVT_RowData, MVT_TableInstance } from '../../types'

export const MVT_ToggleFullScreenButton = defineComponent({
  name: 'MVTToggleFullScreenButton',
  inheritAttrs: false,
  props: { table: { type: Object as PropType<MVT_TableInstance<MVT_RowData>>, required: true } },
  setup(props, { attrs }) {
    const tooltipOpened = ref(false)
    return () => {
      const { table } = props
      const full = table.getState().isFullScreen
      const { IconMaximize, IconMinimize } = table.options.icons
      const title =
        (attrs.title as string | undefined) ?? table.options.localization.toggleFullScreen
      return h(Tooltip, { label: title, opened: tooltipOpened.value, withinPortal: true }, () =>
        h(
          ActionIcon,
          {
            'aria-label': title,
            color: 'gray',
            size: 'lg',
            variant: 'subtle',
            ...attrs,
            onMouseenter: () => {
              tooltipOpened.value = true
            },
            onMouseleave: () => {
              tooltipOpened.value = false
            },
            onClick: () => {
              tooltipOpened.value = false
              table.setIsFullScreen((current) => !current)
            },
          },
          () => h(full ? IconMinimize : IconMaximize),
        ),
      )
    }
  },
})
