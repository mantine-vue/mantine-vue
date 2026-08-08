import { filterProps, getBaseValue, getSpacing, rem } from '@mantine-vue/core'
import type { CarouselVariablesProps } from './CarouselVariables.types'
export const isObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
export const getBaseStyles = (props: CarouselVariablesProps) =>
  filterProps({
    '--carousel-slide-gap': getSpacing(getBaseValue(props.slideGap)),
    '--carousel-slide-size': rem(getBaseValue(props.slideSize)),
  })
