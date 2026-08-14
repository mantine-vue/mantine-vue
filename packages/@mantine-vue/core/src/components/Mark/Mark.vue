<script lang="ts">
import { createVarsResolver } from '../../core'
import { getMarkColor } from './get-mark-color'

const defaultProps = {
  color: 'yellow',
}

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { color }) => ({
  root: {
    '--mark-bg-dark': getMarkColor({ color, theme, defaultShade: 5 }),
    '--mark-bg-light': getMarkColor({ color, theme, defaultShade: 2 }),
  },
}))

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { MarkOwnProps, MarkSlots } from './Mark.types'
import classes from './Mark.module.css'

defineOptions({
  name: 'Mark',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MarkOwnProps>(), {
  rootRef: undefined,
  color: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<MarkSlots>()

const attrs = useAttrs()

const props = useProps('Mark', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Mark',
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box :rootRef="setRootRef" v-bind="{ ...attrs, ...getStyles('root') }" component="mark">
    <slot />
  </Box>
</template>
