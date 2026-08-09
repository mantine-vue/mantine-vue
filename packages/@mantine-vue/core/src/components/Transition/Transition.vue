<script setup lang="ts">
import { useSlots } from 'vue'
import { useMantineEnv } from '../../core'
import { getTransitionStyles } from './get-transition-styles'
import { useTransition } from './use-transition'
import type { TransitionEmits, TransitionProps, TransitionSlots } from './Transition.types'

defineOptions({ name: 'MantineTransition' })

const props = withDefaults(defineProps<TransitionProps>(), {
  keepMounted: false,
  transition: 'fade',
  duration: 250,
  exitDuration: undefined,
  timingFunction: 'ease',
  enterDelay: undefined,
  exitDelay: undefined,
})
const emit = defineEmits<TransitionEmits>()
defineSlots<TransitionSlots>()

const slots = useSlots()
const env = useMantineEnv()
const { transitionDuration, transitionStatus, transitionTimingFunction } = useTransition({
  mounted: () => props.mounted,
  duration: () => (env === 'test' ? 0 : props.duration),
  exitDuration: () => (env === 'test' ? 0 : (props.exitDuration ?? props.duration)),
  timingFunction: () => props.timingFunction,
  enterDelay: () => props.enterDelay,
  exitDelay: () => props.exitDelay,
  onEnter: () => emit('enter'),
  onExit: () => emit('exit'),
  onEntered: () => emit('entered'),
  onExited: () => emit('exited'),
})

const renderTransition = () => {
  if (env === 'test') {
    if (props.mounted) return slots.default?.({})
    return props.keepMounted ? slots.default?.({ display: 'none' }) : null
  }

  if (transitionDuration.value === 0) {
    if (props.keepMounted) {
      return slots.default?.(props.mounted ? {} : { display: 'none' })
    }
    return props.mounted ? slots.default?.({}) : null
  }

  const isExited = transitionStatus.value === 'exited'

  if (props.keepMounted) {
    return slots.default?.(
      isExited
        ? { display: 'none' }
        : getTransitionStyles({
            transition: props.transition,
            duration: transitionDuration.value,
            state: transitionStatus.value,
            timingFunction: transitionTimingFunction.value,
          }),
    )
  }

  if (isExited) {
    return null
  }

  return slots.default?.(
    getTransitionStyles({
      transition: props.transition,
      duration: transitionDuration.value,
      state: transitionStatus.value,
      timingFunction: transitionTimingFunction.value,
    }),
  )
}
</script>

<template>
  <renderTransition />
</template>
