<script lang="ts">
import { createVarsResolver, getSpacing } from '../../core'

const defaultProps = { maxRows: 1, maxVisibleItems: Infinity } as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { gap }) => ({
  root: { '--ol-gap': getSpacing(gap) },
}))

/**
 * A cheap identity for the data array. Object items fall back to their index, so a
 * re-measure is only triggered when the shape of the list actually changes.
 */
function getDataSignature(data: any[], getItemKey?: (item: any, index: number) => PropertyKey) {
  return data
    .map((item, index) =>
      getItemKey
        ? getItemKey(item, index)
        : item !== null && (typeof item === 'object' || typeof item === 'function')
          ? index
          : String(item),
    )
    .join(' ')
}

/** Component refs resolve to instances, not elements; the measurements need the element. */
function getEl(value: any): HTMLElement | null {
  if (!value) {
    return null
  }

  return (value.$el ?? value) as HTMLElement | null
}

export { defaultProps, varsResolver, getDataSignature, getEl }
</script>

<script setup lang="ts">
import {
  cloneVNode,
  computed,
  nextTick,
  onMounted,
  ref,
  useAttrs,
  useSlots,
  watch,
  type VNode,
  type VNodeChild,
} from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { getRowPositionsData } from './get-row-position-data'
import { useDimensions } from './use-dimensions'
import type { OverflowListOwnProps, OverflowListSlots } from './OverflowList.types'
import classes from './OverflowList.module.css'

