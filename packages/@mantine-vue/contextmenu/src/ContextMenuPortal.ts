import { defineComponent, h, type PropType } from 'vue'
import { Portal, type Direction, type MantineTheme } from '@mantine-vue/core'
import { useHotkeys, useWindowEvent } from '@mantine-vue/hooks'
import { ContextMenu } from './ContextMenu'
import { ContextMenuOverlay } from './ContextMenuOverlay'
import type {
  ContextMenuContent,
  ContextMenuOptions,
  ContextMenuPortalProps,
  ContextMenuStyles,
  ContextMenuStyle,
} from './types'

export const ContextMenuPortal = defineComponent({
  name: 'ContextMenuPortal',
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    content: {
      type: [Array, Function] as PropType<ContextMenuContent>,
      required: true,
    },
    onHide: {
      type: Function as PropType<() => void>,
      required: true,
    },
    zIndex: { type: Number, default: undefined },
    dir: {
      type: String as PropType<Direction>,
      required: true,
    },
    className: { type: String, default: undefined },
    style: {
      type: [Object, Function] as PropType<ContextMenuStyle>,
      default: undefined,
    },
    classNames: {
      type: Object as PropType<ContextMenuOptions['classNames']>,
      default: undefined,
    },
    styles: {
      type: [Object, Function] as PropType<
        ContextMenuStyles | ((theme: MantineTheme) => ContextMenuStyles)
      >,
      default: undefined,
    },
  },
  setup(props: ContextMenuPortalProps) {
    useWindowEvent('resize', props.onHide)
    useWindowEvent('scroll', props.onHide)
    useHotkeys([['Escape', props.onHide]])

    return () =>
      h(Portal, null, () =>
        h(ContextMenuOverlay, { zIndex: props.zIndex, onHide: props.onHide }, () =>
          h(ContextMenu, {
            x: props.x,
            y: props.y,
            content: props.content,
            onHide: props.onHide,
            dir: props.dir,
            zIndex: props.zIndex,
            className: props.className,
            style: props.style,
            classNames: props.classNames,
            styles: props.styles,
          }),
        ),
      )
  },
})
