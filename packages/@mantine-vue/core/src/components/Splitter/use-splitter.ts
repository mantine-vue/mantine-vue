import { computed, onBeforeUnmount, ref, shallowRef, watch, type ComputedRef } from 'vue'

export interface UseSplitterPanel {
  defaultSize: number
  min?: number
  max?: number
  collapsible?: boolean
  collapseThreshold?: number
}

export interface UseSplitterRedistributeInput {
  sizes: number[]
  panels: UseSplitterPanel[]
  handleIndex: number
  delta: number
}

export type UseSplitterRedistributeFn = (input: UseSplitterRedistributeInput) => number[]
export type SplitterOrientation = 'horizontal' | 'vertical'

export interface UseSplitterOptions {
  panels: ComputedRef<UseSplitterPanel[]>
  orientation: () => SplitterOrientation
  sizes: () => number[] | undefined
  onSizeChange: (sizes: number[]) => void
  onResizeStart?: (handleIndex: number) => void
  onResizeEnd?: (handleIndex: number, sizes: number[]) => void
  onCollapseChange?: (panelIndex: number, collapsed: boolean) => void
  redistribute: () => 'nearest' | 'equal' | UseSplitterRedistributeFn | undefined
  step: () => number
  shiftStep: () => number
  dir: () => 'ltr' | 'rtl'
  resetOnDoubleClick: () => boolean
}

