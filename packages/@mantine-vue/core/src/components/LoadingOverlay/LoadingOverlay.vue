<script lang="ts">
import { createVarsResolver, getDefaultZIndex } from '../../core'

const defaultProps: Record<string, any> = {
  transitionProps: { transition: 'fade', duration: 0 },
  overlayProps: { backgroundOpacity: 0.75 },
  zIndex: getDefaultZIndex('overlay'),
}

const varsResolver = createVarsResolver<any>((_, { zIndex }) => ({
  root: { '--lo-z-index': zIndex?.toString() },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Box, useMantineTheme, useProps, useStyles } from '../../core'
import { Loader } from '../Loader'
import { Overlay } from '../Overlay'
import { Transition as MantineTransition } from '../Transition'
import type { LoadingOverlayOwnProps } from './LoadingOverlay.types'
import classes from './LoadingOverlay.module.css'

defineOptions({ name: 'LoadingOverlay', inheritAttrs: false })

const rawProps = withDefaults(defineProps<LoadingOverlayOwnProps>(), {
  transitionProps: undefined,
  loaderProps: undefined,
  overlayProps: undefined,
  visible: false,
  zIndex: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})

const emit = defineEmits<{
  enter: []
  entered: []
  exit: []
  exited: []
}>()

const attrs = useAttrs()
const props = useProps('LoadingOverlay', defaultProps, rawProps)
const theme = useMantineTheme()
const getStyles = useStyles({
  name: 'LoadingOverlay',
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
const overlayProps = computed(() => ({ ...defaultProps.overlayProps, ...props.overlayProps }))
const transitionProps = computed(() => ({
  ...defaultProps.transitionProps,
  ...props.transitionProps,
}))
</script>

<template>
  <MantineTransition
    :transition="transitionProps.transition"
    :duration="transitionProps.duration"
    :timing-function="transitionProps.timingFunction"
    :keep-mounted="transitionProps.keepMounted"
    :mounted="props.visible"
    @enter="emit('enter')"
    @entered="emit('entered')"
    @exit="emit('exit')"
    @exited="emit('exited')"
  >
    <template #default="transitionStyles">
      <Box
        v-if="props.visible"
        v-bind="{ ...attrs, ...getStyles('root', { style: transitionStyles }) }"
      >
        <Loader
          :unstyled="props.unstyled"
          v-bind="{
            ...props.loaderProps,
            ...getStyles('loader', {
              className: props.loaderProps?.class,
              style: props.loaderProps?.style,
            }),
          }"
        />
        <Overlay
          v-bind="{
            ...overlayProps,
            ...getStyles('overlay', {
              className: ['mantine-dark-hidden', overlayProps.class],
              style: overlayProps.style,
            }),
          }"
          :unstyled="props.unstyled"
          :color="overlayProps.color || theme.white"
        />
        <Overlay
          v-bind="{
            ...overlayProps,
            ...getStyles('overlay', {
              className: ['mantine-light-hidden', overlayProps.class],
              style: overlayProps.style,
            }),
          }"
          :unstyled="props.unstyled"
          :color="overlayProps.color || theme.colors.dark[5]"
        />
      </Box>
    </template>
  </MantineTransition>
</template>
