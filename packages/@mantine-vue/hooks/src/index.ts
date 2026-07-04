import {
  computed,
  customRef,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
  type CSSProperties,
} from 'vue'
export { useFocusTrap } from './use-focus-trap/use-focus-trap'
export {
  FOCUS_SELECTOR,
  findTabbableDescendants,
  focusable,
  scopeTab,
  tabbable,
} from './use-focus-trap/use-focus-trap'
export { normalizeRadialValue, useRadialMove } from './use-radial-move/use-radial-move'
export type {
  UseRadialMoveOptions,
  UseRadialMoveReturnValue,
} from './use-radial-move/use-radial-move'
export { useScroller } from './use-scroller/use-scroller'
export type {
  UseScrollerOptions,
  UseScrollerReturnValue,
  UseScrollerScrollState,
} from './use-scroller/use-scroller'
export { useScrollSpy } from './use-scroll-spy/use-scroll-spy'
export type { UseScrollSpyHeadingData, UseScrollSpyOptions } from './use-scroll-spy/use-scroll-spy'
export { useFloatingWindow } from './use-floating-window/use-floating-window'
export type {
  FloatingWindowPosition,
  FloatingWindowPositionConfig,
  SetFloatingWindowPosition,
  UseFloatingWindowOptions,
} from './use-floating-window/use-floating-window'
export { clampUseMovePosition, useMove } from './use-move/use-move'
export type { UseMoveHandlers, UseMovePosition } from './use-move/use-move'
export { useFocusReturn } from './use-focus-return/use-focus-return'
export type { UseFocusReturnInput } from './use-focus-return/use-focus-return'
export { useLongPress } from './use-long-press/use-long-press'
export type {
  UseLongPressEvent,
  UseLongPressOptions,
  UseLongPressReturnValue,
} from './use-long-press/use-long-press'
export { useClickOutside } from './use-click-outside/use-click-outside'

export interface UseDisclosureOptions {
  onOpen?: () => void
  onClose?: () => void
}

export interface UseDisclosureHandlers {
  set: (value: boolean) => void
  open: () => void
  close: () => void
  toggle: () => void
}

export type UseDisclosureReturnValue = [Ref<boolean>, UseDisclosureHandlers]

export function useDisclosure(
  initialState = false,
  options: UseDisclosureOptions = {},
): UseDisclosureReturnValue {
  const opened = ref(initialState)

  const set = (value: boolean) => {
    if (value && !opened.value) {
      options.onOpen?.()
    }

    if (!value && opened.value) {
      options.onClose?.()
    }

    opened.value = value
  }

  return [
    opened,
    {
      set,
      open: () => set(true),
      close: () => set(false),
      toggle: () => set(!opened.value),
    },
  ]
}

export type HotkeyItem = [string, (event: KeyboardEvent) => void]

export interface UseHotkeysOptions {
  tagsToIgnore?: MaybeRefOrGetter<string[] | undefined>
  triggerOnContentEditable?: MaybeRefOrGetter<boolean | undefined>
}

function isHotkeyIgnoredTarget(
  target: EventTarget | null,
  tagsToIgnore: string[] | undefined,
  triggerOnContentEditable: boolean | undefined,
) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tags = tagsToIgnore ?? ['input', 'textarea', 'select']
  const tagName = target.tagName.toLowerCase()

  if (tags.includes(tagName)) {
    return true
  }

  return !triggerOnContentEditable && target.isContentEditable
}

function hotkeyMatches(event: KeyboardEvent, hotkey: string) {
  const parts = hotkey
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
  const key = parts[parts.length - 1]
  const mod = parts.includes('mod')

  if (mod && !(event.ctrlKey || event.metaKey)) {
    return false
  }

  if (parts.includes('ctrl') && !event.ctrlKey) return false
  if (parts.includes('meta') && !event.metaKey) return false
  if (parts.includes('shift') && !event.shiftKey) return false
  if (parts.includes('alt') && !event.altKey) return false

  return event.key.toLowerCase() === key
}

