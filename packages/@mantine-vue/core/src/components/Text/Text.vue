<script lang="ts">
import { createVarsResolver, getFontSize, getGradient, getLineHeight } from '../../core'
export const varsResolver = createVarsResolver<any>(
  (theme, { variant, lineClamp, gradient, size, textWrap }) => ({
    root: {
      '--text-fz': getFontSize(size),
      '--text-lh': getLineHeight(size),
      '--text-gradient': variant === 'gradient' ? getGradient(gradient, theme) : undefined,
      '--text-line-clamp': typeof lineClamp === 'number' ? lineClamp.toString() : undefined,
      '--text-text-wrap': textWrap,
    },
  }),
)
const defaultProps = { inherit: false }
</script>
<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { Box, useForwardedRef, useProps, useStyles } from '../../core'
import type { TextOwnProps, TextSlots, TextTruncate } from './Text.types'
import classes from './Text.module.css'
defineOptions({ name: 'Text', inheritAttrs: false })
const rawProps = withDefaults(defineProps<TextOwnProps>(), {
  component: undefined,
  __staticSelector: undefined,
  size: undefined,
  lineClamp: undefined,
  truncate: undefined,
  inline: false,
  inherit: undefined,
  gradient: undefined,
  span: false,
  textWrap: undefined,
  variant: undefined,
  mod: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<TextSlots>()
const attrs = useAttrs()
const props = useProps('Text', defaultProps, rawProps)
const getStyles = useStyles({
  name: props.__staticSelector ?? 'Text',
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
const elementRef = ref<HTMLElement | null>(null)
useForwardedRef(elementRef)
const getTextTruncate = (value: TextTruncate | undefined) =>
  value === 'start' ? 'start' : value === 'end' || value ? 'end' : undefined
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :component="props.component ?? (props.span ? 'span' : 'p')"
    :variant="props.variant"
    :mod="[
      {
        truncate: getTextTruncate(props.truncate),
        lineClamp: typeof props.lineClamp === 'number',
        inline: props.inline,
        inherit: props.inherit,
      },
      props.mod,
    ]"
    ref="elementRef"
    ><slot
  /></Box>
</template>
