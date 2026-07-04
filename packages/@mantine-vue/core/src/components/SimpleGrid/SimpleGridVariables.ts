import { defineComponent, h, type PropType } from 'vue'
import {
  filterProps,
  getBaseValue,
  getSpacing,
  getSortedBreakpoints,
  InlineStyles,
  keys,
  px,
  rem,
  useMantineTheme,
} from '../../core'

type StyleProp<T> = T | Partial<Record<string, T>>

function getMinColWidthValue(value: string | number | undefined): string | undefined {
  if (value === undefined) {
    return undefined
  }

  return typeof value === 'number' ? rem(value) : value
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const SimpleGridMediaVariables = defineComponent({
  name: 'SimpleGridMediaVariables',
  props: {
    selector: { type: String, required: true },
    cols: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
    spacing: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    verticalSpacing: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    minColWidth: [String, Number] as PropType<string | number>,
    autoRows: { type: String, default: undefined },
  },
  setup(props) {
    const theme = useMantineTheme()

    return () => {
      const verticalSpacing =
        props.verticalSpacing === undefined ? props.spacing : props.verticalSpacing
      const useAutoColumns = props.minColWidth !== undefined
      const baseStyles = filterProps({
        '--sg-spacing-x': getSpacing(getBaseValue(props.spacing)),
        '--sg-spacing-y': getSpacing(getBaseValue(verticalSpacing)),
        '--sg-auto-rows': props.autoRows,
        ...(useAutoColumns
          ? { '--sg-min-col-width': getMinColWidthValue(props.minColWidth) }
          : { '--sg-cols': getBaseValue(props.cols)?.toString() }),
      })

      const queries = keys(theme.value.breakpoints).reduce<Record<string, Record<string, any>>>(
        (acc, breakpoint) => {
          acc[breakpoint] = acc[breakpoint] ?? {}

          if (isObject(props.spacing) && props.spacing[breakpoint] !== undefined) {
            acc[breakpoint]['--sg-spacing-x'] = getSpacing(props.spacing[breakpoint])
          }

          if (isObject(verticalSpacing) && verticalSpacing[breakpoint] !== undefined) {
            acc[breakpoint]['--sg-spacing-y'] = getSpacing(verticalSpacing[breakpoint])
          }

          if (!useAutoColumns && isObject(props.cols) && props.cols[breakpoint] !== undefined) {
            acc[breakpoint]['--sg-cols'] = props.cols[breakpoint]
          }

          return acc
        },
        {},
      )

      const media = getSortedBreakpoints(theme.value.breakpoints).reduce<
        Record<string, Record<string, any>>
      >((acc, item) => {
        if (keys(queries[item.breakpoint] ?? {}).length > 0) {
          acc[`(min-width: ${theme.value.breakpoints[item.breakpoint]})`] = queries[item.breakpoint]
        }

        return acc
      }, {})

      return h(InlineStyles, { selector: props.selector, styles: baseStyles, media })
    }
  },
})

function getBreakpoints(values: unknown) {
  return isObject(values) ? keys(values).filter((breakpoint) => breakpoint !== 'base') : []
}

function sortBreakpoints(breakpoints: string[]) {
  return breakpoints.sort((a, b) => px(a) - px(b))
}

export const SimpleGridContainerVariables = defineComponent({
  name: 'SimpleGridContainerVariables',
  props: {
    selector: { type: String, required: true },
    cols: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
    spacing: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    verticalSpacing: {
      type: [String, Number, Object] as PropType<StyleProp<string | number>>,
      default: undefined,
    },
    minColWidth: [String, Number] as PropType<string | number>,
    autoRows: { type: String, default: undefined },
  },
  setup(props) {
    return () => {
      const verticalSpacing =
        props.verticalSpacing === undefined ? props.spacing : props.verticalSpacing
      const useAutoColumns = props.minColWidth !== undefined
      const baseStyles = filterProps({
        '--sg-spacing-x': getSpacing(getBaseValue(props.spacing)),
        '--sg-spacing-y': getSpacing(getBaseValue(verticalSpacing)),
        '--sg-auto-rows': props.autoRows,
        ...(useAutoColumns
          ? { '--sg-min-col-width': getMinColWidthValue(props.minColWidth) }
          : { '--sg-cols': getBaseValue(props.cols)?.toString() }),
      })
      const breakpoints = sortBreakpoints(
        Array.from(
          new Set([
            ...getBreakpoints(props.spacing),
            ...getBreakpoints(verticalSpacing),
            ...(useAutoColumns ? [] : getBreakpoints(props.cols)),
          ]),
        ),
      )

      const container = breakpoints.reduce<Record<string, Record<string, any>>>(
        (acc, breakpoint) => {
          acc[`simple-grid (min-width: ${breakpoint})`] = {}

          if (isObject(props.spacing) && props.spacing[breakpoint] !== undefined) {
            acc[`simple-grid (min-width: ${breakpoint})`]['--sg-spacing-x'] = getSpacing(
              props.spacing[breakpoint],
            )
          }

          if (isObject(verticalSpacing) && verticalSpacing[breakpoint] !== undefined) {
            acc[`simple-grid (min-width: ${breakpoint})`]['--sg-spacing-y'] = getSpacing(
              verticalSpacing[breakpoint],
            )
          }

          if (!useAutoColumns && isObject(props.cols) && props.cols[breakpoint] !== undefined) {
            acc[`simple-grid (min-width: ${breakpoint})`]['--sg-cols'] = props.cols[breakpoint]
          }

          return acc
        },
        {},
      )

      return h(InlineStyles, { selector: props.selector, styles: baseStyles, container })
    }
  },
})
