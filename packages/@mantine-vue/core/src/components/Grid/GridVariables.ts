import { defineComponent, h, type PropType } from 'vue'
import {
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  getSpacing,
  InlineStyles,
  keys,
  useMantineTheme,
} from '../../core'
import type { GridBreakpoints } from './Grid.context'

type StyleProp<T> = T | Partial<Record<string, T>>

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const GridVariables = defineComponent({
  name: 'GridVariables',
  props: {
    selector: { type: String, required: true },
    gap: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    rowGap: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    columnGap: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    breakpoints: { type: Object as PropType<GridBreakpoints>, default: undefined },
    type: { type: String as PropType<'container' | 'media'>, default: undefined },
  },
  setup(props) {
    const theme = useMantineTheme()

    return () => {
      const breakpoints = props.breakpoints || theme.value.breakpoints
      const baseStyles = filterProps({
        '--grid-gap': getSpacing(getBaseValue(props.gap)),
        '--grid-row-gap': getSpacing(getBaseValue(props.rowGap)),
        '--grid-column-gap': getSpacing(getBaseValue(props.columnGap)),
      })
      const queries = keys(breakpoints).reduce<Record<string, Record<string, any>>>(
        (acc, breakpoint) => {
          acc[breakpoint] = {}

          if (isObject(props.gap) && props.gap[breakpoint] !== undefined) {
            acc[breakpoint]['--grid-gap'] = getSpacing(props.gap[breakpoint])
          }

          if (isObject(props.rowGap) && props.rowGap[breakpoint] !== undefined) {
            acc[breakpoint]['--grid-row-gap'] = getSpacing(props.rowGap[breakpoint])
          }

          if (isObject(props.columnGap) && props.columnGap[breakpoint] !== undefined) {
            acc[breakpoint]['--grid-column-gap'] = getSpacing(props.columnGap[breakpoint])
          }

          return acc
        },
        {},
      )
      const values = getSortedBreakpoints(breakpoints).reduce<Record<string, Record<string, any>>>(
        (acc, item) => {
          if (keys(queries[item.breakpoint] ?? {}).length > 0) {
            const query =
              props.type === 'container'
                ? `mantine-grid (min-width: ${breakpoints[item.breakpoint]})`
                : `(min-width: ${breakpoints[item.breakpoint]})`
            acc[query] = queries[item.breakpoint]
          }

          return acc
        },
        {},
      )

      return h(InlineStyles, {
        selector: props.selector,
        styles: baseStyles,
        media: props.type === 'container' ? undefined : values,
        container: props.type === 'container' ? values : undefined,
      })
    }
  },
})
