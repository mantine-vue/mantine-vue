<script lang="ts">
const defaultProps = { cols: 1, spacing: 'md', type: 'media' } as const
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useRandomClassName, useStyles } from '../../core'
import { SimpleGridContainerVariables, SimpleGridMediaVariables } from './SimpleGridVariables'
import type { SimpleGridOwnProps, SimpleGridSlots } from './SimpleGrid.types'
import classes from './SimpleGrid.module.css'

defineOptions({ name: 'SimpleGrid', inheritAttrs: false })

const rawProps = withDefaults(defineProps<SimpleGridOwnProps>(), {
  cols: undefined,
  spacing: undefined,
  verticalSpacing: undefined,
  type: undefined,
  minColWidth: undefined,
  autoFlow: undefined,
  autoRows: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<SimpleGridSlots>()

const attrs = useAttrs()
const props = useProps('SimpleGrid', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'SimpleGrid',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
})
const responsiveClassName = useRandomClassName()
const autoColsAttr = computed(() =>
  props.minColWidth !== undefined ? props.autoFlow || 'auto-fill' : undefined,
)
const variablesProps = computed(() => ({
  selector: `.${responsiveClassName}`,
  cols: props.cols,
  spacing: props.spacing,
  verticalSpacing: props.verticalSpacing,
  minColWidth: props.minColWidth,
  autoRows: props.autoRows,
}))
</script>

<template>
  <template v-if="props.type === 'container'">
    <SimpleGridContainerVariables v-bind="variablesProps" />
    <div v-bind="getStyles('container')">
      <Box
        v-bind="{ ...attrs, ...getStyles('root', { className: responsiveClassName }) }"
        :data-auto-cols="autoColsAttr"
      >
        <slot />
      </Box>
    </div>
  </template>
  <template v-else>
    <SimpleGridMediaVariables v-bind="variablesProps" />
    <Box
      v-bind="{ ...attrs, ...getStyles('root', { className: responsiveClassName }) }"
      :data-auto-cols="autoColsAttr"
    >
      <slot />
    </Box>
  </template>
</template>
