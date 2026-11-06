<script lang="ts">
const defaultProps = { span: 12 } as const
</script>

<script setup lang="ts">
import type { RootRefProps } from '../../../core'
import { computed, ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useRandomClassName } from '../../../core'
import { useGridContext } from '../Grid.context'
import {
  GridColVariables,
  getGridColBaseStyles,
  hasResponsiveColumnProps,
} from './GridColVariables'
import type { GridColOwnProps, GridColSlots } from './GridCol.types'

defineOptions({ name: 'GridCol', inheritAttrs: false })

const rawProps = withDefaults(defineProps<GridColOwnProps & RootRefProps<Element>>(), {
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
const hasResponsiveStyles = computed(() =>
  hasResponsiveColumnProps(props.span, props.order, props.offset, props.align),
)
const baseStyles = computed(() =>
  getGridColBaseStyles({
    span: props.span,
    order: props.order,
    offset: props.offset,
    align: props.align,
    columns: ctx.columns,
    grow: ctx.grow,
  }),
)
const colStyles = computed(() => {
  const resolved = ctx.getStyles('col', {
    className: [attrs.class, hasResponsiveStyles.value && responsiveClassName],
    style: attrs.style,
  })

  // Responsive columns get their base values from GridColVariables' stylesheet; inlining
  // them here would override every breakpoint rule.
  return hasResponsiveStyles.value
    ? resolved
    : { ...resolved, style: [baseStyles.value, resolved.style] }
})

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <GridColVariables
    v-if="hasResponsiveStyles"
    :selector="`.${responsiveClassName}`"
    :span="props.span"
    :order="props.order"
    :offset="props.offset"
    :align="props.align"
  />
  <Box :rootRef="setRootRef" v-bind="{ ...attrs, ...colStyles }">
    <slot />
  </Box>
</template>
