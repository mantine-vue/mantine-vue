import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import type { Sizes } from '../ScrollArea.types'
import { provideScrollbarContext } from './Scrollbar.context'

export interface ScrollbarPrivateProps {
  sizes: Sizes
  hasThumb: boolean
  onThumbChange: (thumb: HTMLDivElement | null) => void
  onThumbPointerUp: () => void
  onThumbPointerDown: (pointerPos: { x: number; y: number }) => void
  onThumbPositionChange: () => void
  onWheelScroll: (event: WheelEvent, maxScrollPos: number) => void
  onDragScroll: (pointerPos: { x: number; y: number }) => void
  onResize: () => void
}

export const Scrollbar = defineComponent({
  name: 'ScrollAreaScrollbarInternal',
  inheritAttrs: false,
  props: {
    sizes: { type: Object as PropType<Sizes>, required: true },
    hasThumb: { type: Boolean, required: true },
    onThumbChange: {
      type: Function as PropType<ScrollbarPrivateProps['onThumbChange']>,
      required: true,
    },
    onThumbPointerUp: {
      type: Function as PropType<ScrollbarPrivateProps['onThumbPointerUp']>,
      required: true,
    },
    onThumbPointerDown: {
      type: Function as PropType<ScrollbarPrivateProps['onThumbPointerDown']>,
      required: true,
    },
    onThumbPositionChange: {
      type: Function as PropType<ScrollbarPrivateProps['onThumbPositionChange']>,
      required: true,
    },
    onWheelScroll: {
      type: Function as PropType<ScrollbarPrivateProps['onWheelScroll']>,
      required: true,
    },
    onDragScroll: {
      type: Function as PropType<ScrollbarPrivateProps['onDragScroll']>,
      required: true,
    },
    onResize: { type: Function as PropType<ScrollbarPrivateProps['onResize']>, required: true },
    onScrollbarMounted: {
      type: Function as PropType<(node: HTMLDivElement | null) => void>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const context = useScrollAreaContext()
    const scrollbar = ref<HTMLDivElement | null>(null)
    const rect = ref<DOMRect | null>(null)
    const prevWebkitUserSelect = ref('')
    let resizeObserver: ResizeObserver | null = null
    let resizeFrame = 0

    provideScrollbarContext({
      get hasThumb() {
        return props.hasThumb
      },
      get scrollbar() {
        return scrollbar.value
      },
      onThumbChange: props.onThumbChange,
      onThumbPointerUp: props.onThumbPointerUp,
      onThumbPointerDown: props.onThumbPointerDown,
      onThumbPositionChange: props.onThumbPositionChange,
    })

    const handleResize = () => {
      window.cancelAnimationFrame(resizeFrame)
      resizeFrame = window.requestAnimationFrame(() => props.onResize())
    }

    const observeResize = () => {
      resizeObserver?.disconnect()
      resizeObserver = null

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(handleResize)

        if (scrollbar.value) {
          resizeObserver.observe(scrollbar.value)
        }

        if (context.content.value) {
          resizeObserver.observe(context.content.value)
        }
      }

      props.onResize()
    }

    const handleDragScroll = (event: PointerEvent) => {
      if (rect.value) {
        props.onDragScroll({
          x: event.clientX - rect.value.left,
          y: event.clientY - rect.value.top,
        })
      }
    }

    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement
      const isScrollbarWheel = scrollbar.value?.contains(target)

      if (isScrollbarWheel) {
        props.onWheelScroll(event, props.sizes.content - props.sizes.viewport)
      }
    }

    onMounted(() => {
      document.addEventListener('wheel', handleWheel, { passive: false })
      observeResize()
      props.onThumbPositionChange()
    })

    watch([scrollbar, context.content], observeResize, { flush: 'post' })
    watch(
      () => props.sizes,
      () => props.onThumbPositionChange(),
      { deep: true },
    )

    onBeforeUnmount(() => {
      document.removeEventListener('wheel', handleWheel)
      resizeObserver?.disconnect()
      window.cancelAnimationFrame(resizeFrame)
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          ref: (node: any) => {
            const element = node?.$el ?? node ?? null
            scrollbar.value = element
            props.onScrollbarMounted?.(element)
          },
          'data-mantine-scrollbar': true,
          style: [{ position: 'absolute' }, attrs.style as any],
          onPointerdown: (event: PointerEvent) => {
            ;(attrs.onPointerdown as ((event: PointerEvent) => void) | undefined)?.(event)
            event.preventDefault()

            if (event.button === 0) {
              const element = event.target as HTMLElement
              element.setPointerCapture(event.pointerId)
              rect.value = scrollbar.value?.getBoundingClientRect() ?? null
              prevWebkitUserSelect.value = document.body.style.webkitUserSelect
              document.body.style.webkitUserSelect = 'none'
              handleDragScroll(event)
            }
          },
          onPointermove: (event: PointerEvent) => {
            ;(attrs.onPointermove as ((event: PointerEvent) => void) | undefined)?.(event)
            handleDragScroll(event)
          },
          onPointerup: (event: PointerEvent) => {
            ;(attrs.onPointerup as ((event: PointerEvent) => void) | undefined)?.(event)
            const element = event.target as HTMLElement

            if (element.hasPointerCapture(event.pointerId)) {
              event.preventDefault()
              element.releasePointerCapture(event.pointerId)
            }
          },
          onLostpointercapture: () => {
            document.body.style.webkitUserSelect = prevWebkitUserSelect.value
            rect.value = null
          },
        },
        slots.default?.(),
      )
  },
})
