<script setup lang="ts">
import { computed } from 'vue'
import {
  getSortedBreakpoints,
  InlineStyles,
  keys,
  getSpacing,
  rem,
  useMantineTheme,
} from '@mantine-vue/core'
import { getBaseStyles, isObject } from './CarouselVariables.utils'
import type { CarouselVariablesProps } from './CarouselVariables.types'
defineOptions({ name: 'CarouselVariables' })
const props = defineProps<CarouselVariablesProps>()
const theme = useMantineTheme()
const styles = computed(() => getBaseStyles(props))
const media = computed(() => {
  const queries = keys(theme.value.breakpoints).reduce<Record<string, Record<string, any>>>(
    (result, breakpoint) => {
      const values: Record<string, any> = {}
      if (isObject(props.slideGap) && props.slideGap[breakpoint] !== undefined)
        values['--carousel-slide-gap'] = getSpacing(props.slideGap[breakpoint])
      if (isObject(props.slideSize) && props.slideSize[breakpoint] !== undefined)
        values['--carousel-slide-size'] = rem(props.slideSize[breakpoint])
      result[breakpoint] = values
      return result
    },
    {},
  )
  return getSortedBreakpoints(theme.value.breakpoints).reduce<Record<string, Record<string, any>>>(
    (result, item) => {
      if (keys(queries[item.breakpoint] ?? {}).length)
        result[`(min-width: ${theme.value.breakpoints[item.breakpoint]})`] =
          queries[item.breakpoint]
      return result
    },
    {},
  )
})
</script>
<template><InlineStyles :selector="props.selector" :styles="styles" :media="media" /></template>
