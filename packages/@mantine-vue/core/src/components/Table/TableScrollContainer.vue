<script lang="ts">
import { createVarsResolver, rem } from '../../core'

const defaultProps = {
  type: 'scrollarea',
} as const

const varsResolver = createVarsResolver<any>((_, { minWidth, maxHeight, type }) => ({
  scrollContainer: {
    '--table-min-width': rem(minWidth),
    '--table-max-height': rem(maxHeight),
    '--table-overflow': type === 'native' ? 'auto' : undefined,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { ScrollArea } from '../ScrollArea'
import type {
  TableScrollContainerOwnProps,
  TableScrollContainerSlots,
} from './TableScrollContainer.types'
import classes from './Table.module.css'

defineOptions({ name: 'TableScrollContainer', inheritAttrs: false })

const rawProps = withDefaults(defineProps<TableScrollContainerOwnProps>(), {
  maxHeight: undefined,
  type: undefined,
  scrollAreaProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<TableScrollContainerSlots>()

const attrs = useAttrs()
const props = useProps('TableScrollContainer', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'TableScrollContainer',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

const rootComponent = computed(() => (props.type === 'scrollarea' ? ScrollArea : Box))
const rootProps = computed(() =>
  props.type === 'scrollarea'
    ? {
        ...attrs,
        offsetScrollbars: props.maxHeight ? 'xy' : 'x',
        ...props.scrollAreaProps,
        ...getStyles('scrollContainer'),
      }
    : {
        ...attrs,
        component: 'div',
        ...getStyles('scrollContainer'),
      },
)
</script>

<template>
  <component :is="rootComponent" v-bind="rootProps">
    <div v-bind="getStyles('scrollContainerInner')"><slot /></div>
  </component>
</template>
