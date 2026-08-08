<script lang="ts">
import { createVarsResolver, getThemeColor, rem } from '../../core'

const defaultProps = {
  scrollAmount: 200,
  draggable: true,
} as const

const varsResolver = createVarsResolver<any>((theme, { controlSize, edgeGradientColor }) => ({
  root: {
    '--scroller-control-size': controlSize === undefined ? undefined : rem(controlSize),
    '--scroller-background-color': edgeGradientColor
      ? getThemeColor(edgeGradientColor, theme)
      : undefined,
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useScroller } from '@mantine-vue/hooks'
import { Box, hasNode, resolveNode, useProps, useStyles } from '../../core'
import { AccordionChevron } from '../Accordion'
import { UnstyledButton } from '../UnstyledButton'
import type { ScrollerOwnProps, ScrollerSlots } from './Scroller.types'
import classes from './Scroller.module.css'

defineOptions({ name: 'Scroller', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ScrollerOwnProps>(), {
  scrollAmount: undefined,
  controlSize: undefined,
  edgeGradientColor: undefined,
  startControlProps: undefined,
  endControlProps: undefined,
  startControlIcon: undefined,
  endControlIcon: undefined,
  showStartControl: false,
  showEndControl: false,
  draggable: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
const slots = defineSlots<ScrollerSlots>()
const attrs = useAttrs()
const props = useProps('Scroller', defaultProps, rawProps)
const scroller = useScroller({
  scrollAmount: props.scrollAmount,
  draggable: props.draggable,
})
const getStyles = useStyles({
  name: 'Scroller',
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

const showStart = computed(() => props.showStartControl || scroller.canScrollStart.value)
const showEnd = computed(() => props.showEndControl || scroller.canScrollEnd.value)
const startIcon = computed(() => resolveNode(props.startControlIcon, slots.startControlIcon))
const endIcon = computed(() => resolveNode(props.endControlIcon, slots.endControlIcon))
const renderStartIcon = () => startIcon.value
const renderEndIcon = () => endIcon.value
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
    }"
  >
    <UnstyledButton
      v-bind="{ ...props.startControlProps, ...getStyles('control') }"
      data-position="start"
      :data-hidden="!showStart || undefined"
      aria-label="Scroll left"
      :tabindex="showStart ? 0 : -1"
      @click="scroller.scrollStart"
    >
      <component :is="renderStartIcon" v-if="hasNode(startIcon)" />
      <AccordionChevron v-else v-bind="getStyles('chevron')" />
    </UnstyledButton>

    <div
      v-bind="{ ...getStyles('container'), ...scroller.dragHandlers }"
      :ref="scroller.ref as any"
      role="presentation"
      :data-draggable="props.draggable || undefined"
    >
      <div v-bind="getStyles('content')"><slot /></div>
    </div>

    <UnstyledButton
      v-bind="{ ...props.endControlProps, ...getStyles('control') }"
      data-position="end"
      :data-hidden="!showEnd || undefined"
      aria-label="Scroll right"
      :tabindex="showEnd ? 0 : -1"
      @click="scroller.scrollEnd"
    >
      <component :is="renderEndIcon" v-if="hasNode(endIcon)" />
      <AccordionChevron v-else v-bind="getStyles('chevron')" />
    </UnstyledButton>
  </Box>
</template>
