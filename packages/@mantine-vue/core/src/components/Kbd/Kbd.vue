<script lang="ts">
import { createVarsResolver, getSize } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: { '--kbd-fz': getSize(size, 'kbd-fz') },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { KbdOwnProps, KbdSlots } from './Kbd.types'
import classes from './Kbd.module.css'

defineOptions({
  name: 'Kbd',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<KbdOwnProps>(), {
  rootRef: undefined,
  size: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<KbdSlots>()

const attrs = useAttrs()

const props = useProps('Kbd', null, rawProps)

const getStyles = useStyles({
  name: 'Kbd',
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
  <Box :rootRef="setRootRef" v-bind="{ ...attrs, ...getStyles('root') }" component="kbd">
    <slot />
  </Box>
</template>