defineOptions({
  name: 'OverflowList',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<OverflowListOwnProps>(), {
  collapseFrom: 'end',
  unstyled: false,
})

defineSlots<OverflowListSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('OverflowList', defaultProps, rawProps)

const rootRef = ref<any>(null)
const overflowRef = ref<any>(null)

const visibleCount = ref(props.data.length)
const subtractCount = ref(0)

/**
 * Measuring needs every item rendered, so the list goes through two extra render passes
 * before settling back on `normal`.
 */
const phase = ref<'normal' | 'measuring' | 'measuring-overflow-indicator'>('normal')

const dimensions = useDimensions(rootRef)

const maxRows = computed(() => props.maxRows ?? defaultProps.maxRows)
const maxVisibleItems = computed(() => props.maxVisibleItems ?? defaultProps.maxVisibleItems)
const finalVisibleCount = computed(() => Math.max(0, visibleCount.value - subtractCount.value))
const isCollapseStart = computed(() => props.collapseFrom === 'start')

const getStyles = useStyles({
  name: 'OverflowList',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

defineExpose({ root: rootRef })

/** Lays the widths out row by row and reports whether they stay within `maxRows`. */
function fitsInRows(widths: number[], containerWidth: number, columnGap: number, startIndex = 0) {
  let rows = 1
  let rowWidth = 0

  for (let index = startIndex; index < widths.length; index += 1) {
    const width = widths[index]
    const needed = rowWidth > 0 ? width + columnGap : width

    if (rowWidth + needed > containerWidth && rowWidth > 0) {
      rows += 1

      if (rows > maxRows.value) {
        return false
      }

      rowWidth = width
    } else {
      rowWidth += needed
    }
  }

  return true
}

function countVisibleItems() {
  const container = getEl(rootRef.value)
  const overflow = getEl(overflowRef.value)
  const rowData = getRowPositionsData(container, overflow)

  if (!rowData || !container) {
    return
  }

  // Collapsing from the start means counting backwards from the last item.
  if (isCollapseStart.value) {
    const containerWidth = container.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(container).columnGap) || 0
    const widths = rowData.children.map((child) => child.getBoundingClientRect().width)
    let count = 0

    for (let index = widths.length - 1; index >= 0; index -= 1) {
      if (!fitsInRows(widths, containerWidth, gap, index)) {
        break
      }

      count = widths.length - index
    }

    visibleCount.value = Math.min(count, maxVisibleItems.value)
    return
  }

  // A single item has no row structure to measure, so it either fits or it does not.
  if (props.data.length === 1) {
    const item = rowData.itemsSizesMap[rowData.rowPositions[0]].elements.values().next().value
    visibleCount.value =
      (item?.getBoundingClientRect().width ?? 0) > container.getBoundingClientRect().width ? 0 : 1
    return
  }

  visibleCount.value = Math.min(
    rowData.rowPositions
      .slice(0, maxRows.value)
      .reduce((count, position) => count + rowData.itemsSizesMap[position].elements.size, 0),
    maxVisibleItems.value,
  )
}

/**
 * The indicator itself takes space, so adding it can push another item out. Returns
 * `true` when one more item had to be hidden, in which case it has to run again.
 */
function updateOverflowIndicator() {
  const container = getEl(rootRef.value)
  const overflow = getEl(overflowRef.value)

  if (!overflow || !container) {
    return false
  }

  const rowData = getRowPositionsData(container, overflow)

  if (!rowData) {
    return false
  }

  if (isCollapseStart.value) {
    const containerWidth = container.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(container).columnGap) || 0
    const widths = [
      overflow.getBoundingClientRect().width,
      ...rowData.children.map((child) => child.getBoundingClientRect().width),
    ]

    if (!fitsInRows(widths, containerWidth, gap)) {
      subtractCount.value += 1
      return true
    }

    return false
  }

  const rect = overflow.getBoundingClientRect()
  const lastRow = rowData.itemsSizesMap[rowData.rowPositions[rowData.rowPositions.length - 1]]

  // The indicator has wrapped past the last allowed row.
  if (rect.top + rect.height / 2 > lastRow.bottom) {
    subtractCount.value += 1
    return true
  }

  return false
}

// Cancellation token: each new measure() call increments this; stale async runs bail out
// when they detect a newer token, preventing races from rapid resizes or data changes.
let measureToken = 0

async function measure() {
  const token = ++measureToken
  phase.value = 'measuring'
  visibleCount.value = props.data.length
  subtractCount.value = 0
  await nextTick()

  if (token !== measureToken) {
    return
  }

  countVisibleItems()
  phase.value = 'measuring-overflow-indicator'
  await nextTick()

  if (token !== measureToken) {
    return
  }

  while (updateOverflowIndicator()) {
    await nextTick()

    if (token !== measureToken) {
      return
    }
  }

  phase.value = 'normal'
}

// Re-measure when data content/order, maxRows, or collapseFrom changes.
watch(
  () => [getDataSignature(props.data, props.getItemKey), props.maxRows, props.collapseFrom],
  measure,
  { flush: 'post' },
)

watch(dimensions, () => measure(), { flush: 'post' })

// Trigger the first measurement on mount. The data watch only fires on changes (not on
// initial render), and in test/SSR environments the ResizeObserver may never fire at all,
// so onMounted is the reliable initial trigger.
onMounted(() => measure())

const rootStyles = computed(() =>
  getStyles('root', { className: attrs.class, style: attrs.style as any }),
)

/**
 * Rendered through `<component :is>`: the items come from render props and the overflow
 * indicator has to be cloned so a ref can be attached for measuring it.
 */
const renderChildren = (): VNodeChild => {
  const finalItems = isCollapseStart.value
    ? props.data.slice(-maxVisibleItems.value)
    : props.data.slice(0, maxVisibleItems.value)
  const indexOffset = isCollapseStart.value ? props.data.length - finalItems.length : 0
  const overflowItems = isCollapseStart.value
    ? props.data.slice(0, props.data.length - finalVisibleCount.value)
    : props.data.slice(finalVisibleCount.value)

  // During the first pass everything is rendered, so the indicator must stay hidden.
  const showOverflow = overflowItems.length > 0 && phase.value !== 'measuring'
  const overflowNode = showOverflow
    ? (slots.overflow?.({ items: overflowItems }) ?? props.renderOverflow?.(overflowItems))
    : null

  // Attach overflowRef so updateOverflowIndicator() can measure the collapsed element.
  const renderedOverflow =
    overflowNode && typeof overflowNode === 'object'
      ? cloneVNode(overflowNode as VNode, { ref: overflowRef }, true)
      : overflowNode

  const items = finalItems.map((item, index) => {
    const visible =
      phase.value === 'measuring' ||
      (isCollapseStart.value
        ? index >= finalItems.length - finalVisibleCount.value
        : index < finalVisibleCount.value)

    if (!visible) {
      return null
    }

    const itemIndex = indexOffset + index
    return slots.item?.({ item, index: itemIndex }) ?? props.renderItem?.(item, itemIndex)
  })

  return isCollapseStart.value ? [renderedOverflow, ...items] : [...items, renderedOverflow]
}
</script>

<template>
  <Box ref="rootRef" v-bind="{ ...attrs, ...rootStyles }">
    <component :is="renderChildren" />
  </Box>
</template>
