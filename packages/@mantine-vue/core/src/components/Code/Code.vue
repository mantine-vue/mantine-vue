<script lang="ts">
import { createVarsResolver, getThemeColor } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((theme, { color }) => ({
  root: {
    '--code-bg': color ? getThemeColor(color, theme) : undefined,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import type { CodeOwnProps, CodeSlots } from './Code.types'
import classes from './Code.module.css'

defineOptions({
  name: 'Code',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<CodeOwnProps>(), {
  rootRef: undefined,
  color: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<CodeSlots>()

const attrs = useAttrs()

const props = useProps('Code', null, rawProps)

const getStyles = useStyles({
  name: 'Code',
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
  <Box
    :rootRef="setRootRef"
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.block ? 'pre' : 'code'"
    :mod="[{ block: props.block }, (attrs as any).mod]"
    dir="ltr"
  >
    <slot />
  </Box>
</template>
