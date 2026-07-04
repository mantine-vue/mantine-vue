import { defineComponent, h, ref, type PropType } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import type { ScrollAreaScrollbarAxisProps, Sizes } from '../ScrollArea.types'
import { getThumbSize, isScrollingWithinScrollbarBounds, toInt } from '../utils'
import { Scrollbar } from './Scrollbar'

export const ScrollAreaScrollbarX = defineComponent({
  name: 'ScrollAreaScrollbarX',
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
          'data-orientation': 'horizontal',
          sizes: props.sizes,
          hasThumb: props.hasThumb,
          onThumbChange: props.onThumbChange,
          onThumbPointerDown: (pointerPos: { x: number }) => props.onThumbPointerDown(pointerPos.x),
          onThumbPointerUp: props.onThumbPointerUp,
          onThumbPositionChange: props.onThumbPositionChange,
          onDragScroll: (pointerPos: { x: number }) => props.onDragScroll(pointerPos.x),
          onScrollbarMounted: (node: HTMLDivElement | null) => {
            scrollbar.value = node
            ctx.onScrollbarXChange(node)
          },
          style: [{ '--sa-thumb-width': `${getThumbSize(props.sizes)}px` }, attrs.style as any],
          onWheelScroll: (event: WheelEvent, maxScrollPos: number) => {
            if (ctx.viewport.value) {
              const scrollPos = ctx.viewport.value.scrollLeft + event.deltaX
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
                content: ctx.viewport.value.scrollWidth,
                viewport: ctx.viewport.value.offsetWidth,
                scrollbar: {
                  size: scrollbar.value.clientWidth,
                  paddingStart: toInt(computedStyle.paddingLeft),
                  paddingEnd: toInt(computedStyle.paddingRight),
                },
              })
            }
          },
        },
        slots.default,
      )
  },
})