export function useHotkeys(
  hotkeys: MaybeRefOrGetter<HotkeyItem[]>,
  tagsToIgnore?: MaybeRefOrGetter<string[] | undefined>,
  triggerOnContentEditable?: MaybeRefOrGetter<boolean | undefined>,
) {
  const handleKeydown = (event: KeyboardEvent) => {
    if (
      isHotkeyIgnoredTarget(event.target, toValue(tagsToIgnore), toValue(triggerOnContentEditable))
    ) {
      return
    }

    const hotkey = toValue(hotkeys).find(([shortcut]) => hotkeyMatches(event, shortcut))

    if (hotkey) {
      event.preventDefault()
      hotkey[1](event)
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
}

export interface UseUncontrolledOptions<T> {
  value?: MaybeRefOrGetter<T | undefined>
  defaultValue?: T
  finalValue?: T
  onChange?: (value: T, ...payload: any[]) => void
}

export type UseUncontrolledReturnValue<T> = [
  Ref<T>,
  (value: T, ...payload: any[]) => void,
  Ref<boolean>,
]

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange = () => {},
}: UseUncontrolledOptions<T>): UseUncontrolledReturnValue<T> {
  const uncontrolledValue = ref(defaultValue !== undefined ? defaultValue : finalValue) as Ref<T>
  const isControlled = computed(() => toValue(value) !== undefined)
  const currentValue = computed({
    get: () => (isControlled.value ? (toValue(value) as T) : uncontrolledValue.value),
    set: (nextValue) => {
      if (!isControlled.value) {
        uncontrolledValue.value = nextValue
      }

      onChange(nextValue)
    },
  })

  return [
    currentValue,
    (nextValue, ...payload) => {
      if (!isControlled.value) {
        uncontrolledValue.value = nextValue
      }
      onChange(nextValue, ...payload)
    },
    isControlled,
  ]
}

export const DOTS = 'dots' as const

export interface UsePaginationOptions {
  total: number
  siblings?: number
  boundaries?: number
  page?: MaybeRefOrGetter<number | undefined>
  initialPage?: number
  onChange?: (page: number) => void
  startValue?: number
}

function range(start: number, end: number) {
  const length = Math.max(end - start + 1, 0)
  return Array.from({ length }, (_, index) => index + start)
}

export function usePagination({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage,
  onChange,
  startValue = 1,
}: UsePaginationOptions) {
  const start = computed(() => Math.max(Math.trunc(startValue), 1))
  const end = computed(() => Math.max(Math.trunc(total), start.value))
  const totalPages = computed(() => end.value - start.value + 1)
  const firstPage = computed(() => initialPage ?? start.value)
  const [active, setActive] = useUncontrolled<number>({
    value: page,
    defaultValue: firstPage.value,
    finalValue: firstPage.value,
    onChange,
  })

  const setPage = (pageNumber: number) => {
    const nextPage = Math.min(end.value, Math.max(start.value, pageNumber))

    if (nextPage !== active.value) {
      setActive(nextPage)
    }
  }

  const paginationRange = computed<(number | typeof DOTS)[]>(() => {
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2

    if (totalPageNumbers >= totalPages.value) {
      return range(start.value, end.value)
    }

    const leftSiblingIndex = Math.max(active.value - siblings, start.value + boundaries - 1)
    const rightSiblingIndex = Math.min(active.value + siblings, end.value - boundaries)
    const shouldShowLeftDots = leftSiblingIndex > start.value + boundaries + 1
    const shouldShowRightDots = rightSiblingIndex < end.value - boundaries

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2
      return [
        ...range(start.value, start.value + leftItemCount - 1),
        DOTS,
        ...range(end.value - (boundaries - 1), end.value),
      ]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + siblings * 2
      return [
        ...range(start.value, start.value + boundaries - 1),
        DOTS,
        ...range(end.value - rightItemCount, end.value),
      ]
    }

    return [
      ...range(start.value, start.value + boundaries - 1),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(end.value - boundaries + 1, end.value),
    ]
  })

  return {
    range: paginationRange,
    active,
    setPage,
    next: () => setPage(active.value + 1),
    previous: () => setPage(active.value - 1),
    first: () => setPage(start.value),
    last: () => setPage(end.value),
  }
}

