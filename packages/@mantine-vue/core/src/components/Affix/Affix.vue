<script lang="ts">
import { createVarsResolver, getDefaultZIndex, getSpacing } from '../../core'

const defaultProps = {
  position: { bottom: 0, right: 0 },
  zIndex: getDefaultZIndex('modal'),
  withinPortal: true,
} as const

const varsResolver = createVarsResolver<any>((_, { zIndex, position }) => ({
  root: {
    '--affix-z-index': zIndex?.toString(),
    '--affix-top': getSpacing(position?.top),
    '--affix-left': getSpacing(position?.left),
    '--affix-bottom': getSpacing(position?.bottom),
    '--affix-right': getSpacing(position?.right),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box, useProps, useStyles } from '../../core'
import { OptionalPortal } from '../Portal'
import type { AffixOwnProps, AffixSlots } from './Affix.types'
import classes from './Affix.module.css'

defineOptions({ name: 'Affix', inheritAttrs: false })

const rawProps = withDefaults(defineProps<AffixOwnProps>(), {
  zIndex: undefined,
  withinPortal: undefined,
  portalProps: undefined,
  position: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<AffixSlots>()

const attrs = useAttrs()
const props = useProps('Affix', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Affix',
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

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <OptionalPortal v-bind="props.portalProps" :within-portal="props.withinPortal">
    <Box
      :rootRef="setRootRef"
      v-bind="{
        ...attrs,
        ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
      }"
    >
      <slot />
    </Box>
  </OptionalPortal>
</template>
