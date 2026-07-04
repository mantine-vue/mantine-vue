import {
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from 'vue'

export interface UseScrollSpyHeadingData {
  depth: number
  value: string
  id: string
  getNode: () => HTMLElement
}

export interface UseScrollSpyOptions {
  selector?: MaybeRefOrGetter<string>
  getDepth?: (element: HTMLElement) => number
  getValue?: (element: HTMLElement) => string
  scrollHost?: MaybeRefOrGetter<HTMLElement | undefined>
  offset?: MaybeRefOrGetter<number>
}

let scrollSpyId = 0

function getActiveElement(rects: DOMRect[], offset = 0) {
  if (rects.length === 0) return -1
  return rects.reduce(
    (closest, rect, index) =>
      Math.abs(closest.position - offset) < Math.abs(rect.y - offset)
        ? closest
        : { index, position: rect.y },
    { index: 0, position: rects[0].y },
  ).index
}

export function useScrollSpy(options: UseScrollSpyOptions = {}) {
  const active = ref(-1)
  const initialized = ref(false)
  const data = ref<UseScrollSpyHeadingData[]>([])
  let host: HTMLElement | Window | undefined

  const updateActive = () => {
    active.value = getActiveElement(
      data.value.map((item) => item.getNode()?.getBoundingClientRect()).filter(Boolean),
      toValue(options.offset) ?? 0,
    )
  }

  const reinitialize = () => {
    if (typeof document === 'undefined') return
    const getDepth = options.getDepth ?? ((element: HTMLElement) => Number(element.tagName[1]))
    const getValue = options.getValue ?? ((element: HTMLElement) => element.textContent || '')
    data.value = Array.from(
      document.querySelectorAll<HTMLElement>(toValue(options.selector) ?? 'h1, h2, h3, h4, h5, h6'),
    ).map((heading) => ({
      depth: getDepth(heading),
      value: getValue(heading),
      id: heading.id || `mantine-scroll-spy-${++scrollSpyId}`,
      getNode: () => (heading.id ? (document.getElementById(heading.id) ?? heading) : heading),
    }))
    initialized.value = true
    updateActive()
  }

  const bind = () => {
    host?.removeEventListener('scroll', updateActive)
    host = toValue(options.scrollHost) ?? (typeof window !== 'undefined' ? window : undefined)
    host?.addEventListener('scroll', updateActive, { passive: true })
  }

  onMounted(() => {
    reinitialize()
    bind()
  })
  onBeforeUnmount(() => host?.removeEventListener('scroll', updateActive))
  watch(
    () => [toValue(options.selector), toValue(options.offset), toValue(options.scrollHost)],
    () => {
      reinitialize()
      bind()
    },
  )

  return {
    active: readonly(active),
    initialized: readonly(initialized),
    data: readonly(data),
    reinitialize,
  }
}