export function useToggle<T extends string | boolean = boolean>(
  options: readonly T[] = [false, true] as unknown as readonly T[],
) {
  const state = ref(options[0]) as Ref<T>
  const toggle = (value?: T) => {
    if (value !== undefined) {
      state.value = value
      return
    }

    const index = options.indexOf(state.value)
    state.value = options[(index + 1) % options.length]
  }

  return [state, toggle] as const
}

export interface UseCounterOptions {
  min?: number
  max?: number
}

export function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const count = ref(initialValue)
  const clamp = (value: number) =>
    Math.min(options.max ?? value, Math.max(options.min ?? value, value))
  const set = (value: number | ((current: number) => number)) => {
    count.value = clamp(typeof value === 'function' ? value(count.value) : value)
  }

  return [
    count,
    {
      increment: () => set((value) => value + 1),
      decrement: () => set((value) => value - 1),
      set,
      reset: () => set(initialValue),
    },
  ] as const
}

export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  wait: number,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  onBeforeUnmount(clear)

  const debounced = (...args: Args) => {
    clear()
    timeout = setTimeout(() => callback(...args), wait)
  }

  debounced.cancel = clear
  return debounced
}

export function useDebouncedValue<T>(value: MaybeRefOrGetter<T>, wait: number) {
  const debounced = ref(toValue(value)) as Ref<T>
  const update = useDebouncedCallback((nextValue: T) => {
    debounced.value = nextValue
  }, wait)

  watch(() => toValue(value), update)

  return [readonly(debounced), update.cancel] as const
}

export interface UseMediaQueryOptions {
  getInitialValueInEffect?: boolean
}

function getInitialMediaQueryValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === 'boolean') {
    return initialValue
  }

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia(query).matches
  }

  return false
}

export function useMediaQuery(
  query: MaybeRefOrGetter<string>,
  initialValue = false,
  options: UseMediaQueryOptions = { getInitialValueInEffect: true },
) {
  const matches = ref(initialValue)
  const instance = getCurrentInstance()
  let mediaQueryList: MediaQueryList | undefined

  const cleanup = () => mediaQueryList?.removeEventListener('change', update)
  const update = (event?: MediaQueryListEvent) => {
    matches.value = event ? event.matches : Boolean(mediaQueryList?.matches)
  }

  if (!options.getInitialValueInEffect) {
    matches.value = getInitialMediaQueryValue(toValue(query), initialValue)
  }

  if (instance) {
    onMounted(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return
      }

      mediaQueryList = window.matchMedia(toValue(query))
      update()
      mediaQueryList.addEventListener('change', update)
    })

    onBeforeUnmount(cleanup)
  }

  watch(
    () => toValue(query),
    () => {
      cleanup()
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        mediaQueryList = window.matchMedia(toValue(query))
        update()
        mediaQueryList.addEventListener('change', update)
      }
    },
  )

  return readonly(matches)
}

export function useReducedMotion(initialValue?: boolean, options?: UseMediaQueryOptions) {
  return useMediaQuery('(prefers-reduced-motion: reduce)', initialValue, options)
}

let idCounter = 0

export function useId(staticId?: string) {
  const id = ref(staticId || '')

  onMounted(() => {
    if (!id.value) {
      id.value = `mantine-vue-${++idCounter}`
    }
  })

  if (staticId) {
    id.value = staticId
  }

  return id
}

export type VueRefTarget<T> = Ref<T | null> | ((value: T | null) => void) | undefined

