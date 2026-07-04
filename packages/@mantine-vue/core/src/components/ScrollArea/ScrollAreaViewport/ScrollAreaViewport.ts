import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useScrollAreaContext } from '../ScrollArea.context'

export const ScrollAreaViewport = withBoxProps(
  defineComponent({
    name: 'ScrollAreaViewport',
    inheritAttrs: false,
    props: {
      onViewportMounted: {
        type: Function as PropType<(node: HTMLDivElement | null) => void>,
        default: undefined,
      },
      onContentMounted: {
        type: Function as PropType<(node: HTMLDivElement | null) => void>,
        default: undefined,
      },
    },
    setup(props, { attrs, slots }) {
      const ctx = useScrollAreaContext()

      return () => {
        const scrollbars = ctx.scrollbars ?? 'xy'

        return h(
          Box,
          {
            ...attrs,
            ref: (node: any) => {
              const element = node?.$el ?? node ?? null
              props.onViewportMounted?.(element)
              ctx.onViewportChange(element)
            },
            style: [
              {
                overflowX: scrollbars === 'x' || scrollbars === 'xy' ? 'scroll' : 'hidden',
                overflowY: scrollbars === 'y' || scrollbars === 'xy' ? 'scroll' : 'hidden',
              },
              attrs.style as any,
            ],
          },
          () =>
            h(
              'div',
              {
                ...ctx.getStyles('content'),
                ref: (node: any) => {
                  const element = node?.$el ?? node ?? null
                  props.onContentMounted?.(element)
                  ctx.onContentChange(element)
                },
              },
              slots.default?.(),
            ),
        )
      }
    },
  }),
)
