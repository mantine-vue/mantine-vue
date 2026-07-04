import { defineComponent, h, type PropType } from 'vue'
import {
  filterProps,
  getBaseValue,
  getSortedBreakpoints,
  getSpacing,
  InlineStyles,
  keys,
  px,
  rem,
  useMantineTheme,
} from '@mantine-vue/core'

type StyleProp<T> = T | Partial<Record<string, T>>

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const sharedProps = {
  selector: { type: String, required: true },
  slideSize: {
    type: [String, Number, Object] as PropType<StyleProp<string | number>>,
    default: undefined,
  },
  slideGap: {
    type: [String, Number, Object] as PropType<StyleProp<string | number>>,
    default: undefined,
  },
}

export const CarouselVariables = defineComponent({
  name: 'CarouselVariables',
  props: sharedProps,
  setup(props) {
    const theme = useMantineTheme()

    return () => {
      const baseStyles = filterProps({
        '--carousel-slide-gap': getSpacing(getBaseValue(props.slideGap)),
        '--carousel-slide-size': rem(getBaseValue(props.slideSize)),
      })

      const queries = keys(theme.value.breakpoints).reduce<Record<string, Record<string, any>>>(
        (acc, breakpoint) => {
          acc[breakpoint] = acc[breakpoint] ?? {}

          if (isObject(props.slideGap) && props.slideGap[breakpoint] !== undefined) {
            acc[breakpoint]['--carousel-slide-gap'] = getSpacing(props.slideGap[breakpoint])
          }

          if (isObject(props.slideSize) && props.slideSize[breakpoint] !== undefined) {
            acc[breakpoint]['--carousel-slide-size'] = rem(props.slideSize[breakpoint])
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

      return h(InlineStyles, { selector: props.selector!, styles: baseStyles, media })
    }
  },
})

function getBreakpoints(values: unknown) {
  return isObject(values) ? keys(values).filter((breakpoint) => breakpoint !== 'base') : []
}

function sortBreakpoints(breakpoints: string[]) {
  return breakpoints.sort((a, b) => px(a) - px(b))
}

export const CarouselContainerVariables = defineComponent({
  name: 'CarouselContainerVariables',
  props: sharedProps,
  setup(props) {
    return () => {
      const baseStyles = filterProps({
        '--carousel-slide-gap': getSpacing(getBaseValue(props.slideGap)),
        '--carousel-slide-size': rem(getBaseValue(props.slideSize)),
      })

      const breakpoints = sortBreakpoints(
        Array.from(
          new Set([...getBreakpoints(props.slideGap), ...getBreakpoints(props.slideSize)]),
        ),
      )

      const container = breakpoints.reduce<Record<string, Record<string, any>>>(
        (acc, breakpoint) => {
          const key = `carousel (min-width: ${breakpoint})`
          acc[key] = {}

          if (isObject(props.slideGap) && props.slideGap[breakpoint] !== undefined) {
            acc[key]['--carousel-slide-gap'] = getSpacing(props.slideGap[breakpoint])
          }

          if (isObject(props.slideSize) && props.slideSize[breakpoint] !== undefined) {
            acc[key]['--carousel-slide-size'] = rem(props.slideSize[breakpoint])
          }

          return acc
        },
        {},
      )

      return h(InlineStyles, { selector: props.selector!, styles: baseStyles, container })
    }
  },
})
