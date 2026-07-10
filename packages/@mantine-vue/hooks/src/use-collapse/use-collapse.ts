import {
  nextTick,
  ref,
  toValue,
  watch,
  type CSSProperties,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { assignRef, type VueRefTarget } from '../use-merged-ref/use-merged-ref'

export type UseCollapseState = 'entering' | 'entered' | 'exiting' | 'exited'

export interface UseCollapseInput {
  /** Expanded state */
  expanded: MaybeRefOrGetter<boolean>

  /** Transition duration in milliseconds, by default calculated based on content height */
  transitionDuration?: number

  /** Transition timing function, `ease` by default */
  transitionTimingFunction?: string

  /** Called when transition ends */
  onTransitionEnd?: () => void

  /** Called when transition starts */
  onTransitionStart?: () => void

  /** If true, collapsed content is kept in the DOM and hidden with `display: none` styles */
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

export interface UseCollapseReturnValue {
  state: Ref<UseCollapseState>
  getCollapseProps: (input?: GetCollapsePropsInput) => GetCollapsePropsReturnValue
}

function getAutoSizeDuration(size: number | string) {
  if (!size || typeof size === 'string') {
    return 0
  }

  const constant = size / 36
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
}

export function getElementContentSize(
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
      const margin = childStyles ? Number.parseFloat(childStyles[marginProperty as any]) || 0 : 0

      return (childRect as any)[endProperty] - start + margin
    }),
    0,
  )
}

function getCssSize(size: number | string) {
  return typeof size === 'number' ? `${size}px` : size
}

export function createCollapse({
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
}): UseCollapseReturnValue {
  const isExpanded = () => toValue(expanded)
  const collapsedStyles = {
    [dimension]: 0,
    overflow: 'hidden',
    ...(keepMounted ? {} : { display: 'none' }),
  } as CSSProperties

  const elementRef = ref<HTMLDivElement | null>(null)
  const styles = ref<CSSProperties>(isExpanded() ? {} : collapsedStyles)
  const state = ref<UseCollapseState>(isExpanded() ? 'entered' : 'exited') as Ref<UseCollapseState>
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

      if (getCssSize(size) === styles.value[dimension as keyof CSSProperties]) {
        styles.value = {}
      } else {
        mergeStyles({ [dimension]: getCssSize(size) })
      }

      state.value = 'entered'
      onTransitionEnd?.()
    } else if (styles.value[dimension as keyof CSSProperties] === 0) {
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

export function useCollapse(input: UseCollapseInput): UseCollapseReturnValue {
  return createCollapse({
    ...input,
    dimension: 'height',
    getElementSize: (element) => getElementContentSize(element, 'height'),
  })
}
