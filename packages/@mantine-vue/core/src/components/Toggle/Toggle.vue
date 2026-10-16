<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../core'

const varsResolver = createVarsResolver<any>(
  (theme, { size, radius, color, variant, autoContrast }) => {
    const activeColors = theme.variantColorResolver({
      color: color || theme.primaryColor,
      theme,
      variant: variant || 'filled',
      autoContrast,
    })

    return {
      root: {
        '--toggle-size': size !== undefined ? getSize(size, 'toggle-size') : undefined,
        '--toggle-radius': radius !== undefined ? getRadius(radius) : undefined,
        '--toggle-active-bg': color || variant ? activeColors.background : undefined,
        '--toggle-active-hover': color || variant ? activeColors.hover : undefined,
        '--toggle-active-color': color || variant ? activeColors.color : undefined,
      },
    }
  },
)
export { varsResolver }
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef, useUncontrolled } from '@mantine-vue/hooks'
import { Box, omitAttrs, useProps, useStyles } from '../../core'
import type { ToggleOwnProps, ToggleSlots } from './Toggle.types'
import classes from './Toggle.module.css'

defineOptions({ name: 'Toggle', inheritAttrs: false })
const rawProps = withDefaults(defineProps<ToggleOwnProps>(), {
  component: 'button',
  active: undefined,
  defaultActive: false,
  disabled: false,
  autoWidth: false,
  autoContrast: undefined,
  unstyled: false,
  variant: undefined,
})
const emit = defineEmits<{ 'update:active': [active: boolean]; activeChange: [active: boolean] }>()
defineSlots<ToggleSlots>()
const attrs = useAttrs()
const props = useProps('Toggle', { variant: 'filled' } as const, rawProps)
const [active, setActive] = useUncontrolled({
  value: () => props.active,
  defaultValue: props.defaultActive,
  finalValue: false,
  onChange: (value) => {
    emit('update:active', value)
    emit('activeChange', value)
  },
})
const getStyles = useStyles({
  name: 'Toggle',
  classes,
  props,
  attrs,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
  varsResolver,
})
const rootElement = ref<Element | null>(null)
function setRootRef(node: any) {
  rootElement.value = node?.$el ?? node ?? null
  assignRef(props.rootRef, rootElement.value)
}
function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  setActive(!active.value)
  const handler = (attrs as any).onClick
  if (Array.isArray(handler)) handler.forEach((item) => item?.(event))
  else handler?.(event)
}
defineExpose({ rootElement })
</script>

<template>
  <Box
    v-bind="{ ...omitAttrs(attrs, ['onClick']), ...getStyles('root', { focusable: true }) }"
    :root-ref="setRootRef"
    :component="props.component"
    :type="attrs.type ?? (props.component === 'button' ? 'button' : undefined)"
    :variant="props.variant"
    :size="props.size"
    :data-active="active || undefined"
    :data-disabled="props.disabled || undefined"
    :data-auto-width="props.autoWidth || undefined"
    :disabled="props.disabled || undefined"
    :aria-disabled="props.disabled || undefined"
    :aria-pressed="active"
    :tabindex="props.disabled ? -1 : (attrs.tabindex as any)"
    @click="onClick"
    ><slot
  /></Box>
</template>
