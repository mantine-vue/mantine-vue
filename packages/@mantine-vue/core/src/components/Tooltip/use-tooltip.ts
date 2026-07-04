import {
  arrow,
  autoUpdate,
  flip,
  inline,
  offset,
  shift,
  useFloating,
  type Middleware,
} from '@floating-ui/vue'
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import type { FloatingAxesOffsets, FloatingPosition, FloatingStrategy } from '../../utils/Floating'
import type { TooltipMiddlewares } from './Tooltip.types'
import { TooltipGroupKey } from './TooltipGroup/TooltipGroup'

export interface UseTooltipOptions {
  position: () => FloatingPosition
  opened: () => boolean | undefined
  defaultOpened: boolean
  openDelay?: () => number | undefined
  closeDelay?: () => number | undefined
  offset: () => number | FloatingAxesOffsets
  arrowOffset: () => number
  events: () => { hover: boolean; focus: boolean; touch: boolean }
  strategy: () => FloatingStrategy
  middlewares: () => TooltipMiddlewares | undefined
  onPositionChange?: (position: FloatingPosition) => void
}

export function useTooltip(options: UseTooltipOptions) {
  const group = inject(TooltipGroupKey, { withinGroup: false, openDelay: 0, closeDelay: 0 })
  const internal = ref(options.defaultOpened)
  const opened = computed(() => options.opened() ?? internal.value)
  const reference = ref<any>(null)
  const floating = ref<HTMLElement | null>(null)
  const arrowRef = ref<HTMLElement | null>(null)
  const middleware = computed<Middleware[]>(() => {
    const config = options.middlewares()
    const result: Middleware[] = [offset(options.offset())]
    if (config?.shift !== false)
      result.push(
        shift(typeof config?.shift === 'object' ? { padding: 8, ...config.shift } : { padding: 8 }),
      )
    if (config?.flip !== false)
      result.push(flip(typeof config?.flip === 'object' ? config.flip : {}))
    result.push(arrow({ element: arrowRef, padding: options.arrowOffset() }))
    if (config?.inline || config?.inline === undefined)
      result.push(inline(typeof config?.inline === 'object' ? config.inline : {}))
    return result
  })
  const state = useFloating(reference, floating, {
    open: opened,
    placement: computed(() => options.position()),
    strategy: computed(() => options.strategy()),
    middleware,
    whileElementsMounted: autoUpdate,
  })
  let openTimer: ReturnType<typeof setTimeout> | undefined
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  const clear = () => {
    clearTimeout(openTimer)
    clearTimeout(closeTimer)
  }
  const setOpened = (value: boolean, delay = 0) => {
    clear()
    const apply = () => {
      if (options.opened() === undefined) internal.value = value
    }
    if (delay > 0) {
      if (value) openTimer = setTimeout(apply, delay)
      else closeTimer = setTimeout(apply, delay)
    } else apply()
  }
  const open = () =>
    setOpened(true, group.withinGroup ? group.openDelay : (options.openDelay?.() ?? 0))
  const close = () =>
    setOpened(false, group.withinGroup ? group.closeDelay : (options.closeDelay?.() ?? 0))
  const previousPlacement = ref(state.placement.value)
  watch(state.placement, (value) => {
    if (value !== previousPlacement.value) {
      previousPlacement.value = value
      options.onPositionChange?.(value as FloatingPosition)
    }
  })
  onBeforeUnmount(clear)
  return {
    opened,
    reference,
    floating,
    arrowRef,
    x: state.x,
    y: state.y,
    placement: state.placement,
    arrowX: computed(() => state.middlewareData.value.arrow?.x),
    arrowY: computed(() => state.middlewareData.value.arrow?.y),
    open,
    close,
    setOpened,
  }
}
