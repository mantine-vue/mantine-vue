<script lang="ts">
import { createVarsResolver, getSize, getThemeColor } from '../../core'

const defaultProps = {
  orientation: 'horizontal',
  labelPosition: 'center',
  variant: 'solid',
} as const
const varsResolver = createVarsResolver<any>((theme, { color, variant, size }) => ({
  root: {
    '--divider-color': color ? getThemeColor(color, theme) : undefined,
    '--divider-border-style': variant,
    '--divider-size': getSize(size, 'divider-size'),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, computed, useAttrs, useSlots } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import type { DividerOwnProps, DividerSlots } from './Divider.types'
import classes from './Divider.module.css'

defineOptions({ name: 'Divider', inheritAttrs: false })
const rawProps = withDefaults(defineProps<DividerOwnProps>(), {
  rootRef: undefined,
  color: undefined,
  label: undefined,
  labelPosition: undefined,
  orientation: undefined,
  variant: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<DividerSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Divider', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Divider',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})
const label = computed(() => resolveNode(props.label, slots.label ?? slots.default))
const renderLabel = () => label.value
const rootMod = computed(() => [
  { orientation: props.orientation, withLabel: hasNode(label.value) },
  (attrs as any).mod,
])

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
    v-bind="{ ...attrs, ...getStyles('root') }"
    role="separator"
    :mod="rootMod"
  >
    <Box
      v-if="hasNode(label)"
      component="span"
      v-bind="getStyles('label')"
      :mod="{ position: props.labelPosition }"
      ><component :is="renderLabel"
    /></Box>
  </Box>
</template>
