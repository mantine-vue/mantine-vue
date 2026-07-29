import { defineComponent, h, onBeforeUnmount, onMounted, type PropType } from 'vue'
import { withBoxProps, Box } from '../../core'
import { useFloatingWindowContext } from './FloatingWindow.context'

const KEYBOARD_STEP = 10

function clampDimension(
  value: number,
  min: number | undefined,
  max: number | undefined,
  viewportMax: number | undefined,
) {
  let result = value
  if (min != null) result = Math.max(result, min)
  if (max != null) result = Math.min(result, max)
  if (viewportMax != null) result = Math.min(result, viewportMax)
  return result
}

export const FloatingWindowResizeHandle = withBoxProps(
  defineComponent({
    name: 'FloatingWindowResizeHandle',
    inheritAttrs: false,
    props: {
      ariaLabel: { type: String, default: 'Resize window' },
      tabindex: { type: Number, default: 0 },
      onKeydown: Function as PropType<(event: KeyboardEvent) => void>,
    },
    setup(props, { attrs, slots }) {
      const ctx = useFloatingWindowContext()
      let handle: HTMLElement | null = null
      let isResizing = false
      let startX = 0
      let startY = 0
      let startWidth = 0
      let startHeight = 0

      const hasWidth = () =>
        ctx.dimensions?.initialWidth != null ||
        ctx.dimensions?.minWidth != null ||
        ctx.dimensions?.maxWidth != null
      const hasHeight = () =>
        ctx.dimensions?.initialHeight != null ||
        ctx.dimensions?.minHeight != null ||
        ctx.dimensions?.maxHeight != null

      const applySize = (width: number | null, height: number | null) => {
        const root = ctx.rootRef.value
        if (!root || (width === null && height === null)) return

        const rect = root.getBoundingClientRect()
        const offset = ctx.constrainOffset ?? 0
        const maxViewportWidth = ctx.constrainToViewport
          ? window.innerWidth - rect.left - offset
          : undefined
        const maxViewportHeight = ctx.constrainToViewport
          ? window.innerHeight - rect.top - offset
          : undefined

        if (width !== null) {
          root.style.width = `${clampDimension(
            width,
            ctx.dimensions?.minWidth,
            ctx.dimensions?.maxWidth,
            maxViewportWidth,
          )}px`
        }
        if (height !== null) {
          root.style.height = `${clampDimension(
            height,
            ctx.dimensions?.minHeight,
            ctx.dimensions?.maxHeight,
            maxViewportHeight,
          )}px`
        }

        const resized = root.getBoundingClientRect()
        if (width !== null) {
          handle?.setAttribute('aria-valuenow', String(Math.round(resized.width)))
        }
        ctx.onSizeChange?.({ width: resized.width, height: resized.height })
      }

      const end = () => {
        if (!isResizing) return
        isResizing = false
        document.body.style.userSelect = ''
        document.body.style.webkitUserSelect = ''
        ctx.onResizeEnd?.()
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', end)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('touchend', end)
        document.removeEventListener('touchcancel', end)
      }

      const move = (event: MouseEvent | TouchEvent) => {
        if (!isResizing) return
        event.preventDefault()
        const point = 'touches' in event ? event.touches[0] : event
        applySize(
          hasWidth() ? startWidth + point.clientX - startX : null,
          hasHeight() ? startHeight + point.clientY - startY : null,
        )
      }

      const start = (event: MouseEvent | TouchEvent) => {
        if ('button' in event && event.button !== 0) return
        event.stopPropagation()
        event.preventDefault()
        if (!hasWidth() && !hasHeight()) return

        const root = ctx.rootRef.value
        if (!root) return
        const point = 'touches' in event ? event.touches[0] : event
        const rect = root.getBoundingClientRect()
        startX = point.clientX
        startY = point.clientY
        startWidth = rect.width
        startHeight = rect.height
        isResizing = true
        document.body.style.userSelect = 'none'
        document.body.style.webkitUserSelect = 'none'
        ctx.onResizeStart?.()
        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', end)
        document.addEventListener('touchmove', move, { passive: false })
        document.addEventListener('touchend', end)
        document.addEventListener('touchcancel', end)
      }

      const onKeydown = (event: KeyboardEvent) => {
        props.onKeydown?.(event)
        if (event.defaultPrevented) return
        const root = ctx.rootRef.value
        if (!root) return
        const rect = root.getBoundingClientRect()
        let width: number | null = null
        let height: number | null = null

        if (event.key === 'ArrowRight' && hasWidth()) width = rect.width + KEYBOARD_STEP
        else if (event.key === 'ArrowLeft' && hasWidth()) width = rect.width - KEYBOARD_STEP
        else if (event.key === 'ArrowDown' && hasHeight()) height = rect.height + KEYBOARD_STEP
        else if (event.key === 'ArrowUp' && hasHeight()) height = rect.height - KEYBOARD_STEP
        else if (event.key === 'Home') {
          if (hasWidth()) width = ctx.dimensions?.minWidth ?? rect.width
          if (hasHeight()) height = ctx.dimensions?.minHeight ?? rect.height
        } else if (event.key === 'End') {
          if (hasWidth()) width = ctx.dimensions?.maxWidth ?? rect.width
          if (hasHeight()) height = ctx.dimensions?.maxHeight ?? rect.height
        }

        if (width !== null || height !== null) {
          event.preventDefault()
          applySize(width, height)
        }
      }

      onMounted(() => {
        if (hasWidth() && ctx.dimensions?.initialWidth != null) {
          handle?.setAttribute(
            'aria-valuenow',
            String(
              Math.round(
                clampDimension(
                  ctx.dimensions.initialWidth,
                  ctx.dimensions.minWidth,
                  ctx.dimensions.maxWidth,
                  undefined,
                ),
              ),
            ),
          )
        }
      })
      onBeforeUnmount(end)

      return () =>
        h(
          Box,
          {
            ...attrs,
            ref: (node: any) => {
              handle = node?.$el ?? node
            },
            role: 'separator',
            'aria-label': (attrs as any)['aria-label'] ?? props.ariaLabel,
            'aria-valuemin': ctx.dimensions?.minWidth,
            'aria-valuemax': ctx.dimensions?.maxWidth,
            tabindex: props.tabindex,
            style: [{ touchAction: 'none' }, attrs.style],
            onMousedown: start,
            onTouchstart: start,
            onKeydown,
          },
          () => slots.default?.(),
        )
    },
  }),
)
