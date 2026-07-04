import { defineComponent, h, onBeforeUnmount, ref, watch } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'

export const ScrollAreaCorner = defineComponent({
  name: 'ScrollAreaCorner',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const ctx = useScrollAreaContext()
    const width = ref(0)
    const height = ref(0)
    let resizeObserverX: ResizeObserver | null = null
    let resizeObserverY: ResizeObserver | null = null

    const updateSize = () => {
      const nextHeight = ctx.scrollbarX.value?.offsetHeight || 0
      const nextWidth = ctx.scrollbarY.value?.offsetWidth || 0

      height.value = nextHeight
      width.value = nextWidth
      ctx.onCornerHeightChange(nextHeight)
      ctx.onCornerWidthChange(nextWidth)
    }

    const observeScrollbars = () => {
      resizeObserverX?.disconnect()
      resizeObserverY?.disconnect()
      resizeObserverX = null
      resizeObserverY = null

      if (typeof ResizeObserver !== 'undefined') {
        if (ctx.scrollbarX.value) {
          resizeObserverX = new ResizeObserver(updateSize)
          resizeObserverX.observe(ctx.scrollbarX.value)
        }

        if (ctx.scrollbarY.value) {
          resizeObserverY = new ResizeObserver(updateSize)
          resizeObserverY.observe(ctx.scrollbarY.value)
        }
      }

      updateSize()
    }

    watch([ctx.scrollbarX, ctx.scrollbarY], observeScrollbars, { flush: 'post' })

    onBeforeUnmount(() => {
      resizeObserverX?.disconnect()
      resizeObserverY?.disconnect()
    })

    return () => {
      const hasSize = Boolean(width.value && height.value)
      const hasBothScrollbars = Boolean(ctx.scrollbarX.value && ctx.scrollbarY.value)
      const hasCorner = ctx.type !== 'scroll' && ctx.scrollbars === 'xy' && hasBothScrollbars

      return hasCorner && hasSize
        ? h('div', {
            ...attrs,
            style: [{ width: width.value, height: height.value }, attrs.style as any],
          })
        : null
    }
  },
})
