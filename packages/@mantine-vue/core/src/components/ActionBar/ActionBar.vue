<script lang="ts">
import { getDefaultZIndex } from '../../core'

const defaultProps = {
  withBorder: true,
  py: 'xs',
  px: 'sm',
  position: { bottom: 30, left: 0, right: 0 },
  transitionProps: { transition: 'pop', duration: 200 },
  closeOnEscape: false,
  withinPortal: true,
  zIndex: getDefaultZIndex('modal'),
} as const

export { defaultProps }
</script>

<script setup lang="ts">
import { onBeforeUnmount, ref, useAttrs, watchEffect } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { useProps, useStyles } from '../../core'
import { Affix } from '../Affix'
import { Paper } from '../Paper'
import { Transition as MantineTransition } from '../Transition'
import { provideActionBarContext } from './ActionBar.context'
import type { ActionBarEmits, ActionBarOwnProps, ActionBarSlots } from './ActionBar.types'
import classes from './ActionBar.module.css'

defineOptions({ name: 'ActionBar', inheritAttrs: false })

const rawProps = withDefaults(defineProps<ActionBarOwnProps>(), {
  rootRef: undefined,
  transitionProps: undefined,
  shadow: undefined,
  radius: undefined,
  withBorder: undefined,
  py: undefined,
  px: undefined,
  position: undefined,
  zIndex: undefined,
  withinPortal: undefined,
  portalProps: undefined,
  closeOnEscape: undefined,
  keepMounted: false,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
  unstyled: false,
})
defineSlots<ActionBarSlots>()
const emit = defineEmits<ActionBarEmits>()
const attrs = useAttrs()
const props = useProps('ActionBar', defaultProps, rawProps)
const getStyles = useStyles({
  name: 'ActionBar',
  classes,
  props,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  vars: props.vars as any,
  unstyled: props.unstyled,
})

provideActionBarContext({
  getStyles,
  close: handleClose,
  get unstyled() {
    return props.unstyled
  },
})

function handleClose() {
  emit('update:opened', false)
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !event.isComposing) handleClose()
}

watchEffect((onCleanup) => {
  if (!props.closeOnEscape || !props.opened || typeof window === 'undefined') return
  window.addEventListener('keydown', handleKeydown, { passive: true })
  onCleanup(() => window.removeEventListener('keydown', handleKeydown))
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', handleKeydown)
})

const rootElement = ref<Element | null>(null)
const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Affix
    :z-index="props.zIndex"
    :position="props.position"
    :within-portal="props.withinPortal"
    :portal-props="props.portalProps"
    :unstyled="props.unstyled"
  >
    <MantineTransition
      v-slot="transitionStyles"
      v-bind="props.transitionProps"
      :mounted="props.opened"
      :keep-mounted="props.keepMounted"
    >
      <Paper
        :root-ref="setRootRef"
        v-bind="{ ...attrs, ...getStyles('root', { style: transitionStyles }) }"
        role="group"
        :shadow="props.shadow"
        :radius="props.radius"
        :with-border="props.withBorder"
        :py="props.py"
        :px="props.px"
        :unstyled="props.unstyled"
      >
        <slot />
      </Paper>
    </MantineTransition>
  </Affix>
</template>
