<script lang="ts">
import { createVarsResolver, getRadius } from '../../core'

const defaultProps = { variant: 'default' } as const
const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  root: { '--fieldset-radius': radius === undefined ? undefined : getRadius(radius) },
}))
export { varsResolver }
</script>

<script setup lang="ts">
import { ref, computed, useAttrs, useSlots } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import type { FieldsetOwnProps, FieldsetSlots } from './Fieldset.types'
import classes from './Fieldset.module.css'

defineOptions({ name: 'Fieldset', inheritAttrs: false })
const rawProps = withDefaults(defineProps<FieldsetOwnProps>(), {
  rootRef: undefined,
  legend: undefined,
  radius: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<FieldsetSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Fieldset', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Fieldset',
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
const legend = computed(() => resolveNode(props.legend, slots.legend))
const renderLegend = () => legend.value

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    component="fieldset"
    :variant="props.variant"
  >
    <legend v-if="hasNode(legend)" v-bind="getStyles('legend')">
      <component :is="renderLegend" />
    </legend>
    <slot />
  </Box>
</template>