export function assignRef<T>(refTarget: VueRefTarget<T>, value: T | null) {
  if (typeof refTarget === 'function') {
    refTarget(value)
  } else if (refTarget) {
    refTarget.value = value
  }
}

export function mergeRefs<T>(...refs: VueRefTarget<T>[]) {
  return (value: T | null) => refs.forEach((refTarget) => assignRef(refTarget, value))
}

export function useMergedRef<T>(...refs: VueRefTarget<T>[]) {
  return mergeRefs<T>(...refs)
}

export function readLocalStorageValue<T>({ key, defaultValue }: { key: string; defaultValue?: T }) {
  if (typeof window === 'undefined') {
    return defaultValue
  }

  const item = window.localStorage.getItem(key)
  return item ? (JSON.parse(item) as T) : defaultValue
}

export function useLocalStorage<T>({ key, defaultValue }: { key: string; defaultValue: T }) {
  const value = ref(readLocalStorageValue<T>({ key, defaultValue })) as Ref<T>

  watch(
    value,
    (nextValue) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(nextValue))
      }
    },
    { deep: true },
  )

  return [value, (nextValue: T) => (value.value = nextValue)] as const
}

export function useMounted() {
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })
  return readonly(mounted)
}

export function usePrevious<T>(value: MaybeRefOrGetter<T>) {
  const previous = shallowRef<T>()
  watch(
    () => toValue(value),
    (_, oldValue) => {
      previous.value = oldValue
    },
  )
  return previous
}

export function useForceUpdate() {
  const key = ref(0)
  return [key, () => key.value++] as const
}

export function useClipboard({ timeout = 2000 } = {}) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const copy = async (value: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(value)
    }

    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, timeout)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copy, copied, reset: () => (copied.value = false) }
}

export function useIsomorphicEffect(effect: () => void) {
  if (typeof window === 'undefined') {
    return
  }

  onMounted(effect)
}

export function useDidUpdate(effect: () => void, deps: MaybeRefOrGetter<unknown>[]) {
  let mounted = false

  watch(
    deps.map((dep) => () => toValue(dep)),
    () => {
      if (mounted) {
        effect()
      }
      mounted = true
    },
  )
}

export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  onMounted(() => window.addEventListener(type, listener, options))
  onBeforeUnmount(() => window.removeEventListener(type, listener, options))
}

export function useElementSize<T extends Element = HTMLElement>() {
  const refTarget = ref<T | null>(null)
  const width = ref(0)
  const height = ref(0)
  let observer: ResizeObserver | undefined

  onMounted(() => {
    if (!refTarget.value || typeof ResizeObserver === 'undefined') {
      return
    }

    observer = new ResizeObserver(([entry]) => {
      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
    })

    observer.observe(refTarget.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { ref: refTarget, width, height }
}

export function useTimeout(callback: () => void, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const start = () => {
    clear()
    timeout = setTimeout(callback, delay)
  }

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  onBeforeUnmount(clear)
  return { start, clear }
}

export function useDocumentTitle(title: MaybeRefOrGetter<string>) {
  useIsomorphicEffect(() => {
    watch(
      () => toValue(title),
      (value) => {
        document.title = value
      },
      { immediate: true },
    )
  })
}

export function useInputState<T>(initialValue: T) {
  const value = ref(initialValue) as Ref<T>
  const setValue = (eventOrValue: Event | T) => {
    if (eventOrValue instanceof Event) {
      const target = eventOrValue.target as HTMLInputElement
      value.value = (target.type === 'checkbox' ? target.checked : target.value) as T
    } else {
      value.value = eventOrValue
    }
  }

  return [value, setValue] as const
}

export function useFocusWithin<T extends HTMLElement = HTMLElement>() {
  const refTarget = ref<T | null>(null)
  const focused = ref(false)
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const node = refTarget.value
    if (!node) {
      return
    }

    const onFocusIn = () => (focused.value = true)
    const onFocusOut = () => nextTick(() => (focused.value = node.matches(':focus-within')))

    node.addEventListener('focusin', onFocusIn)
    node.addEventListener('focusout', onFocusOut)

    cleanup = () => {
      node.removeEventListener('focusin', onFocusIn)
      node.removeEventListener('focusout', onFocusOut)
    }
  })

  onBeforeUnmount(() => cleanup?.())

  return { ref: refTarget, focused }
}

export function useHover<T extends HTMLElement = HTMLElement>() {
  const refTarget = ref<T | null>(null)
  const hovered = ref(false)
  let cleanup: (() => void) | undefined

  onMounted(() => {
    const node = refTarget.value
    if (!node) {
      return
    }

    const onEnter = () => (hovered.value = true)
    const onLeave = () => (hovered.value = false)

    node.addEventListener('mouseenter', onEnter)
    node.addEventListener('mouseleave', onLeave)

    cleanup = () => {
      node.removeEventListener('mouseenter', onEnter)
      node.removeEventListener('mouseleave', onLeave)
    }
  })

  onBeforeUnmount(() => cleanup?.())

  return { ref: refTarget, hovered }
}

export function useDebouncedState<T>(initialValue: T, wait: number) {
  const value = customRef<T>((track, trigger) => {
    let current = initialValue
    let timeout: ReturnType<typeof setTimeout>
    return {
      get() {
        track()
        return current
      },
      set(nextValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          current = nextValue
          trigger()
        }, wait)
      },
    }
  })

  return [value, (nextValue: T) => (value.value = nextValue)] as const
}

