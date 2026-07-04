import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

function toNumber(value: string) {
  return Number.parseInt(value, 10) || 0
}

export interface UseFloatingIndicatorInput {
  target: Ref<HTMLElement | null | undefined>
  parent: Ref<HTMLElement | null | undefined>
  floatingRef: Ref<HTMLElement | null>
  displayAfterTransitionEnd?: boolean
  onTransitionStart?: () => void
  onTransitionEnd?: () => void
}

export function useFloatingIndicator({
  target,
  parent,
  floatingRef,
  displayAfterTransitionEnd,
  onTransitionStart,
  onTransitionEnd,
}: UseFloatingIndicatorInput) {
  const initialized = ref(false)
  const hidden = ref(
    typeof displayAfterTransitionEnd === 'boolean' ? displayAfterTransitionEnd : false,
  )
  let targetResizeObserver: ResizeObserver | undefined
  let parentResizeObserver: ResizeObserver | undefined
  let transitionTimeout: ReturnType<typeof setTimeout> | undefined
  let previousTarget: HTMLElement | null | undefined = target.value

  const updatePosition = () => {
    const targetElement = target.value
    const parentElement = parent.value
    const floatingElement = floatingRef.value

    if (!targetElement || !parentElement || !floatingElement || typeof window === 'undefined') {
      return
    }

    const targetRect = targetElement.getBoundingClientRect()
    const parentRect = parentElement.getBoundingClientRect()
    const targetStyle = window.getComputedStyle(targetElement)
    const parentStyle = window.getComputedStyle(parentElement)
    const borderTopWidth =
      toNumber(targetStyle.borderTopWidth) + toNumber(parentStyle.borderTopWidth)
    const borderLeftWidth =
      toNumber(targetStyle.borderLeftWidth) + toNumber(parentStyle.borderLeftWidth)

    floatingElement.style.transform = `translateY(${targetRect.top - parentRect.top - borderTopWidth}px) translateX(${targetRect.left - parentRect.left - borderLeftWidth}px)`
    floatingElement.style.width = `${targetRect.width}px`
    floatingElement.style.height = `${targetRect.height}px`
  }

  const updatePositionWithoutAnimation = () => {
    if (transitionTimeout) {
      clearTimeout(transitionTimeout)
    }

    if (floatingRef.value) {
      floatingRef.value.style.transitionDuration = '0ms'
    }

    updatePosition()
    transitionTimeout = setTimeout(() => {
      if (floatingRef.value) {
        floatingRef.value.style.transitionDuration = ''
      }
    }, 30)
  }

  const cleanupObservers = () => {
    targetResizeObserver?.disconnect()
    parentResizeObserver?.disconnect()
    targetResizeObserver = undefined
    parentResizeObserver = undefined
  }

  const observe = () => {
    cleanupObservers()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    if (target.value) {
      targetResizeObserver = new ResizeObserver(updatePositionWithoutAnimation)
      targetResizeObserver.observe(target.value)
    }

    if (parent.value) {
      parentResizeObserver = new ResizeObserver(updatePositionWithoutAnimation)
      parentResizeObserver.observe(parent.value)
    }
  }

  watch(
    [target, parent],
    () => {
      if (initialized.value && previousTarget !== target.value) {
        onTransitionStart?.()
      }

      previousTarget = target.value
      nextTick(() => {
        updatePosition()
        observe()
      })
    },
    { immediate: true },
  )

  onMounted(() => {
    setTimeout(() => {
      initialized.value = true
    }, 20)

    const parentElement = parent.value
    const handleTransitionEnd = () => {
      updatePositionWithoutAnimation()
      hidden.value = false
    }
    const handleIndicatorTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'transform') {
        onTransitionEnd?.()
      }
    }

    parentElement?.addEventListener('transitionend', handleTransitionEnd)
    floatingRef.value?.addEventListener('transitionend', handleIndicatorTransitionEnd)

    onBeforeUnmount(() => {
      parentElement?.removeEventListener('transitionend', handleTransitionEnd)
      floatingRef.value?.removeEventListener('transitionend', handleIndicatorTransitionEnd)
    })
  })

  onBeforeUnmount(() => {
    cleanupObservers()
    if (transitionTimeout) {
      clearTimeout(transitionTimeout)
    }
  })

  return { initialized, hidden, updatePosition }
}
