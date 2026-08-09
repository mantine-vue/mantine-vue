<script lang="ts">
import {
  createVarsResolver,
  getRadius,
  getThemeColor,
  parseThemeColor,
  rem,
  rgba,
} from '../../core'

const defaultProps = { iconSize: 48 }

const varsResolver = createVarsResolver<any>((theme, { color, iconSize, radius, textWrap }) => {
  const darkParsed = parseThemeColor({
    color: color || theme.primaryColor,
    theme,
    colorScheme: 'dark',
  })
  const lightParsed = parseThemeColor({
    color: color || theme.primaryColor,
    theme,
    colorScheme: 'light',
  })

  return {
    root: {
      '--bq-bg-light': rgba(lightParsed.value, 0.07),
      '--bq-bg-dark': rgba(darkParsed.value, 0.06),
      '--bq-bd': getThemeColor(color, theme),
      '--bq-icon-size': rem(iconSize),
      '--bq-radius': getRadius(radius),
      '--bq-text-wrap': textWrap,
    },
  }
})
</script>

<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import type { BlockquoteOwnProps, BlockquoteSlots } from './Blockquote.types'
import classes from './Blockquote.module.css'

defineOptions({ name: 'Blockquote', inheritAttrs: false })

const rawProps = withDefaults(defineProps<BlockquoteOwnProps>(), {
  icon: undefined,
  color: undefined,
  cite: undefined,
  textWrap: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})
defineSlots<BlockquoteSlots>()

const attrs = useAttrs()
const slots = useSlots()
const props = useProps('Blockquote', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'Blockquote',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  varsResolver,
  unstyled: props.unstyled,
})

const icon = computed(() => resolveNode(props.icon, slots.icon))
const cite = computed(() => resolveNode(props.cite, slots.cite))
const renderIcon = () => icon.value
const renderCite = () => cite.value
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }" component="blockquote">
    <span v-if="hasNode(icon)" v-bind="getStyles('icon')"><component :is="renderIcon" /></span>
    <slot />
    <cite v-if="hasNode(cite)" v-bind="getStyles('cite')"><component :is="renderCite" /></cite>
  </Box>
</template>
