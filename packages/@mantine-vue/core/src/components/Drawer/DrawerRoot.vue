<script lang="ts">
import { createVarsResolver, getSize, rem } from '../../core'
import type { DrawerPosition } from './Drawer.types'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, props) => ({
  root: {
    '--drawer-size': getSize(props.size, 'drawer-size'),
    // A horizontal drawer takes the full width minus the offsets, and `size` becomes its
    // height; a vertical one takes `size` as its width and grows to full height.
    '--drawer-flex':
      props.position === 'top' || props.position === 'bottom'
        ? '0 0 calc(100% - var(--drawer-offset) * 2)'
        : undefined,
    '--drawer-height':
      props.position === 'left' || props.position === 'right' ? undefined : 'var(--drawer-size)',
    '--drawer-align':
      props.position === 'top'
        ? 'flex-start'
        : props.position === 'bottom'
          ? 'flex-end'
          : undefined,
    '--drawer-justify': props.position === 'right' ? 'flex-end' : undefined,
    '--drawer-offset': rem(props.offset),
  },
}))

/** The drawer slides in from the side it is anchored to. */
const transitions: Record<DrawerPosition, string> = {
  top: 'slide-down',
  bottom: 'slide-up',
  left: 'slide-right',
  right: 'slide-left',
}

/** In RTL the horizontal sides are mirrored, so the slide directions swap with them. */
const rtlTransitions: Record<DrawerPosition, string> = {
  top: 'slide-down',
  bottom: 'slide-up',
  left: 'slide-left',
  right: 'slide-right',
}

export { varsResolver, transitions, rtlTransitions }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useDirection, useStyles } from '../../core'
import { ModalBase } from '../ModalBase'
import { provideDrawerContext } from './Drawer.context'
import type { DrawerRootProps, DrawerRootSlots } from './Drawer.types'
import classes from './Drawer.module.css'

defineOptions({
  name: 'DrawerRoot',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DrawerRootProps>(), {
  keepMounted: false,
  // Inherited from `ModalBaseOwnProps` and defaulting to `true` there. Vue casts an
  // undeclared-default boolean to `false`, which would then be forwarded and shadow the
  // real default, so each one has to stay `undefined` here.
  lockScroll: undefined,
  trapFocus: undefined,
  withinPortal: undefined,
  closeOnClickOutside: undefined,
  closeOnEscape: undefined,
  returnFocus: undefined,
  position: 'left',
  offset: 0,
  size: 'md',
  unstyled: false,
})

defineSlots<DrawerRootSlots>()

const emit = defineEmits<{ close: [] }>()

const attrs = useAttrs()

const { dir } = useDirection()

const getStyles = useStyles({
  name: 'Drawer',
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

provideDrawerContext({
  getStyles,
  get radius() {
    return props.radius
  },
  get scrollAreaComponent() {
    return props.scrollAreaComponent
  },
})

/**
 * `Drawer.Root` declares every `ModalBase` prop, so they no longer arrive as fallthrough
 * attributes and have to be forwarded explicitly. Only the layout and Styles API props
 * `Drawer.Root` consumes itself are held back, `transitionProps` included – it is merged
 * with the direction-derived default below.
 */
const DRAWER_ROOT_ONLY_PROPS = [
  'position',
  'radius',
  'offset',
  'size',
  'scrollAreaComponent',
  'transitionProps',
  'classNames',
  'styles',
  'vars',
  'opened',
  'keepMounted',
] as const

const baseProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!(DRAWER_ROOT_ONLY_PROPS as readonly string[]).includes(key)) {
      result[key] = (props as Record<string, unknown>)[key]
    }
  }

  return result
})

const rootStyles = computed(() => getStyles('root'))

/** A consumer transition wins over the direction-derived default. */
const transitionProps = computed(() => ({
  transition: (dir.value === 'rtl' ? rtlTransitions : transitions)[props.position],
  ...props.transitionProps,
}))
</script>

<template>
  <ModalBase
    v-bind="{ ...attrs, ...baseProps, ...rootStyles }"
    :opened="props.opened"
    :keep-mounted="props.keepMounted"
    :unstyled="props.unstyled"
    :transition-props="transitionProps"
    :data-position="props.position"
    @close="emit('close')"
  >
    <slot />
  </ModalBase>
</template>
