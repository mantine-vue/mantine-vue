<script lang="ts">
import { createVarsResolver, getRadius, rem } from '../../core'

export const varsResolver = createVarsResolver<any>((_, { radius, size }) => ({
  root: {
    '--cs-radius': radius === undefined ? undefined : getRadius(radius),
    '--cs-size': rem(size),
  },
}))

const defaultProps = { withShadow: true } as const
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { ColorSwatchOwnProps, ColorSwatchSlots } from './ColorSwatch.types'
import classes from './ColorSwatch.module.css'

defineOptions({ name: 'ColorSwatch', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ColorSwatchOwnProps>(), {
  rootRef: undefined,
  size: undefined,
  radius: undefined,
  withShadow: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<ColorSwatchSlots>()

const attrs = useAttrs()
const props = useProps('ColorSwatch', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'ColorSwatch',
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('root', { focusable: true }) }" :rootRef="setRootRef">
    <span v-bind="getStyles('alphaOverlay')" />
    <span v-if="props.withShadow" v-bind="getStyles('shadowOverlay')" />
    <span v-bind="getStyles('colorOverlay', { style: { backgroundColor: props.color } })" />
    <span v-bind="getStyles('childrenOverlay')"><slot /></span>
  </Box>
</template>
