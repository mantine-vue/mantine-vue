import { defineComponent, h, ref, type PropType } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import type { ScrollAreaScrollbarAxisProps, Sizes } from '../ScrollArea.types'
import { getThumbSize, isScrollingWithinScrollbarBounds, toInt } from '../utils'
import { Scrollbar } from './Scrollbar'

export const ScrollAreaScrollbarY = defineComponent({
  name: 'ScrollAreaScrollbarY',
  inheritAttrs: false,
  props: {
    sizes: { type: Object as PropType<Sizes>, required: true },
    hasThumb: { type: Boolean, required: true },
    onSizesChange: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onSizesChange']>,
      required: true,
    },
    onThumbChange: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onThumbChange']>,
      required: true,
    },
    onThumbPointerDown: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onThumbPointerDown']>,
      required: true,
    },
    onThumbPointerUp: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onThumbPointerUp']>,
      required: true,
    },
    onThumbPositionChange: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onThumbPositionChange']>,
      required: true,
    },
    onWheelScroll: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onWheelScroll']>,
      required: true,
    },
    onDragScroll: {
      type: Function as PropType<ScrollAreaScrollbarAxisProps['onDragScroll']>,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const ctx = useScrollAreaContext()
    const scrollbar = ref<HTMLDivElement | null>(null)

    return () =>
      h(
        Scrollbar,
        {
          ...attrs,
          'data-orientation': 'vertical',
          sizes: props.sizes,
          hasThumb: props.hasThumb,
          onThumbChange: props.onThumbChange,
          onThumbPointerDown: (pointerPos: { y: number }) => props.onThumbPointerDown(pointerPos.y),
          onThumbPointerUp: props.onThumbPointerUp,
          onThumbPositionChange: props.onThumbPositionChange,
          onDragScroll: (pointerPos: { y: number }) => props.onDragScroll(pointerPos.y),
          onScrollbarMounted: (node: HTMLDivElement | null) => {
            scrollbar.value = node
            ctx.onScrollbarYChange(node)
          },
          style: [{ '--sa-thumb-height': `${getThumbSize(props.sizes)}px` }, attrs.style as any],
          onWheelScroll: (event: WheelEvent, maxScrollPos: number) => {
            if (ctx.viewport.value) {
              const scrollPos = ctx.viewport.value.scrollTop + event.deltaY
              props.onWheelScroll(scrollPos)

              if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
                event.preventDefault()
              }
            }
          },
          onResize: () => {
            if (scrollbar.value && ctx.viewport.value) {
              const computedStyle = window.getComputedStyle(scrollbar.value)

              props.onSizesChange({
                content: ctx.viewport.value.scrollHeight,
                viewport: ctx.viewport.value.offsetHeight,
                scrollbar: {
                  size: scrollbar.value.clientHeight,
                  paddingStart: toInt(computedStyle.paddingTop),
                  paddingEnd: toInt(computedStyle.paddingBottom),
                },
              })
            }
          },
        },
        slots.default,
      )
  },
})
