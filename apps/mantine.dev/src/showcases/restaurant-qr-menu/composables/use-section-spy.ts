import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

/**
 * Tracks which menu section is under the sticky navigation. Cheaper than an
 * observer per section for long menus: a single rAF-throttled scroll listener.
 */
export function useSectionSpy(options: {
  ids: Ref<string[]>
  /** Distance from the top of the viewport that counts as "current". */
  offset: () => number
}) {
  const active = ref<string | null>(null)
  let frame = 0
  let lockedUntil = 0

  const measure = () => {
    frame = 0
    if (Date.now() < lockedUntil) {
      return
    }
    const offset = options.offset()
    let current: string | null = options.ids.value[0] ?? null
    for (const id of options.ids.value) {
      const element = document.getElementById(id)
      if (element && element.getBoundingClientRect().top - offset <= 1) {
        current = id
      }
    }
    active.value = current
  }

  const onScroll = () => {
    if (!frame) {
      frame = requestAnimationFrame(measure)
    }
  }

  /** Scrolls to a section and pins it as active while the smooth scroll runs. */
  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (!element) {
      return
    }
    active.value = id
    lockedUntil = Date.now() + 900
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    element.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    measure()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
  })

  return { active, scrollTo, refresh: measure }
}
