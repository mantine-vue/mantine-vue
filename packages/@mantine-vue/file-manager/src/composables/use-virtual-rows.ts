import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue'

export interface UseVirtualRowsOptions {
  /** Scrolling element. */
  container: Ref<HTMLElement | null>

  /** Number of rows. */
  count: () => number

  /** Height of one row in px. Every row has the same height. */
  rowHeight: () => number

  /** Whether rows outside the viewport are skipped. */
  enabled: () => boolean

  /** Rows rendered above and below the viewport. @default 4 */
  overscan?: number
}

/**
 * Renders only the rows near the viewport of a scrolling container.
 *
 * Rows have a fixed height, which all file manager layouts guarantee. That makes the window a
 * plain calculation with no measuring, so scrolling through 100k entries costs the same as 100.
 */
export function useVirtualRows(options: UseVirtualRowsOptions) {
  const scrollTop = ref(0)
  const viewportHeight = ref(0)
  const overscan = options.overscan ?? 4
  let frame = 0
  let observer: ResizeObserver | undefined

  const totalHeight = computed(() => options.count() * options.rowHeight())

  const range = computed(() => {
    const count = options.count()

    if (!options.enabled() || viewportHeight.value === 0) {
      // Nothing is measured on the first paint or without layout. Render a bounded slice instead
      // of the whole list, the measured window replaces it right after.
      return { start: 0, end: options.enabled() ? Math.min(count, 40) : count }
    }

    const rowHeight = options.rowHeight()
    // A shrinking list can leave `scrollTop` past the end until the browser clamps it.
    const top = Math.min(scrollTop.value, Math.max(0, totalHeight.value - viewportHeight.value))
    const first = Math.floor(top / rowHeight)
    const visible = Math.ceil(viewportHeight.value / rowHeight)

    return {
      start: Math.max(0, first - overscan),
      end: Math.min(count, first + visible + overscan),
    }
  })

  const offsetTop = computed(() => range.value.start * options.rowHeight())
  const offsetBottom = computed(() =>
    Math.max(0, (options.count() - range.value.end) * options.rowHeight()),
  )

  function onScroll() {
    if (frame) {
      return
    }

    frame = requestAnimationFrame(() => {
      frame = 0
      scrollTop.value = options.container.value?.scrollTop ?? 0
    })
  }

  /** Scrolls the least amount needed to show a row. */
  function scrollToRow(index: number) {
    const element = options.container.value

    if (!element) {
      return
    }

    const rowHeight = options.rowHeight()
    const top = index * rowHeight
    const bottom = top + rowHeight
    const stickyOffset = Number(element.dataset.stickyOffset ?? 0)

    if (top < element.scrollTop + stickyOffset) {
      element.scrollTop = top - stickyOffset
    } else if (bottom > element.scrollTop + element.clientHeight) {
      element.scrollTop = bottom - element.clientHeight
    }

    scrollTop.value = element.scrollTop
  }

  function disconnect(element: HTMLElement | null) {
    element?.removeEventListener('scroll', onScroll)
    observer?.disconnect()
    observer = undefined
  }

  watch(
    options.container,
    (element, previous) => {
      disconnect(previous ?? null)

      if (!element) {
        return
      }

      element.addEventListener('scroll', onScroll, { passive: true })
      viewportHeight.value = element.clientHeight

      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => {
          viewportHeight.value = element.clientHeight
        })
        observer.observe(element)
      }
    },
    { flush: 'post', immediate: true },
  )

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    disconnect(options.container.value)
  })

  return { range, totalHeight, offsetTop, offsetBottom, scrollToRow }
}
