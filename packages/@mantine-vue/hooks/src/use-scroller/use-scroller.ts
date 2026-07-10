import { onBeforeUnmount, ref, type ComponentPublicInstance, type Ref } from 'vue'

export interface UseScrollerOptions {
  scrollAmount?: number
  draggable?: boolean
  onScrollStateChange?: (state: UseScrollerScrollState) => void
}

export interface UseScrollerScrollState {
  canScrollStart: boolean
  canScrollEnd: boolean
}

export interface UseScrollerReturnValue {
  ref: (node: Element | ComponentPublicInstance | null) => void
  canScrollStart: Ref<boolean>
  canScrollEnd: Ref<boolean>
  scrollStart: () => void
  scrollEnd: () => void
  isDragging: Ref<boolean>
  dragHandlers: {
    onMousedown: (event: MouseEvent) => void
    onMousemove: (event: MouseEvent) => void
    onMouseup: () => void
    onMouseleave: () => void
  }
}

export function useScroller<T extends HTMLElement = HTMLDivElement>({
  scrollAmount = 200,
  draggable = true,
  onScrollStateChange,
}: UseScrollerOptions = {}): UseScrollerReturnValue {
  let containerRef: T | null = null
  let resizeObserver: ResizeObserver | undefined
  let isDraggingRef = false
  let hasDraggedRef = false
  let startX = 0
  let scrollLeftStart = 0

  const canScrollStart = ref(false)
  const canScrollEnd = ref(false)
  const isDragging = ref(false)

  const updateScrollState = () => {
    const container = containerRef

    if (!container) {
      return
    }

    const { scrollLeft, scrollWidth, clientWidth } = container
    const isRtl = getComputedStyle(container).direction === 'rtl'
    const nextCanScrollStart = isRtl ? scrollLeft < -1 : scrollLeft > 1
    const nextCanScrollEnd = isRtl
      ? scrollLeft > -(scrollWidth - clientWidth) + 1
      : scrollLeft < scrollWidth - clientWidth - 1

    canScrollStart.value = nextCanScrollStart
    canScrollEnd.value = nextCanScrollEnd
    onScrollStateChange?.({ canScrollStart: nextCanScrollStart, canScrollEnd: nextCanScrollEnd })
  }

  const setRef = (node: Element | ComponentPublicInstance | null) => {
    const safeNode = node instanceof HTMLElement ? (node as T) : null

    if (containerRef) {
      containerRef.removeEventListener('scroll', updateScrollState)
      resizeObserver?.disconnect()
    }

    containerRef = safeNode

    if (safeNode) {
      safeNode.addEventListener('scroll', updateScrollState)

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateScrollState)
        resizeObserver.observe(safeNode)
      }

      updateScrollState()
    }
  }

  const scroll = (direction: 'start' | 'end') => {
    if (!containerRef) {
      return
    }

    const isRtl = getComputedStyle(containerRef).direction === 'rtl'
    const scrollBy = direction === 'end' ? scrollAmount : -scrollAmount
    const adjustedScrollBy = isRtl ? -scrollBy : scrollBy

    containerRef.scrollBy({ left: adjustedScrollBy, behavior: 'smooth' })
  }

  const handleMouseDown = (event: MouseEvent) => {
    if (!draggable || !containerRef) {
      return
    }

    isDraggingRef = true
    hasDraggedRef = false
    isDragging.value = true
    startX = event.pageX - containerRef.offsetLeft
    scrollLeftStart = containerRef.scrollLeft
    containerRef.style.cursor = 'grabbing'
    containerRef.style.userSelect = 'none'
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDraggingRef || !containerRef) {
      return
    }

    event.preventDefault()
    const x = event.pageX - containerRef.offsetLeft
    const walk = x - startX

    if (Math.abs(walk) > 5) {
      hasDraggedRef = true
    }

    containerRef.scrollLeft = scrollLeftStart - walk
  }

  const handleMouseUp = () => {
    const wasDragged = hasDraggedRef
    isDraggingRef = false
    hasDraggedRef = false
    isDragging.value = false

    if (!containerRef) {
      return
    }

    containerRef.style.cursor = ''
    containerRef.style.userSelect = ''

    if (wasDragged) {
      const suppressClick = (event: MouseEvent) => {
        event.stopPropagation()
        event.preventDefault()
        containerRef?.removeEventListener('click', suppressClick, true)
      }

      containerRef.addEventListener('click', suppressClick, true)
    }
  }

  onBeforeUnmount(() => {
    if (containerRef) {
      containerRef.removeEventListener('scroll', updateScrollState)
    }

    resizeObserver?.disconnect()
  })

  return {
    ref: setRef,
    canScrollStart,
    canScrollEnd,
    scrollStart: () => scroll('start'),
    scrollEnd: () => scroll('end'),
    isDragging,
    dragHandlers: {
      onMousedown: handleMouseDown,
      onMousemove: handleMouseMove,
      onMouseup: handleMouseUp,
      onMouseleave: () => {
        if (isDraggingRef) {
          handleMouseUp()
        }
      },
    },
  }
}
