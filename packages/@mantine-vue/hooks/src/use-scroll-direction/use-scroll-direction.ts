import { onBeforeUnmount, readonly, ref, type Ref } from 'vue'
import { useWindowEvent } from '../use-window-event/use-window-event'

export type ScrollDirection = 'up' | 'down' | 'unknown'

export function useScrollDirection(): Readonly<Ref<ScrollDirection>> {
  const scrollDirection = ref<ScrollDirection>('unknown')
  let lastScrollTop = 0
  let isResizing = false
  let resizeTimer: number | undefined

  const handleScroll = () => {
    if (isResizing) {
      return
    }

    const currentScrollTop = window.scrollY || document.documentElement.scrollTop
    scrollDirection.value = currentScrollTop < lastScrollTop ? 'up' : 'down'
    lastScrollTop = currentScrollTop
  }

  const handleResize = () => {
    isResizing = true
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      isResizing = false
    }, 300)
  }

  useWindowEvent('scroll', handleScroll)
  useWindowEvent('resize', handleResize)

  onBeforeUnmount(() => window.clearTimeout(resizeTimer))

  return readonly(scrollDirection) as Readonly<Ref<ScrollDirection>>
}
