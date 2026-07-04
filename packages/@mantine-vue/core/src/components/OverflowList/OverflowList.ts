import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  ref,
  watch,
  type PropType,
  type VNode,
} from 'vue'
import { withBoxProps, Box, createVarsResolver, getSpacing, useProps, useStyles } from '../../core'
import { getRowPositionsData } from './get-row-position-data'
import { useDimensions } from './use-dimensions'
import classes from './OverflowList.module.css'

export type OverflowListStylesNames = 'root'

const defaultProps = { maxRows: 1, maxVisibleItems: Infinity } as const
const varsResolver = createVarsResolver<any>((_, { gap }) => ({
  root: { '--ol-gap': getSpacing(gap) },
}))

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

function getEl(value: any): HTMLElement | null {
  if (!value) return null
  return (value.$el ?? value) as HTMLElement | null
}

export const OverflowList = withBoxProps(
  defineComponent({
    name: 'OverflowList',
    inheritAttrs: false,
    props: {
      data: { type: Array as PropType<any[]>, required: true },
      renderItem: { type: Function as PropType<(item: any, index: number) => any>, required: true },
      renderOverflow: { type: Function as PropType<(items: any[]) => any>, required: true },
      maxRows: { type: Number, default: undefined },
      maxVisibleItems: { type: Number, default: undefined },
      gap: { type: [String, Number] as PropType<string | number>, default: undefined },
      collapseFrom: { type: String as PropType<'start' | 'end'>, default: 'end' },
      getItemKey: {
        type: Function as PropType<(item: any, index: number) => PropertyKey>,
        default: undefined,
      },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, expose }) {
      const props = useProps('OverflowList', defaultProps, rawProps)

      const rootRef = ref<any>(null)
      const overflowRef = ref<any>(null)

      const visibleCount = ref(props.data.length)
      const subtractCount = ref(0)
      const phase = ref<'normal' | 'measuring' | 'measuring-overflow-indicator'>('normal')

      const dimensions = useDimensions(rootRef)

      const maxRows = computed(() => props.maxRows ?? defaultProps.maxRows)
      const maxVisibleItems = computed(() => props.maxVisibleItems ?? defaultProps.maxVisibleItems)
      const finalVisibleCount = computed(() =>
        Math.max(0, visibleCount.value - subtractCount.value),
      )
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

      expose({ root: rootRef })

      function fitsInRows(
        widths: number[],
        containerWidth: number,
        columnGap: number,
        startIndex = 0,
      ) {
        let rows = 1
        let rowWidth = 0
        for (let index = startIndex; index < widths.length; index += 1) {
          const width = widths[index]
          const needed = rowWidth > 0 ? width + columnGap : width
          if (rowWidth + needed > containerWidth && rowWidth > 0) {
            rows += 1
            if (rows > maxRows.value) return false
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
        if (!rowData || !container) return

        if (isCollapseStart.value) {
          const containerWidth = container.getBoundingClientRect().width
          const gap = parseFloat(getComputedStyle(container).columnGap) || 0
          const widths = rowData.children.map((child) => child.getBoundingClientRect().width)
          let count = 0
          for (let index = widths.length - 1; index >= 0; index -= 1) {
            if (!fitsInRows(widths, containerWidth, gap, index)) break
            count = widths.length - index
          }
          visibleCount.value = Math.min(count, maxVisibleItems.value)
          return
        }

        if (props.data.length === 1) {
          const item = rowData.itemsSizesMap[rowData.rowPositions[0]].elements.values().next().value
          visibleCount.value =
            (item?.getBoundingClientRect().width ?? 0) > container.getBoundingClientRect().width
              ? 0
              : 1
          return
        }

        visibleCount.value = Math.min(
          rowData.rowPositions
            .slice(0, maxRows.value)
            .reduce((count, position) => count + rowData.itemsSizesMap[position].elements.size, 0),
          maxVisibleItems.value,
        )
      }

      function updateOverflowIndicator() {
        const container = getEl(rootRef.value)
        const overflow = getEl(overflowRef.value)
        if (!overflow || !container) return false
        const rowData = getRowPositionsData(container, overflow)
        if (!rowData) return false

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
        if (token !== measureToken) return
        countVisibleItems()
        phase.value = 'measuring-overflow-indicator'
        await nextTick()
        if (token !== measureToken) return
        while (updateOverflowIndicator()) {
          await nextTick()
          if (token !== measureToken) return
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

      return () => {
        const finalItems = isCollapseStart.value
          ? props.data.slice(-maxVisibleItems.value)
          : props.data.slice(0, maxVisibleItems.value)
        const indexOffset = isCollapseStart.value ? props.data.length - finalItems.length : 0
        const overflowItems = isCollapseStart.value
          ? props.data.slice(0, props.data.length - finalVisibleCount.value)
          : props.data.slice(finalVisibleCount.value)
        const showOverflow = overflowItems.length > 0 && phase.value !== 'measuring'
        const overflowNode = showOverflow ? props.renderOverflow(overflowItems) : null

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
          return visible ? props.renderItem(item, indexOffset + index) : null
        })

        return h(
          Box,
          {
            ...attrs,
            ref: rootRef,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () =>
            isCollapseStart.value ? [renderedOverflow, ...items] : [...items, renderedOverflow],
        )
      }
    },
  }),
)

Object.assign(OverflowList, { classes, varsResolver })
