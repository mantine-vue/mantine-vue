<script lang="ts">
import { createVarsResolver, getRadius, getSize, rem } from '../../core'

const defaultProps = { variant: 'subtle' } as const
const varsResolver = createVarsResolver<any>((_, { size, radius, iconSize }) => ({
  root: {
    '--cb-size': getSize(size, 'cb-size'),
    '--cb-radius': radius === undefined ? undefined : getRadius(radius),
    '--cb-icon-size': rem(iconSize),
  },
}))
export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { hasNode, resolveNode, useProps, useStyles } from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import { CloseIcon } from './CloseIcon'
import type { CloseButtonOwnProps, CloseButtonSlots } from './CloseButton.types'
import classes from './CloseButton.module.css'

defineOptions({ name: 'CloseButton', inheritAttrs: false })
const rawProps = withDefaults(defineProps<CloseButtonOwnProps>(), {
  component: 'button',
  icon: undefined,
  variant: undefined,
  __staticSelector: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<CloseButtonSlots>()
const attrs = useAttrs()
const slots = useSlots()
const props = useProps('CloseButton', defaultProps, rawProps)
const getStyles = useStyles({
  name: props.__staticSelector || 'CloseButton',
  props,
  className: attrs.class,
  style: attrs.style as any,
  classes,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})
const icon = computed(() => resolveNode(props.icon, slots.icon))
const renderIcon = () => icon.value
</script>

<template>
  <UnstyledButton
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component"
    :unstyled="props.unstyled"
    :variant="props.variant"
    :disabled="props.disabled"
    :mod="{ disabled: props.disabled }"
  >
    <component :is="renderIcon" v-if="hasNode(icon)" />
    <CloseIcon v-else />
    <slot />
  </UnstyledButton>
</template>
