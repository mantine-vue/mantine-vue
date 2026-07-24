import { defineComponent, h, type PropType } from 'vue'
import {
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  InlineStyles,
  keys,
  useMantineTheme,
  type AlignItems,
  type StyleProp,
} from '../../../core'
import { useGridContext } from '../Grid.context'

export type ColSpan = number | 'auto' | 'content'
function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const getColumnFlexBasis = (span: ColSpan | undefined, columns: number) => {
  if (span === 'content') {
    return 'auto'
  }

  if (span === 'auto') {
    return '0rem'
  }

  if (!span) {
    return undefined
  }

  if (span === columns) {
    return '100%'
  }

  const percentage = (100 * span) / columns
  const gapFactor = (columns - span) / columns
  return `calc(${percentage}% - ${gapFactor} * var(--grid-column-gap))`
}

const getColumnMaxWidth = (span: ColSpan | undefined, columns: number, grow?: boolean) => {
  if (grow || span === 'auto') {
    return '100%'
  }

  if (span === 'content') {
    return 'unset'
  }

  return getColumnFlexBasis(span, columns)
}

const getColumnFlexGrow = (span: ColSpan | undefined, grow?: boolean) => {
  if (!span) {
    return undefined
  }

  return span === 'auto' || grow ? '1' : 'auto'
}

const getColumnOffset = (offset: number | undefined, columns: number) => {
  if (offset === 0) {
    return '0'
  }

  if (!offset) {
    return undefined
  }

  const percentage = (100 * offset) / columns
  const gapFactor = offset / columns
  return `calc(${percentage}% + ${gapFactor} * var(--grid-column-gap))`
}

export const GridColVariables = defineComponent({
  name: 'GridColVariables',
  props: {
    selector: { type: String, required: true },
    span: { type: [Number, String, Object] as PropType<StyleProp<ColSpan>>, default: undefined },
    order: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
    offset: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
    align: { type: [String, Object] as PropType<StyleProp<AlignItems>>, default: undefined },
  },
  setup(props) {
    const theme = useMantineTheme()
    const ctx = useGridContext()

    return () => {
      const breakpoints = ctx.breakpoints || theme.value.breakpoints
      const baseSpan = (getBaseValue(props.span) ?? 12) as ColSpan
      const baseOrder = getBaseValue(props.order as any) as number | undefined
      const baseOffset = getBaseValue(props.offset as any) as number | undefined
      const baseAlign = getBaseValue(props.align as any) as string | undefined
      const baseStyles = filterProps({
        '--col-order': baseOrder?.toString(),
        '--col-flex-grow': getColumnFlexGrow(baseSpan, ctx.grow),
        '--col-flex-basis': getColumnFlexBasis(baseSpan, ctx.columns),
        '--col-width': baseSpan === 'content' ? 'auto' : undefined,
        '--col-max-width': getColumnMaxWidth(baseSpan, ctx.columns, ctx.grow),
        '--col-offset': getColumnOffset(baseOffset, ctx.columns),
        '--col-align-self': baseAlign,
      })
      const queries = keys(breakpoints).reduce<Record<string, Record<string, any>>>(
        (acc, breakpoint) => {
          acc[breakpoint] = {}

          if (isObject(props.order) && props.order[breakpoint] !== undefined) {
            acc[breakpoint]['--col-order'] = props.order[breakpoint]?.toString()
          }

          if (isObject(props.span) && props.span[breakpoint] !== undefined) {
            const span = props.span[breakpoint] as ColSpan
            acc[breakpoint]['--col-flex-grow'] = getColumnFlexGrow(span, ctx.grow)
            acc[breakpoint]['--col-flex-basis'] = getColumnFlexBasis(span, ctx.columns)
            acc[breakpoint]['--col-width'] = span === 'content' ? 'auto' : undefined
            acc[breakpoint]['--col-max-width'] = getColumnMaxWidth(span, ctx.columns, ctx.grow)
          }

          if (isObject(props.offset) && props.offset[breakpoint] !== undefined) {
            acc[breakpoint]['--col-offset'] = getColumnOffset(props.offset[breakpoint], ctx.columns)
          }

          const responsiveAlign = isObject(props.align)
            ? (props.align as Record<string, AlignItems>)[breakpoint]
            : undefined
          if (responsiveAlign !== undefined) {
            acc[breakpoint]['--col-align-self'] = responsiveAlign
          }

          return acc
        },
        {},
      )
      const values = getSortedBreakpoints(breakpoints).reduce<Record<string, Record<string, any>>>(
        (acc, item) => {
          if (keys(queries[item.breakpoint] ?? {}).length > 0) {
            const query =
              ctx.type === 'container'
                ? `mantine-grid (min-width: ${breakpoints[item.breakpoint]})`
                : `(min-width: ${breakpoints[item.breakpoint]})`
            acc[query] = queries[item.breakpoint]
          }

          return acc
        },
        {},
      )

      return h(InlineStyles as any, {
        selector: props.selector,
        styles: baseStyles,
        media: ctx.type === 'container' ? undefined : values,
        container: ctx.type === 'container' ? values : undefined,
      })
    }
  },
})
