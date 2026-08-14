<script lang="ts">
import { createVarsResolver } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { ratio }) => ({
  root: {
    '--ar-ratio': ratio?.toString(),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { AspectRatioOwnProps } from './AspectRatio.types'
import classes from './AspectRatio.module.css'
defineOptions({
  name: 'AspectRatio',
  inheritAttrs: false,
})
const rawProps = withDefaults(defineProps<AspectRatioOwnProps>(), {
  rootRef: undefined,
  ratio: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const attrs = useAttrs()
const props = useProps('AspectRatio', null, rawProps)

const getStyles = useStyles({
  name: 'AspectRatio',
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
  <Box :rootRef="setRootRef" v-bind="{ ...attrs, ...getStyles('root') }">
    <slot />
  </Box>
</template>
