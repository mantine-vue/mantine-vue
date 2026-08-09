<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { omitAttrs } from '../../core'
import { FocusTrap } from '../FocusTrap'
import { Paper } from '../Paper'
import { Transition as MantineTransition } from '../Transition'
import { useModalBaseContext } from './ModalBase.context'
import type { ModalBaseContentOwnProps, ModalBaseContentSlots } from './ModalBaseContent.types'
import classes from './ModalBase.module.css'

defineOptions({
  name: 'ModalBaseContent',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ModalBaseContentOwnProps>(), {
  transitionProps: undefined,
  innerProps: () => ({}),
})

defineSlots<ModalBaseContentSlots>()

const attrs = useAttrs()
const ctx = useModalBaseContext()

/**
 * The modal's own transition props come first so a per-content `transitionProps` can
 * override them; the two lifecycle hooks below call both, since the modal needs its
 * own callbacks regardless of what the consumer passes.
 */
const transitionProps = computed(() => {
  // `exited` / `entered` are *emits* on `Transition`, so a forwarded `onExited` in the
  // spread would be merged with the listener below and fire twice. The consumer's
  // callbacks are invoked explicitly instead.
  return omitAttrs({ ...ctx.transitionProps, ...props.transitionProps }, ['onExited', 'onEntered'])
})

function onExited() {
  ctx.onExitTransitionEnd?.()
  ;(ctx.transitionProps as any)?.onExited?.()
  ;(props.transitionProps as any)?.onExited?.()
}

function onEntered() {
  ctx.onEnterTransitionEnd?.()
  ;(ctx.transitionProps as any)?.onEntered?.()
  ;(props.transitionProps as any)?.onEntered?.()
}
</script>

<template>
  <MantineTransition
    :mounted="ctx.opened"
    transition="pop"
    v-bind="transitionProps"
    @exited="onExited"
    @entered="onEntered"
  >
    <template #default="transitionStyle">
      <div
        v-bind="props.innerProps"
        :class="[!ctx.unstyled && classes.inner, props.innerProps.class]"
      >
        <FocusTrap :active="ctx.opened && ctx.trapFocus">
          <Paper
            v-bind="attrs"
            component="section"
            role="dialog"
            :tabindex="-1"
            aria-modal="true"
            :aria-describedby="ctx.bodyMounted ? ctx.getBodyId() : undefined"
            :aria-labelledby="ctx.titleMounted ? ctx.getTitleId() : undefined"
            :style="[attrs.style, transitionStyle]"
            :class="[!ctx.unstyled && classes.content, attrs.class]"
            :unstyled="ctx.unstyled"
          >
            <slot />
          </Paper>
        </FocusTrap>
      </div>
    </template>
  </MantineTransition>
</template>
