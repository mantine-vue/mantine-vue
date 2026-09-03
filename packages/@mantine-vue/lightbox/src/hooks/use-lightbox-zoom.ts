import { computed, onBeforeUnmount, reactive, ref, watch, type CSSProperties } from 'vue'

export interface LightboxZoomState {
  scale: number
  translateX: number
  translateY: number
  isZoomed: boolean
}

interface UseLightboxZoomInput {
  enabled: () => boolean
  maxScale: () => number
  currentIndex: () => number
}

const INITIAL_ZOOM_STATE: LightboxZoomState = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  isZoomed: false,
}

function clampTranslate(
  state: LightboxZoomState,
  image: HTMLImageElement | null,
): LightboxZoomState {
  if (!image) return state

  const maxX = (image.offsetWidth * (state.scale - 1)) / 2
  const maxY = (image.offsetHeight * (state.scale - 1)) / 2

  return {
    ...state,
    translateX: Math.max(-maxX, Math.min(maxX, state.translateX)),
    translateY: Math.max(-maxY, Math.min(maxY, state.translateY)),
  }
}

export function useLightboxZoom({ enabled, maxScale, currentIndex }: UseLightboxZoomInput) {
  const state = reactive<LightboxZoomState>({ ...INITIAL_ZOOM_STATE })
  const imageRef = ref<HTMLImageElement | null>(null)
  const isDragging = ref(false)
  const isAdjusting = ref(false)
  const didDrag = ref(false)
  const dragStart = { x: 0, y: 0 }
  const translateStart = { x: 0, y: 0 }
  const lastPinchDistance = ref<number | null>(null)
  const lastPointerType = ref('mouse')
  const lastClickPointerType = ref('mouse')
  let adjustTimeout = -1

  const setState = (next: LightboxZoomState) => Object.assign(state, next)
  const resetZoom = () => {
    setState(INITIAL_ZOOM_STATE)
    isDragging.value = false
  }
  const beginAdjust = () => {
    isAdjusting.value = true
    window.clearTimeout(adjustTimeout)
    adjustTimeout = window.setTimeout(() => {
      isAdjusting.value = false
    }, 120)
  }
  const toggleZoom = () => {
    if (!enabled()) return
    setState(
      state.isZoomed
        ? INITIAL_ZOOM_STATE
        : {
            scale: Math.min(2, maxScale()),
            translateX: 0,
            translateY: 0,
            isZoomed: true,
          },
    )
  }
  const zoomAtPoint = (deltaScale: number, clientX?: number, clientY?: number) => {
    const nextScale = Math.max(1, Math.min(maxScale(), state.scale + deltaScale))
    if (nextScale === 1) {
      resetZoom()
      return
    }

    const image = imageRef.value
    let translateX = state.translateX
    let translateY = state.translateY

    if (image && clientX !== undefined && clientY !== undefined) {
      const rect = image.getBoundingClientRect()
      const scaleRatio = nextScale / state.scale
      const offsetX = clientX - (rect.left + rect.width / 2) + state.translateX
      const offsetY = clientY - (rect.top + rect.height / 2) + state.translateY
      translateX = offsetX * (1 - scaleRatio) + state.translateX * scaleRatio
      translateY = offsetY * (1 - scaleRatio) + state.translateY * scaleRatio
    }

    setState(clampTranslate({ scale: nextScale, translateX, translateY, isZoomed: true }, image))
  }
  const panZoom = (deltaX: number, deltaY: number) => {
    if (!state.isZoomed) return false
    setState(
      clampTranslate(
        {
          ...state,
          translateX: state.translateX + deltaX,
          translateY: state.translateY + deltaY,
        },
        imageRef.value,
      ),
    )
    return true
  }
  const handleWheel = (event: WheelEvent) => {
    if (event.deltaY === 0) return
    event.preventDefault()
    beginAdjust()
    zoomAtPoint(event.deltaY > 0 ? -0.2 : 0.2, event.clientX, event.clientY)
  }
  const setImageRef = (node: unknown) => {
    imageRef.value?.removeEventListener('wheel', handleWheel)
    imageRef.value = node instanceof HTMLImageElement ? node : null
    imageRef.value?.addEventListener('wheel', handleWheel, { passive: false })
  }
  const handlePointerDown = (event: PointerEvent) => {
    lastPointerType.value = event.pointerType || 'mouse'
    if (!state.isZoomed || !enabled()) return

    isDragging.value = true
    didDrag.value = false
    dragStart.x = event.clientX
    dragStart.y = event.clientY
    translateStart.x = state.translateX
    translateStart.y = state.translateY
    if (typeof (event.target as HTMLElement | null)?.setPointerCapture === 'function') {
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
    }
  }
  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging.value || !enabled()) return
    const dx = event.clientX - dragStart.x
    const dy = event.clientY - dragStart.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag.value = true
    setState(
      clampTranslate(
        {
          ...state,
          translateX: translateStart.x + dx,
          translateY: translateStart.y + dy,
        },
        imageRef.value,
      ),
    )
  }
  const handlePointerUp = () => {
    isDragging.value = false
  }
  const handlePointerCancel = () => {
    isDragging.value = false
    didDrag.value = false
    lastPinchDistance.value = null
  }
  const handleTouchMove = (event: TouchEvent) => {
    if (!enabled() || event.touches.length !== 2) {
      lastPinchDistance.value = null
      return
    }

    const [touch1, touch2] = event.touches
    const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY)
    if (lastPinchDistance.value !== null) {
      beginAdjust()
      zoomAtPoint(
        (distance - lastPinchDistance.value) * 0.01,
        (touch1.clientX + touch2.clientX) / 2,
        (touch1.clientY + touch2.clientY) / 2,
      )
    }
    lastPinchDistance.value = distance
  }
  const handleTouchEnd = () => {
    lastPinchDistance.value = null
  }
  const handleClick = (event: MouseEvent) => {
    if (!enabled() || event.detail > 1) return
    if (didDrag.value) {
      didDrag.value = false
      return
    }

    const pointerType = lastPointerType.value
    lastPointerType.value = 'mouse'
    lastClickPointerType.value = pointerType
    if (pointerType !== 'touch') toggleZoom()
  }
  const handleDoubleClick = () => {
    if (enabled() && lastClickPointerType.value === 'touch') toggleZoom()
  }

  const imageStyle = computed<CSSProperties>(() => ({
    transform: `scale(${state.scale}) translate(${state.translateX / state.scale}px, ${state.translateY / state.scale}px)`,
  }))
  const publicState = computed(() => ({ scale: state.scale, isZoomed: state.isZoomed }))
  const getImageProps = () => ({
    ref: setImageRef,
    style: imageStyle.value,
    'data-zoom-enabled': enabled() || undefined,
    'data-zoomed': state.isZoomed || undefined,
    'data-dragging': isDragging.value || isAdjusting.value || undefined,
    onPointerdown: handlePointerDown,
    onPointermove: handlePointerMove,
    onPointerup: handlePointerUp,
    onPointercancel: handlePointerCancel,
    onLostpointercapture: handlePointerUp,
    onClick: handleClick,
    onDblclick: handleDoubleClick,
    onTouchmove: handleTouchMove,
    onTouchend: handleTouchEnd,
  })

  watch([currentIndex, enabled], ([, isEnabled]) => {
    if (!isEnabled || state.isZoomed) resetZoom()
    if (!isEnabled) {
      lastPinchDistance.value = null
      didDrag.value = false
    }
  })

  onBeforeUnmount(() => {
    window.clearTimeout(adjustTimeout)
    imageRef.value?.removeEventListener('wheel', handleWheel)
  })

  return { zoomState: publicState, toggleZoom, resetZoom, panZoom, getImageProps }
}
