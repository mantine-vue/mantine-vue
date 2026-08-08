<script lang="ts">
import { createVarsResolver, getRadius, getSize } from '../../core'

const varsResolver = createVarsResolver<any>((_, { radius }, ctx) => ({
  root: {
    '--pill-fz': getSize(ctx.size, 'pill-fz'),
    '--pill-height': getSize(ctx.size, 'pill-height'),
    '--pill-radius': radius === undefined ? undefined : getRadius(radius),
  },
}))

function callHandler(handler: any, event: Event) {
  if (Array.isArray(handler)) handler.forEach((item) => item?.(event))
  else handler?.(event)
}

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useProps, useStyles } from '../../core'
import { CloseButton } from '../CloseButton'
import { usePillsInputContext } from '../PillsInput/PillsInput.context'
import { usePillGroupContext } from './PillGroup/PillGroup'
import type { PillOwnProps, PillSlots } from './Pill.types'
import classes from './Pill.module.css'

defineOptions({ name: 'Pill', inheritAttrs: false })

const rawProps = withDefaults(defineProps<PillOwnProps>(), {
  size: undefined,
  withRemoveButton: false,
  removeButtonProps: undefined,
  radius: undefined,
  disabled: false,
  variant: 'default',
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<PillSlots>()

const emit = defineEmits<{
  remove: []
}>()

const attrs = useAttrs()
const props = useProps('Pill', null, rawProps)
const groupContext = usePillGroupContext()
const pillsInputContext = usePillsInputContext()
const sizeValue = computed(() => props.size || groupContext?.size || undefined)
const resolvedVariant = computed(() =>
  pillsInputContext?.variant === 'filled' ? 'contrast' : props.variant || 'default',
)
const disabled = computed(() => props.disabled || groupContext?.disabled)
const removeButtonAttrs = computed(() => {
  const forwarded = { ...props.removeButtonProps }
  delete forwarded.onClick
  delete forwarded.onMousedown
  delete forwarded.onMouseDown
  return forwarded
})
const stylesCtx = {
  get size() {
    return sizeValue.value
  },
}
const getStyles = useStyles({
  name: 'Pill',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
  stylesCtx,
})

function handleRemoveMousedown(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  callHandler(props.removeButtonProps?.onMousedown ?? props.removeButtonProps?.onMouseDown, event)
}

function handleRemoveClick(event: MouseEvent) {
  event.stopPropagation()
  emit('remove')
  callHandler(props.removeButtonProps?.onClick, event)
}
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
    component="span"
    :variant="resolvedVariant"
    :data-size="sizeValue"
    :mod="[{ 'with-remove': props.withRemoveButton && !disabled, disabled }, props.mod]"
  >
    <span v-bind="getStyles('label')"><slot /></span>
    <CloseButton
      v-if="props.withRemoveButton"
      v-bind="{
        variant: 'transparent',
        radius: props.radius,
        tabIndex: -1,
        'aria-hidden': true,
        unstyled: props.unstyled,
        ...removeButtonAttrs,
        ...getStyles('remove', {
          className: props.removeButtonProps?.class,
          style: props.removeButtonProps?.style,
        }),
      }"
      @mousedown="handleRemoveMousedown"
      @click="handleRemoveClick"
    />
  </Box>
</template>