export type UseCollapseState = 'entering' | 'entered' | 'exiting' | 'exited'

export interface UseCollapseInput {
  expanded: MaybeRefOrGetter<boolean>
  transitionDuration?: number
  transitionTimingFunction?: string
  onTransitionEnd?: () => void
  onTransitionStart?: () => void
  keepMounted?: boolean
}

export interface GetCollapsePropsInput {
  style?: CSSProperties
  ref?: VueRefTarget<HTMLDivElement>
}

export interface GetCollapsePropsReturnValue {
  'aria-hidden': boolean
  inert: boolean
  ref: (value: any) => void
  onTransitionend: (event: TransitionEvent) => void
  style: CSSProperties
}

function getAutoSizeDuration(size: number | string) {
  if (!size || typeof size === 'string') {
    return 0
  }

  const constant = size / 36
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

function getElementContentSize(
  element: HTMLElement | null,
  dimension: 'height' | 'width',
): number | string {
  if (!element) {
    return 'auto'
  }

  const size = dimension === 'height' ? element.scrollHeight : element.scrollWidth

  if (size !== 0) {
    return size
  }

  const children = Array.from(element.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  )

  if (children.length === 0) {
    return size
  }

  const childrenScrollSize = children.reduce(
    (acc, child) => acc + (dimension === 'height' ? child.scrollHeight : child.scrollWidth),
    0,
  )

  if (childrenScrollSize !== 0) {
    return childrenScrollSize
  }

  const rect = element.getBoundingClientRect()
  const start = dimension === 'height' ? rect.top : rect.left
  const endProperty = dimension === 'height' ? 'bottom' : 'right'
  const marginProperty = dimension === 'height' ? 'marginBottom' : 'marginRight'
  const view = element.ownerDocument.defaultView

  return Math.max(
    ...children.map((child) => {
      const childRect = child.getBoundingClientRect()
      const childStyles = view?.getComputedStyle(child)
      const margin = childStyles ? Number.parseFloat(childStyles[marginProperty]) || 0 : 0

      return childRect[endProperty] - start + margin
    }),
    0,
  )
}

function getCssSize(size: number | string) {
  return typeof size === 'number' ? `${size}px` : size
}

function createCollapse({
  dimension,
  getElementSize,
  expanded,
  transitionDuration,
  transitionTimingFunction = 'ease',
  onTransitionEnd,
  onTransitionStart,
  keepMounted,
}: UseCollapseInput & {
  dimension: 'height' | 'width'
  getElementSize: (element: HTMLElement | null) => number | string
}) {
  const isExpanded = () => toValue(expanded)
  const collapsedStyles = {
    [dimension]: 0,
    overflow: 'hidden',
    ...(keepMounted ? {} : { display: 'none' }),
  } as CSSProperties

  const elementRef = ref<HTMLDivElement | null>(null)
  const styles = ref<CSSProperties>(isExpanded() ? {} : collapsedStyles)
  const state = ref<UseCollapseState>(isExpanded() ? 'entered' : 'exited')
  const raf =
    typeof window === 'undefined'
      ? (callback: FrameRequestCallback) => callback(0)
      : window.requestAnimationFrame

  const mergeStyles = (nextStyles: CSSProperties) => {
    styles.value = { ...styles.value, ...nextStyles }
  }

  const measureExpandedSize = (attempt = 0) => {
    if (!isExpanded()) {
      return
    }

    const size = getElementSize(elementRef.value)
    if (size === 0 && elementRef.value?.children.length && attempt < 5) {
      raf(() => measureExpandedSize(attempt + 1))
      return
    }

    mergeStyles({ ...getTransitionStyles(size), [dimension]: getCssSize(size) })
  }

  const getTransitionStyles = (size: number | string) => {
    const duration = transitionDuration ?? getAutoSizeDuration(size)
    return {
      transition: `${dimension} ${duration}ms ${transitionTimingFunction}, opacity ${duration}ms ${transitionTimingFunction}`,
    }
  }

  watch(
    () => isExpanded(),
    (value, oldValue) => {
      if (value === oldValue) {
        return
      }

      if (transitionDuration !== 0) {
        onTransitionStart?.()
      }

      if (value) {
        raf(() => {
          state.value = 'entering'
          mergeStyles({ willChange: dimension, display: 'block', overflow: 'hidden' })
          void nextTick(() => {
            raf(() => {
              raf(() => measureExpandedSize())
            })
          })
        })
      } else {
        raf(() => {
          state.value = 'exiting'
          const size = getElementSize(elementRef.value)
          mergeStyles({
            ...getTransitionStyles(size),
            willChange: dimension,
            [dimension]: getCssSize(size),
          })
          raf(() => mergeStyles({ [dimension]: 0, overflow: 'hidden' }))
        })
      }
    },
    { flush: 'post' },
  )

  const handleTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== elementRef.value || event.propertyName !== dimension) {
      return
    }

    if (isExpanded()) {
      const size = getElementSize(elementRef.value)

      if (getCssSize(size) === styles.value[dimension]) {
        styles.value = {}
      } else {
        mergeStyles({ [dimension]: getCssSize(size) })
      }

      state.value = 'entered'
      onTransitionEnd?.()
    } else if (styles.value[dimension] === 0) {
      styles.value = collapsedStyles
      state.value = 'exited'
      onTransitionEnd?.()
    }
  }

  return {
    state,
    getCollapseProps: (input: GetCollapsePropsInput = {}): GetCollapsePropsReturnValue => {
      const setRef = (value: any) => {
        const element = value?.$el ?? value
        elementRef.value = element
        assignRef(input.ref, element)
      }

      return {
        'aria-hidden': !isExpanded(),
        inert: !isExpanded(),
        ref: setRef,
        onTransitionend: handleTransitionEnd,
        style: { boxSizing: 'border-box', ...input.style, ...styles.value },
      }
    },
  }
}

export function useCollapse(input: UseCollapseInput) {
  return createCollapse({
    ...input,
    dimension: 'height',
    getElementSize: (element) => getElementContentSize(element, 'height'),
  })
}

export function useHorizontalCollapse(input: UseCollapseInput) {
  return createCollapse({
    ...input,
    dimension: 'width',
    getElementSize: (element) => getElementContentSize(element, 'width'),
  })
}
