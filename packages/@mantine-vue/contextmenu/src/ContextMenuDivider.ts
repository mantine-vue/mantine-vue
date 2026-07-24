import { defineComponent, h, type PropType } from 'vue'
import { Box, useMantineTheme } from '@mantine-vue/core'
import { resolveContextMenuStyle } from './utils'
import type { ContextMenuDividerProps, ContextMenuStyle } from './types'
import './ContextMenuDivider.css'

export const ContextMenuDivider = defineComponent({
  name: 'ContextMenuDivider',
  props: {
    className: { type: String, default: undefined },
    style: {
      type: [Object, Function] as PropType<ContextMenuStyle>,
      default: undefined,
    },
  },
  setup(props: ContextMenuDividerProps) {
    const theme = useMantineTheme()

    return () =>
      h(Box, {
        class: ['mantine-contextmenu-divider', props.className],
        style: resolveContextMenuStyle(props.style, theme.value),
      })
  },
})
