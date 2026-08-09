<script lang="ts">
import { createVarsResolver, getFontSize } from '../../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, { size }) => ({
  label: {
    '--input-label-size': getFontSize(size),
    '--input-asterisk-color': undefined,
  },
}))

const defaultProps = { labelElement: 'label' } as const

export { varsResolver, defaultProps }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, omitAttrs, useProps, useStyles } from '../../../core'
import { useInputWrapperContext } from '../InputWrapper.context'
import type { InputLabelOwnProps, InputLabelSlots } from './InputLabel.types'
import classes from '../Input.module.css'

defineOptions({
  name: 'InputLabel',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<InputLabelOwnProps>(), {
  required: false,
  unstyled: false,
})

defineSlots<InputLabelSlots>()

const attrs = useAttrs()
const props = useProps('InputLabel', defaultProps, rawProps)

const wrapperCtx = useInputWrapperContext()

const ownGetStyles = useStyles({
  name: 'InputWrapper',
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

const getStyles = computed(() => wrapperCtx.getStyles || ownGetStyles)

const labelStyles = computed(() =>
  getStyles.value('label', { className: attrs.class, style: attrs.style as any, props }),
)

function onMousedown(event: MouseEvent) {
  ;(attrs.onMousedown as ((event: MouseEvent) => void) | undefined)?.(event)

  if (!event.defaultPrevented && event.detail > 1) {
    event.preventDefault()
  }
}

const forwardedAttrs = computed(() => omitAttrs(attrs, ['onMousedown']))
</script>

<template>
  <Box
    v-bind="{ ...forwardedAttrs, ...labelStyles }"
    :component="props.labelElement"
    :for="props.labelElement === 'label' ? props.htmlFor : undefined"
    :mod="[{ required: props.required }, props.mod]"
    @mousedown="onMousedown"
  >
    <slot />
    <span v-if="props.required" v-bind="getStyles('required', { props })" aria-hidden> *</span>
  </Box>
</template>
