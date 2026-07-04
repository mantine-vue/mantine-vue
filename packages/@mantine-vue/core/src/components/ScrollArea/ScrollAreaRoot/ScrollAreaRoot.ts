import { defineComponent, h, ref, type PropType } from 'vue'
import { withBoxProps, Box, useProps } from '../../../core'
import { provideScrollAreaContext, type ScrollAreaContextValue } from '../ScrollArea.context'

const defaultProps = {
  scrollHideDelay: 1000,
  type: 'hover',
} as const

export const ScrollAreaRoot = withBoxProps(
  defineComponent({
    name: 'ScrollAreaRoot',
    inheritAttrs: false,
    props: {
      getStyles: {
        type: Function as PropType<ScrollAreaContextValue['getStyles']>,
        required: true,
      },
      type: {
        type: String as PropType<ScrollAreaContextValue['type']>,
        default: undefined,
      },
      scrollbars: {
        type: [String, Boolean] as PropType<ScrollAreaContextValue['scrollbars']>,
        default: undefined,
      },
      scrollHideDelay: { type: Number, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ScrollAreaRoot', defaultProps, rawProps)
      const viewport = ref<HTMLDivElement | null>(null)
      const content = ref<HTMLDivElement | null>(null)
      const scrollbarX = ref<HTMLDivElement | null>(null)
      const scrollbarY = ref<HTMLDivElement | null>(null)
      const cornerWidth = ref(0)
      const cornerHeight = ref(0)

      provideScrollAreaContext({
        type: props.type ?? defaultProps.type,
        scrollHideDelay: props.scrollHideDelay ?? defaultProps.scrollHideDelay,
        scrollbars: props.scrollbars,
        viewport,
        onViewportChange: (node) => {
          viewport.value = node
        },
        content,
        onContentChange: (node) => {
          content.value = node
        },
        scrollbarX,
        onScrollbarXChange: (node) => {
          scrollbarX.value = node
        },
        scrollbarY,
        onScrollbarYChange: (node) => {
          scrollbarY.value = node
        },
        onCornerWidthChange: (width) => {
          cornerWidth.value = width
        },
        onCornerHeightChange: (height) => {
          cornerHeight.value = height
        },
        getStyles: props.getStyles,
      })

      return () =>
        h(
          Box,
          {
            ...attrs,
            style: [
              {
                '--sa-corner-width': props.scrollbars !== 'xy' ? '0px' : `${cornerWidth.value}px`,
                '--sa-corner-height': props.scrollbars !== 'xy' ? '0px' : `${cornerHeight.value}px`,
              },
              attrs.style as any,
            ],
          },
          () => slots.default?.(),
        )
    },
  }),
)
