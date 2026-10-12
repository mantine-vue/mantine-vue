import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import { Box, rem, useDirection, useMantineTheme } from '../../../core'
import { useAppShellContext } from '../AppShell.context'
import type { AppShellResizeSection } from '../AppShell.types'
import { clampResizeSize, getCollapseState } from '../use-app-shell-resize/clamp-resize-size'
import { getResizeDelta, RESIZE_SECTIONS } from '../use-app-shell-resize/resize-section-config'

const LABELS: Record<AppShellResizeSection, string> = {
  navbar: 'Resize navbar',
  aside: 'Resize aside',
  header: 'Resize header',
  footer: 'Resize footer',
}

export const AppShellResizeHandle = defineComponent({
  name: 'AppShellResizeHandle',
  props: {
    section: { type: String as PropType<AppShellResizeSection>, required: true },
    sectionId: { type: String, required: true },
  },
  setup(props) {
    const ctx = useAppShellContext()
    const theme = useMantineTheme()
    const { dir } = useDirection()
    const handle = ref<Element | null>(null)
    const viewportPx = ref(0)
    const measuredSize = ref<number>()
    const drag = { startSize: 0, startX: 0, startY: 0, size: 0, moved: false }
    let activePointerId: number | null = null
    let abortController: AbortController | null = null
    let previousBodyStyles: {
      userSelect: string
      webkitUserSelect: string
      cursor: string
    } | null = null

    const config = () => RESIZE_SECTIONS[props.section]
    const options = () => ctx.resize?.options[props.section] ?? {}
    const element = () => handle.value as HTMLElement | null
    const getViewportPx = () =>
      config().axis === 'horizontal' ? window.innerWidth : window.innerHeight
    const getViewportMax = () => getViewportPx() / theme.value.scale
    const measureSectionSize = (sectionElement: HTMLElement) => {
      const rect = sectionElement.getBoundingClientRect()
      const rawSize = config().axis === 'horizontal' ? rect.width : rect.height
      const variable = config().safeAreaVariable
      const parsed = variable
        ? Number.parseFloat(window.getComputedStyle(sectionElement).getPropertyValue(variable))
        : 0
      return (rawSize - (Number.isFinite(parsed) ? parsed : 0)) / theme.value.scale
    }
    const getCurrentSize = () => {
      const size = ctx.resize?.[props.section].size
      if (size !== undefined) return size
      const parent = element()?.parentElement
      return parent ? measureSectionSize(parent) : 0
    }
    const applyPreview = (size: number) => {
      const root = ctx.rootRef.value as HTMLElement | null
      if (!root) return
      const value = rem(size)
      root.style.setProperty(config().sizeVariable, value)
      if (ctx.resizeOffsets[props.section]) root.style.setProperty(config().offsetVariable, value)
      if (ctx.mode === 'static' && config().gridWidthVariable)
        root.style.setProperty(config().gridWidthVariable!, value)
    }
    const clearPreview = () => {
      const root = ctx.rootRef.value as HTMLElement | null
      if (!root) return
      root.style.removeProperty(config().sizeVariable)
      root.style.removeProperty(config().offsetVariable)
      if (config().gridWidthVariable) root.style.removeProperty(config().gridWidthVariable!)
    }
    const restoreBodyStyle = (property: string, value: string) =>
      value
        ? document.body.style.setProperty(property, value)
        : document.body.style.removeProperty(property)
    const stopListeners = () => {
      abortController?.abort()
      abortController = null
      activePointerId = null
      if (previousBodyStyles) {
        restoreBodyStyle('user-select', previousBodyStyles.userSelect)
        restoreBodyStyle('-webkit-user-select', previousBodyStyles.webkitUserSelect)
        restoreBodyStyle('cursor', previousBodyStyles.cursor)
        previousBodyStyles = null
      }
    }
    const cancelResize = () => {
      ctx.resize?.reportCollapse(
        props.section,
        getCollapseState(drag.startSize, options().collapseThreshold),
      )
      ctx.resize?.endResize(props.section, null)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return
      drag.moved = true
      const delta =
        getResizeDelta({
          section: props.section,
          deltaX: event.clientX - drag.startX,
          deltaY: event.clientY - drag.startY,
          dir: dir.value,
        }) / theme.value.scale
      const rawSize = drag.startSize + delta
      const value = clampResizeSize({
        size: rawSize,
        min: options().min,
        max: options().max,
        viewportMax: getViewportMax(),
      })
      drag.size = value
      applyPreview(value)
      element()?.setAttribute('aria-valuenow', String(Math.round(value)))
      ctx.resize?.previewResize(props.section, value)
      ctx.resize?.reportCollapse(
        props.section,
        getCollapseState(rawSize, options().collapseThreshold),
      )
    }
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return
      stopListeners()
      ctx.resize?.endResize(props.section, drag.moved ? drag.size : null)
    }
    const onPointerCancel = (event: PointerEvent) => {
      if (event.pointerId !== activePointerId) return
      stopListeners()
      clearPreview()
      cancelResize()
    }
    const onDragKeydown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      stopListeners()
      clearPreview()
      element()?.setAttribute('aria-valuenow', String(Math.round(drag.startSize)))
      cancelResize()
    }
    const commitKeyboardSize = (size: number) => {
      ctx.resize?.initCollapse(
        props.section,
        getCollapseState(getCurrentSize(), options().collapseThreshold),
      )
      ctx.resize?.reportCollapse(props.section, getCollapseState(size, options().collapseThreshold))
      ctx.resize?.endResize(
        props.section,
        clampResizeSize({
          size,
          min: options().min,
          max: options().max,
          viewportMax: getViewportMax(),
        }),
      )
    }
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Home') {
        event.preventDefault()
        commitKeyboardSize(options().min ?? 0)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        commitKeyboardSize(options().max ?? getViewportMax())
        return
      }
      const deltas: Record<string, [number, number]> = {
        ArrowRight: [1, 0],
        ArrowLeft: [-1, 0],
        ArrowDown: [0, 1],
        ArrowUp: [0, -1],
      }
      const delta = deltas[event.key]
      if (!delta) return
      const direction = getResizeDelta({
        section: props.section,
        deltaX: delta[0],
        deltaY: delta[1],
        dir: dir.value,
      })
      if (direction === 0) return
      event.preventDefault()
      commitKeyboardSize(getCurrentSize() + direction * (event.shiftKey ? 50 : 10))
    }
    const onPointerdown = (event: PointerEvent) => {
      if (event.button !== 0 || abortController) return
      const parent = element()?.parentElement
      if (!parent) return
      const startSize = measureSectionSize(parent)
      Object.assign(drag, {
        startSize,
        startX: event.clientX,
        startY: event.clientY,
        size: startSize,
        moved: false,
      })
      activePointerId = event.pointerId
      ctx.resize?.initCollapse(
        props.section,
        getCollapseState(startSize, options().collapseThreshold),
      )
      abortController = new AbortController()
      const { signal } = abortController
      previousBodyStyles = {
        userSelect: document.body.style.getPropertyValue('user-select'),
        webkitUserSelect: document.body.style.getPropertyValue('-webkit-user-select'),
        cursor: document.body.style.getPropertyValue('cursor'),
      }
      document.body.style.setProperty('user-select', 'none')
      document.body.style.setProperty('-webkit-user-select', 'none')
      document.body.style.setProperty(
        'cursor',
        config().axis === 'horizontal' ? 'col-resize' : 'row-resize',
      )
      ctx.resize?.startResize(props.section)
      document.addEventListener('pointermove', onPointerMove, { signal })
      document.addEventListener('pointerup', onPointerUp, { signal })
      document.addEventListener('pointercancel', onPointerCancel, { signal })
      document.addEventListener('keydown', onDragKeydown, { signal })
    }
    const updateViewport = () => {
      viewportPx.value = getViewportPx()
      if (ctx.resize?.[props.section].size === undefined) measuredSize.value = getCurrentSize()
    }
    watch(
      () => [ctx.resize?.activeSection, ctx.resize?.[props.section].size],
      () => {
        if (ctx.resize?.activeSection !== props.section) clearPreview()
        updateViewport()
      },
    )
    onMounted(() => {
      updateViewport()
      window.addEventListener('resize', updateViewport)
    })
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateViewport)
      const wasDragging = abortController !== null
      stopListeners()
      clearPreview()
      if (wasDragging) cancelResize()
    })

    return () => {
      const controller = ctx.resize?.[props.section]
      if (!controller?.enabled) return null
      const viewportMax = viewportPx.value / theme.value.scale
      const effectiveMax = Math.min(options().max ?? viewportMax, viewportMax)
      const currentValue =
        controller.size !== undefined && viewportPx.value > 0
          ? Math.min(controller.size, viewportMax)
          : (controller.size ?? measuredSize.value)
      return h(Box, {
        rootRef: handle,
        role: 'separator',
        tabindex: 0,
        'aria-label': options().label ?? LABELS[props.section],
        'aria-controls': props.sectionId,
        'aria-orientation': config().orientation,
        'aria-valuemin': options().min ?? 0,
        'aria-valuemax': Math.round(effectiveMax),
        'aria-valuenow': currentValue === undefined ? undefined : Math.round(currentValue),
        onPointerdown,
        onKeydown,
        onDblclick: () => {
          clearPreview()
          controller.reset()
        },
        mod: {
          section: props.section,
          orientation: config().orientation,
          active: controller.active,
        },
        ...ctx.getStyles('resizeHandle'),
      })
    }
  },
})
