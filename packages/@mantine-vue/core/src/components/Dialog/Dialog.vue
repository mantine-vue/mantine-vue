<script lang="ts">
import { createVarsResolver, getSize } from '../../core'
import type { MantineTransition } from '../Transition'

export const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: { '--dialog-size': getSize(size, 'dialog-size') },
}))

const defaultProps = {
  shadow: 'md',
  p: 'md',
  withBorder: true,
  transitionProps: { transition: 'pop-top-right' as MantineTransition, duration: 200 },
  position: { bottom: 30, right: 30 },
} as const
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { useMantineEnv, useProps, useStyles } from '../../core'
import { Affix } from '../Affix'
import { CloseButton } from '../CloseButton'
import { Paper } from '../Paper'
import { Transition as MantineTransitionComponent } from '../Transition'
import type { DialogOwnProps, DialogSlots } from './Dialog.types'
import classes from './Dialog.module.css'

defineOptions({ name: 'Dialog', inheritAttrs: false })

const rawProps = withDefaults(defineProps<DialogOwnProps>(), {
  keepMounted: false,
  withCloseButton: false,
  transitionProps: undefined,
  size: undefined,
  zIndex: undefined,
  withinPortal: undefined,
  portalProps: undefined,
  position: undefined,
  shadow: undefined,
  radius: undefined,
  withBorder: undefined,
  p: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<DialogSlots>()

const emit = defineEmits<{ close: [] }>()

const attrs = useAttrs()
const props = useProps('Dialog', defaultProps, rawProps)
const env = useMantineEnv()
const getStyles = useStyles({
  name: 'Dialog',
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
const getPaperProps = (transitionStyles: any) => ({
  ...attrs,
  ...getStyles('root', { style: transitionStyles, className: attrs.class }),
  unstyled: props.unstyled,
  shadow: props.shadow,
  radius: props.radius,
  withBorder: props.withBorder,
  p: props.p,
})
</script>

<template>
  <Affix
    :z-index="props.zIndex"
    :position="props.position"
    :within-portal="props.withinPortal"
    :portal-props="props.portalProps"
    :unstyled="props.unstyled"
  >
    <template v-if="env === 'test'">
      <Paper v-if="props.opened" v-bind="getPaperProps({})">
        <CloseButton
          v-if="props.withCloseButton"
          v-bind="getStyles('closeButton')"
          :unstyled="props.unstyled"
          @click="emit('close')"
        />
        <slot />
      </Paper>
      <Paper v-else-if="props.keepMounted" v-bind="getPaperProps({ display: 'none' })">
        <CloseButton
          v-if="props.withCloseButton"
          v-bind="getStyles('closeButton')"
          :unstyled="props.unstyled"
          @click="emit('close')"
        />
        <slot />
      </Paper>
    </template>
    <MantineTransitionComponent
      v-else
      v-slot="transitionStyles"
      v-bind="{ keepMounted: props.keepMounted, mounted: props.opened, ...props.transitionProps }"
    >
      <Paper v-bind="getPaperProps(transitionStyles)">
        <CloseButton
          v-if="props.withCloseButton"
          v-bind="getStyles('closeButton')"
          :unstyled="props.unstyled"
          @click="emit('close')"
        />
        <slot />
      </Paper>
    </MantineTransitionComponent>
  </Affix>
</template>
