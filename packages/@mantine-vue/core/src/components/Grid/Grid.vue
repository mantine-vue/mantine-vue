<script lang="ts">
import { createVarsResolver } from '../../core'
export const varsResolver = createVarsResolver<any>((_, { justify, align, overflow }) => ({
  root: { '--grid-justify': justify, '--grid-align': align, '--grid-overflow': overflow },
}))
const defaultProps = { gap: 'md', columns: 12 } as const
</script>
<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box, useProps, useRandomClassName, useStyles } from '../../core'
import { provideGridContext } from './Grid.context'
import { GridVariables } from './GridVariables'
import type { GridOwnProps, GridSlots } from './Grid.types'
import classes from './Grid.module.css'
defineOptions({ name: 'Grid', inheritAttrs: false })
const rawProps = withDefaults(defineProps<GridOwnProps>(), {
  gap: undefined,
  rowGap: undefined,
  columnGap: undefined,
  grow: false,
  justify: undefined,
  align: undefined,
  columns: undefined,
  overflow: undefined,
  type: undefined,
  breakpoints: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<GridSlots>()
const attrs = useAttrs()
const props = useProps('Grid', defaultProps, rawProps)
const responsiveClassName = useRandomClassName()
const getStyles = useStyles({
  name: 'Grid',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
provideGridContext({
  getStyles,
  get grow() {
    return props.grow
  },
  get columns() {
    return props.columns ?? 12
  },
  get breakpoints() {
    return props.breakpoints
  },
  get type() {
    return props.type
  },
})
</script>
<template>
  <GridVariables
    :selector="`.${responsiveClassName}`"
    :gap="props.gap"
    :row-gap="props.rowGap"
    :column-gap="props.columnGap"
    :breakpoints="props.breakpoints"
    :type="props.type"
  />
  <div v-if="props.type === 'container' && props.breakpoints" v-bind="getStyles('container')">
    <Box v-bind="{ ...attrs, ...getStyles('root', { className: responsiveClassName }) }"
      ><div v-bind="getStyles('inner')"><slot /></div
    ></Box>
  </div>
  <Box v-else v-bind="{ ...attrs, ...getStyles('root', { className: responsiveClassName }) }"
    ><div v-bind="getStyles('inner')"><slot /></div
  ></Box>
</template>
