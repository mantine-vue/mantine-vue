<script lang="ts">
import { createVarsResolver, getSize, rem } from '../../core'

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>((_, props) => ({
  root: {
    '--modal-size': getSize(props.size, 'modal-size'),
    '--modal-radius': props.radius == null ? undefined : rem(props.radius),
    '--modal-y-offset': rem(props.yOffset),
    '--modal-x-offset': rem(props.xOffset),
  },
}))

export { varsResolver }
</script>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useStyles } from '../../core'
import { ModalBase } from '../ModalBase'
import { provideModalContext } from './Modal.context'
import type { ModalRootProps, ModalRootSlots } from './Modal.types'
import classes from './Modal.module.css'

defineOptions({
  name: 'ModalRoot',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ModalRootProps>(), {
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
  centered: false,
  fullScreen: false,
  xOffset: '5vw',
  yOffset: '5dvh',
  size: 'md',
  unstyled: false,
})

defineSlots<ModalRootSlots>()

const emit = defineEmits<{
  close: []
}>()

const attrs = useAttrs()

const getStyles = useStyles({
  name: 'Modal',
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

provideModalContext({
  getStyles,
  get fullScreen() {
    return props.fullScreen
  },
  get yOffset() {
    return props.yOffset
  },
  get scrollAreaComponent() {
    return props.scrollAreaComponent
  },
})

/**
 * `Modal.Root` declares every `ModalBase` prop, so they no longer arrive as fallthrough
 * attributes and have to be forwarded explicitly. Only the layout and Styles API props
 * `Modal.Root` consumes itself are held back.
 */
const MODAL_ROOT_ONLY_PROPS = [
  'centered',
  'fullScreen',
  'radius',
  'xOffset',
  'yOffset',
  'size',
  'scrollAreaComponent',
  'classNames',
  'styles',
  'vars',
  'opened',
  'keepMounted',
] as const

const baseProps = computed(() => {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(props)) {
    if (!(MODAL_ROOT_ONLY_PROPS as readonly string[]).includes(key)) {
      result[key] = (props as Record<string, unknown>)[key]
    }
  }

  return result
})

const rootStyles = computed(() => getStyles('root'))

const rootMod = computed(() => ({
  centered: props.centered,
  'full-screen': props.fullScreen,
}))
</script>

<template>
  <ModalBase
    v-bind="{ ...attrs, ...baseProps, ...rootStyles }"
    :opened="props.opened"
    :keep-mounted="props.keepMounted"
    :unstyled="props.unstyled"
    :mod="rootMod"
    @close="emit('close')"
  >
    <slot />
  </ModalBase>
</template>