export interface UseSplitterReturnValue {
  readonly sizes: number[]
  readonly collapsed: boolean[]
  readonly activeHandle: number
  setContainer: (node: any) => void
  getHandleProps: (index: number) => Record<string, any>
  setSizes: (sizes: number[]) => void
  collapse: (panelIndex: number) => void
  expand: (panelIndex: number) => void
  toggleCollapse: (panelIndex: number) => void
  reset: (handleIndex: number) => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const getMin = (panel: UseSplitterPanel) => panel?.min ?? 0
const getMax = (panel: UseSplitterPanel) => panel?.max ?? 100
const getCollapseThreshold = (panel: UseSplitterPanel) => panel.collapseThreshold ?? getMin(panel)

function checkCollapse(
  sizes: number[],
  panels: UseSplitterPanel[],
  handleIndex: number,
  delta: number,
) {
  const before = panels[handleIndex]
  const after = panels[handleIndex + 1]
  const rawBefore = sizes[handleIndex] + delta
  const rawAfter = sizes[handleIndex + 1] - delta

  if (
    before.collapsible &&
    rawBefore < getCollapseThreshold(before) &&
    rawBefore < sizes[handleIndex]
  ) {
    const result = [...sizes]
    result[handleIndex + 1] += result[handleIndex]
    result[handleIndex] = 0
    return result
  }

  if (
    after.collapsible &&
    rawAfter < getCollapseThreshold(after) &&
    rawAfter < sizes[handleIndex + 1]
  ) {
    const result = [...sizes]
    result[handleIndex] += result[handleIndex + 1]
    result[handleIndex + 1] = 0
    return result
  }

  return null
}

function applyAdjacentOnly(
  sizes: number[],
  panels: UseSplitterPanel[],
  handleIndex: number,
  delta: number,
) {
  const result = [...sizes]
  const total = result[handleIndex] + result[handleIndex + 1]
  const maximum = Math.min(getMax(panels[handleIndex]), total - getMin(panels[handleIndex + 1]))
  const minimum = Math.max(getMin(panels[handleIndex]), total - getMax(panels[handleIndex + 1]))
  result[handleIndex] = clamp(result[handleIndex] + delta, minimum, maximum)
  result[handleIndex + 1] = total - result[handleIndex]
  return result
}

function redistributeNearest(
  sizes: number[],
  panels: UseSplitterPanel[],
  handleIndex: number,
  delta: number,
) {
  const result = [...sizes]
  const growIndex = delta > 0 ? handleIndex : handleIndex + 1
  const wanted = Math.min(Math.abs(delta), getMax(panels[growIndex]) - result[growIndex])
  let taken = 0
  const start = delta > 0 ? handleIndex + 1 : handleIndex
  const end = delta > 0 ? result.length : -1
  const increment = delta > 0 ? 1 : -1

  for (let index = start; index !== end && taken < wanted; index += increment) {
    const amount = Math.min(result[index] - getMin(panels[index]), wanted - taken)
    result[index] -= amount
    taken += amount
  }

  result[growIndex] += taken
  return result
}

function redistributeEqual(
  sizes: number[],
  panels: UseSplitterPanel[],
  handleIndex: number,
  delta: number,
) {
  const result = [...sizes]
  const growIndex = delta > 0 ? handleIndex : handleIndex + 1
  const wanted = Math.min(Math.abs(delta), getMax(panels[growIndex]) - result[growIndex])
  const donors = result
    .map((size, index) => ({ size, index }))
    .filter(({ size, index }) =>
      delta > 0
        ? index > handleIndex && size > getMin(panels[index])
        : index <= handleIndex && size > getMin(panels[index]),
    )
    .map(({ index }) => index)
  let remaining = wanted

  while (remaining > 0.001 && donors.length) {
    const perDonor = remaining / donors.length
    const exhausted: number[] = []
    donors.forEach((index, donorIndex) => {
      const available = result[index] - getMin(panels[index])
      const amount = Math.min(available, perDonor)
      result[index] -= amount
      remaining -= amount
      if (available <= perDonor + 0.001) exhausted.push(donorIndex)
    })
    exhausted.reverse().forEach((index) => donors.splice(index, 1))
    if (!exhausted.length) break
  }

  result[growIndex] += wanted - remaining
  return result
}

function applyConstraints(
  sizes: number[],
  panels: UseSplitterPanel[],
  handleIndex: number,
  delta: number,
  redistribute?: 'nearest' | 'equal' | UseSplitterRedistributeFn,
) {
  if (typeof redistribute === 'function') {
    return redistribute({ sizes: [...sizes], panels, handleIndex, delta })
  }

  if (redistribute) {
    const result =
      redistribute === 'nearest'
        ? redistributeNearest(sizes, panels, handleIndex, delta)
        : redistributeEqual(sizes, panels, handleIndex, delta)
    const before = panels[handleIndex]
    const after = panels[handleIndex + 1]
    if (
      before.collapsible &&
      result[handleIndex] < getCollapseThreshold(before) &&
      result[handleIndex] < sizes[handleIndex]
    ) {
      result[handleIndex + 1] += result[handleIndex]
      result[handleIndex] = 0
    } else if (
      after.collapsible &&
      result[handleIndex + 1] < getCollapseThreshold(after) &&
      result[handleIndex + 1] < sizes[handleIndex + 1]
    ) {
      result[handleIndex] += result[handleIndex + 1]
      result[handleIndex + 1] = 0
    }
    return result
  }

  return (
    checkCollapse(sizes, panels, handleIndex, delta) ??
    applyAdjacentOnly(sizes, panels, handleIndex, delta)
  )
}

export function useSplitter(options: UseSplitterOptions): UseSplitterReturnValue {
  const initialSizes = options.panels.value.map((panel) => panel.defaultSize)
  const uncontrolledSizes = ref(initialSizes)
  const currentSizes = computed(() => options.sizes() ?? uncontrolledSizes.value)
  const activeHandle = ref(-1)
  const container = shallowRef<HTMLElement | null>(null)
  const preCollapseSizes = ref([...initialSizes])
  let liveSizes = [...currentSizes.value]
  let documentController: AbortController | null = null
  let frame = 0
  const handleControllers = new Map<number, AbortController>()
  const drag = {
    active: false,
    handleIndex: -1,
    startPointer: 0,
    containerSize: 0,
    startSizes: [] as number[],
  }

  watch(
    currentSizes,
    (value) => {
      liveSizes = [...value]
    },
    { deep: true },
  )
  watch(options.panels, (panels, previousPanels) => {
    if (options.sizes() !== undefined || panels.length === previousPanels.length) return
    const next = panels.map((panel, index) => uncontrolledSizes.value[index] ?? panel.defaultSize)
    uncontrolledSizes.value = next
    preCollapseSizes.value = [...next]
    liveSizes = [...next]
  })

  const updateSizes = (sizes: number[]) => {
    liveSizes = [...sizes]
    if (options.sizes() === undefined) uncontrolledSizes.value = sizes
    options.onSizeChange(sizes)
  }

  const emitCollapseTransitions = (
    previous: number[],
    next: number[],
    indices: number[],
    snapshot: number[],
  ) => {
    indices.forEach((index) => {
      if (previous[index] !== 0 && next[index] === 0) {
        preCollapseSizes.value = [...snapshot]
        options.onCollapseChange?.(index, true)
      } else if (previous[index] === 0 && next[index] !== 0) {
        options.onCollapseChange?.(index, false)
      }
    })
  }

  const collapse = (panelIndex: number) => {
    const panels = options.panels.value
    if (!panels[panelIndex]?.collapsible || liveSizes[panelIndex] === 0) return
    preCollapseSizes.value = [...liveSizes]
    const next = [...liveSizes]
    const neighbor = panelIndex === 0 ? 1 : panelIndex - 1
    next[neighbor] += next[panelIndex]
    next[panelIndex] = 0
    updateSizes(next)
    options.onCollapseChange?.(panelIndex, true)
  }

  const expand = (panelIndex: number) => {
    const panels = options.panels.value
    if (!panels[panelIndex]?.collapsible || liveSizes[panelIndex] !== 0) return
    const neighbor = panelIndex === 0 ? 1 : panelIndex - 1
    const restore = preCollapseSizes.value[panelIndex] || panels[panelIndex].defaultSize
    const actual = Math.min(restore, Math.max(0, liveSizes[neighbor] - getMin(panels[neighbor])))
    if (actual <= 0) return
    const next = [...liveSizes]
    next[panelIndex] = actual
    next[neighbor] -= actual
    updateSizes(next)
    options.onCollapseChange?.(panelIndex, false)
  }

  const toggleCollapse = (panelIndex: number) =>
    liveSizes[panelIndex] === 0 ? expand(panelIndex) : collapse(panelIndex)

  const reset = (handleIndex: number) => {
    const panels = options.panels.value
    if (handleIndex < 0 || handleIndex + 1 >= liveSizes.length) return
    const total = liveSizes[handleIndex] + liveSizes[handleIndex + 1]
    const defaultsTotal = panels[handleIndex].defaultSize + panels[handleIndex + 1].defaultSize
    const target =
      defaultsTotal === 0 ? total / 2 : (total * panels[handleIndex].defaultSize) / defaultsTotal
    const previous = [...liveSizes]
    const next = applyAdjacentOnly(previous, panels, handleIndex, target - previous[handleIndex])
    emitCollapseTransitions(previous, next, [handleIndex, handleIndex + 1], previous)
    updateSizes(next)
  }

  const finishDrag = (event: PointerEvent) => {
    if (!drag.active) return
    cancelAnimationFrame(frame)
    flushResize(event)
    drag.active = false
    const index = drag.handleIndex
    drag.handleIndex = -1
    activeHandle.value = -1
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
    document.body.style.cursor = ''
    documentController?.abort()
    documentController = null
    options.onResizeEnd?.(index, [...liveSizes])
  }

  const flushResize = (event: PointerEvent) => {
    if (!drag.containerSize) return
    const horizontal = options.orientation() === 'horizontal'
    const pointer = horizontal ? event.clientX : event.clientY
    const pixelDelta = pointer - drag.startPointer
    const percentDelta =
      ((horizontal && options.dir() === 'rtl' ? -pixelDelta : pixelDelta) / drag.containerSize) *
      100
    const previous = [...liveSizes]
    const next = applyConstraints(
      drag.startSizes,
      options.panels.value,
      drag.handleIndex,
      percentDelta,
      options.redistribute(),
    )
    emitCollapseTransitions(
      previous,
      next,
      [drag.handleIndex, drag.handleIndex + 1],
      drag.startSizes,
    )
    updateSizes(next)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!drag.active) return
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => flushResize(event))
  }

  const setHandle = (handleIndex: number, node: any) => {
    handleControllers.get(handleIndex)?.abort()
    handleControllers.delete(handleIndex)
    const element = (node?.$el ?? node) as HTMLElement | null
    if (!element) return
    const controller = new AbortController()
    handleControllers.set(handleIndex, controller)
    element.addEventListener(
      'pointerdown',
      (event) => {
        if (event.button !== 0 || !container.value) return
        const horizontal = options.orientation() === 'horizontal'
        const rect = container.value.getBoundingClientRect()
        drag.active = true
        drag.handleIndex = handleIndex
        drag.startPointer = horizontal ? event.clientX : event.clientY
        drag.containerSize = horizontal ? rect.width : rect.height
        drag.startSizes = [...liveSizes]
        activeHandle.value = handleIndex
        document.body.style.userSelect = 'none'
        document.body.style.webkitUserSelect = 'none'
        document.body.style.cursor = horizontal ? 'col-resize' : 'row-resize'
        options.onResizeStart?.(handleIndex)
        documentController?.abort()
        documentController = new AbortController()
        const signal = documentController.signal
        document.addEventListener('pointermove', onPointerMove, { signal })
        document.addEventListener('pointerup', finishDrag, { signal })
        document.addEventListener('pointercancel', finishDrag, { signal })
      },
      { signal: controller.signal },
    )
  }

  const onKeydown = (event: KeyboardEvent, index: number) => {
    const horizontal = options.orientation() === 'horizontal'
    const rtl = options.dir() === 'rtl'
    const step = event.shiftKey ? options.shiftStep() : options.step()
    const panels = options.panels.value
    let delta = 0

    if (event.key === 'ArrowLeft' && horizontal) delta = rtl ? step : -step
    else if (event.key === 'ArrowRight' && horizontal) delta = rtl ? -step : step
    else if (event.key === 'ArrowUp' && !horizontal) delta = -step
    else if (event.key === 'ArrowDown' && !horizontal) delta = step
    else if (event.key === 'Home') delta = -(liveSizes[index] - getMin(panels[index]))
    else if (event.key === 'End') delta = getMax(panels[index]) - liveSizes[index]
    else if (event.key === 'Enter') {
      if (panels[index].collapsible && liveSizes[index] <= liveSizes[index + 1])
        toggleCollapse(index)
      else if (panels[index + 1].collapsible) toggleCollapse(index + 1)
      else if (panels[index].collapsible) toggleCollapse(index)
      else return
      event.preventDefault()
      return
    } else return

    event.preventDefault()
    if (delta) {
      const previous = [...liveSizes]
      const next = applyConstraints(previous, panels, index, delta, options.redistribute())
      emitCollapseTransitions(previous, next, [index, index + 1], previous)
      updateSizes(next)
    }
  }

  onBeforeUnmount(() => {
    documentController?.abort()
    handleControllers.forEach((controller) => controller.abort())
    cancelAnimationFrame(frame)
    if (drag.active) {
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.cursor = ''
    }
  })

  return {
    get sizes() {
      return currentSizes.value
    },
    get collapsed() {
      return currentSizes.value.map((size) => size === 0)
    },
    get activeHandle() {
      return activeHandle.value
    },
    setContainer: (node) => {
      container.value = node?.$el ?? node ?? null
    },
    getHandleProps: (index) => ({
      ref: (node: any) => setHandle(index, node),
      role: 'separator',
      'aria-orientation': options.orientation(),
      'aria-valuenow': Math.round(currentSizes.value[index] ?? 0),
      'aria-valuemin': Math.round(getMin(options.panels.value[index])),
      'aria-valuemax': Math.round(getMax(options.panels.value[index])),
      tabindex: 0,
      onKeydown: (event: KeyboardEvent) => onKeydown(event, index),
      onDblclick: () => options.resetOnDoubleClick() && reset(index),
      'data-active': activeHandle.value === index || undefined,
      'data-orientation': options.orientation(),
    }),
    setSizes: updateSizes,
    collapse,
    expand,
    toggleCollapse,
    reset,
  }
}
