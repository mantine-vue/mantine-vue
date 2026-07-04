import { defineComponent, h, onBeforeUnmount, onMounted } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import { addUnlinkedScrollListener } from '../utils'
import { useScrollbarContext } from '../ScrollAreaScrollbar/Scrollbar.context'

export const ScrollAreaThumb = defineComponent({
  name: 'ScrollAreaThumb',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const scrollAreaContext = useScrollAreaContext()
    const scrollbarContext = useScrollbarContext()
    let removeUnlinkedScrollListener: (() => void) | undefined
    let debounceTimer = 0

    const removeScrollListener = () => {
      if (removeUnlinkedScrollListener) {
        removeUnlinkedScrollListener()
        removeUnlinkedScrollListener = undefined
      }
    }

    const debounceScrollEnd = () => {
      window.clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(removeScrollListener, 100)
    }

    const handleScroll = () => {
      debounceScrollEnd()

      if (!removeUnlinkedScrollListener && scrollAreaContext.viewport.value) {
        removeUnlinkedScrollListener = addUnlinkedScrollListener(
          scrollAreaContext.viewport.value,
          scrollbarContext.onThumbPositionChange,
        )
        scrollbarContext.onThumbPositionChange()
      }
    }

    onMounted(() => {
      scrollbarContext.onThumbPositionChange()
      scrollAreaContext.viewport.value?.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
      window.clearTimeout(debounceTimer)
      removeScrollListener()
      scrollAreaContext.viewport.value?.removeEventListener('scroll', handleScroll)
    })

    return () => {
      if (!scrollbarContext.hasThumb) {
        return null
      }

      return h('div', {
        ...attrs,
        ref: (node: any) => scrollbarContext.onThumbChange(node?.$el ?? node ?? null),
        'data-state': scrollbarContext.hasThumb ? 'visible' : 'hidden',
        style: [
          { width: 'var(--sa-thumb-width)', height: 'var(--sa-thumb-height)' },
          attrs.style as any,
        ],
        onPointerdownCapture: (event: PointerEvent) => {
          ;(attrs.onPointerdownCapture as ((event: PointerEvent) => void) | undefined)?.(event)
          const thumb = event.target as HTMLElement
          const thumbRect = thumb.getBoundingClientRect()
          const x = event.clientX - thumbRect.left
          const y = event.clientY - thumbRect.top
          scrollbarContext.onThumbPointerDown({ x, y })
        },
        onPointerup: (event: PointerEvent) => {
          ;(attrs.onPointerup as ((event: PointerEvent) => void) | undefined)?.(event)
          scrollbarContext.onThumbPointerUp()
        },
      })
    }
  },
})
