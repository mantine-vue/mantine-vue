<script lang="ts">
const defaultProps = { span: 12 } as const
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useRandomClassName } from '../../../core'
import { useGridContext } from '../Grid.context'
import { GridColVariables } from './GridColVariables'
import type { GridColOwnProps, GridColSlots } from './GridCol.types'

defineOptions({ name: 'GridCol', inheritAttrs: false })

const rawProps = withDefaults(defineProps<GridColOwnProps>(), {
  span: undefined,
  order: undefined,
  offset: undefined,
  align: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<GridColSlots>()

const attrs = useAttrs()
const props = useProps('GridCol', defaultProps, rawProps)
const ctx = useGridContext()
const responsiveClassName = useRandomClassName()
</script>

<template>
  <GridColVariables
    :selector="`.${responsiveClassName}`"
    :span="props.span"
    :order="props.order"
    :offset="props.offset"
    :align="props.align"
  />
  <Box
    v-bind="{
      ...attrs,
      ...ctx.getStyles('col', {
        className: [attrs.class, responsiveClassName],
        style: attrs.style as any,
      }),
    }"
  >
    <slot />
  </Box>
</template>
