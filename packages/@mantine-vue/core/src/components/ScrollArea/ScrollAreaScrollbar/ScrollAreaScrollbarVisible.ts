import { defineComponent, h, nextTick, ref, type PropType } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import type { Sizes } from '../ScrollArea.types'
import { getScrollPositionFromPointer, getThumbOffsetFromScroll, getThumbRatio } from '../utils'
import { ScrollAreaScrollbarX } from './ScrollbarX'
import { ScrollAreaScrollbarY } from './ScrollbarY'

export const ScrollAreaScrollbarVisible = defineComponent({
  name: 'ScrollAreaScrollbarVisible',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical',
    },
  },
  setup(props, { attrs, slots }) {
    const context = useScrollAreaContext()
    const thumb = ref<HTMLDivElement | null>(null)
    const pointerOffset = ref(0)
    const sizes = ref<Sizes>({
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
    })

    const getScrollPosition = (pointerPos: number, direction?: 'ltr' | 'rtl') =>
      getScrollPositionFromPointer(pointerPos, pointerOffset.value, sizes.value, direction)

    return () => {
      const thumbRatio = getThumbRatio(sizes.value.viewport, sizes.value.content)
      const hasThumb = Boolean(thumbRatio > 0 && thumbRatio < 1)
      const commonProps = {
        ...attrs,
        sizes: sizes.value,
        onSizesChange: (nextSizes: Sizes) => {
          sizes.value = nextSizes
          nextTick(() => {
            if (props.orientation === 'horizontal') {
              if (context.viewport.value && thumb.value) {
                const scrollPos = context.viewport.value.scrollLeft
                const offset = getThumbOffsetFromScroll(scrollPos, sizes.value)
                thumb.value.style.transform = `translate3d(${offset}px, 0, 0)`
              }
            } else if (context.viewport.value && thumb.value) {
              const scrollPos = context.viewport.value.scrollTop
              const offset = getThumbOffsetFromScroll(scrollPos, sizes.value)

              if (sizes.value.scrollbar.size === 0) {
                thumb.value.style.setProperty('--thumb-opacity', '0')
              } else {
                thumb.value.style.setProperty('--thumb-opacity', '1')
              }

              thumb.value.style.transform = `translate3d(0, ${offset}px, 0)`
            }
          })
        },
        hasThumb,
        onThumbChange: (node: HTMLDivElement | null) => {
          thumb.value = node
        },
        onThumbPointerUp: () => {
          pointerOffset.value = 0
        },
        onThumbPointerDown: (pointerPos: number) => {
          pointerOffset.value = pointerPos
        },
      }

      if (props.orientation === 'horizontal') {
        return h(
          ScrollAreaScrollbarX,
          {
            ...commonProps,
            onThumbPositionChange: () => {
              if (context.viewport.value && thumb.value) {
                const scrollPos = context.viewport.value.scrollLeft
                const offset = getThumbOffsetFromScroll(scrollPos, sizes.value)
                thumb.value.style.transform = `translate3d(${offset}px, 0, 0)`
              }
            },
            onWheelScroll: (scrollPos: number) => {
              if (context.viewport.value) {
                context.viewport.value.scrollLeft = scrollPos
              }
            },
            onDragScroll: (pointerPos: number) => {
              if (context.viewport.value) {
                context.viewport.value.scrollLeft = getScrollPosition(pointerPos)
              }
            },
          },
          slots.default,
        )
      }

      return h(
        ScrollAreaScrollbarY,
        {
          ...commonProps,
          onThumbPositionChange: () => {
            if (context.viewport.value && thumb.value) {
              const scrollPos = context.viewport.value.scrollTop
              const offset = getThumbOffsetFromScroll(scrollPos, sizes.value)

              if (sizes.value.scrollbar.size === 0) {
                thumb.value.style.setProperty('--thumb-opacity', '0')
              } else {
                thumb.value.style.setProperty('--thumb-opacity', '1')
              }

              thumb.value.style.transform = `translate3d(0, ${offset}px, 0)`
            }
          },
          onWheelScroll: (scrollPos: number) => {
            if (context.viewport.value) {
              context.viewport.value.scrollTop = scrollPos
            }
          },
          onDragScroll: (pointerPos: number) => {
            if (context.viewport.value) {
              context.viewport.value.scrollTop = getScrollPosition(pointerPos)
            }
          },
        },
        slots.default,
      )
    }
  },
})
