<script setup lang="ts">
import { computed } from 'vue'
import { InlineStyles, keys, getSpacing, px, rem } from '@mantine-vue/core'
import { getBaseStyles, isObject } from './CarouselVariables.utils'
import type { CarouselVariablesProps } from './CarouselVariables.types'
defineOptions({ name: 'CarouselContainerVariables' })
const props = defineProps<CarouselVariablesProps>()
const styles = computed(() => getBaseStyles(props))
const container = computed(() => {
  const getBreakpoints = (value: unknown) =>
    isObject(value) ? keys(value).filter((key) => key !== 'base') : []
  const breakpoints = [
    ...new Set([...getBreakpoints(props.slideGap), ...getBreakpoints(props.slideSize)]),
  ].sort((a, b) => px(a) - px(b))
  return breakpoints.reduce<Record<string, Record<string, any>>>((result, breakpoint) => {
    const values: Record<string, any> = {}
    if (isObject(props.slideGap) && props.slideGap[breakpoint] !== undefined)
      values['--carousel-slide-gap'] = getSpacing(props.slideGap[breakpoint])
    if (isObject(props.slideSize) && props.slideSize[breakpoint] !== undefined)
      values['--carousel-slide-size'] = rem(props.slideSize[breakpoint])
    result[`carousel (min-width: ${breakpoint})`] = values
    return result
  }, {})
})
</script>
<template>
  <InlineStyles :selector="props.selector" :styles="styles" :container="container" />
</template>
