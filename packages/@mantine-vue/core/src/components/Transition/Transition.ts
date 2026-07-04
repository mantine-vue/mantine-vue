import {
  defineComponent,
  onBeforeUnmount,
  ref,
  type PropType,
  type CSSProperties,
  type SlotsType,
  type VNodeChild,
  watch,
} from 'vue'
import { useMantineEnv } from '../../core'

export type MantineTransition =
  | 'fade'
  | 'fade-up'
  | 'slide-down'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'scale-y'
  | 'scale-x'
  | 'pop'
  | 'pop-top-left'
  | 'pop-top-right'
  | 'pop-bottom-left'
  | 'pop-bottom-right'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'skew-up'
  | 'skew-down'
  | 'rotate-left'
  | 'rotate-right'
  | {
      in: CSSProperties
      out: CSSProperties
      common?: CSSProperties
      transitionProperty?: CSSProperties['transitionProperty']
    }

type TransitionStatus =
  | 'entered'
  | 'exited'
  | 'entering'
  | 'exiting'
  | 'pre-entering'
  | 'pre-exiting'

const transitionStatuses: Record<TransitionStatus, 'in' | 'out'> = {
  entered: 'in',
  entering: 'in',
  exited: 'out',
  exiting: 'out',
  'pre-entering': 'out',
  'pre-exiting': 'out',
}

export interface TransitionSlots {
  default?: (styles: CSSProperties) => VNodeChild
}

function getTransitionBaseStyles({
  transition,
  duration,
  timingFunction,
  state,
}: {
  transition: MantineTransition
  duration: number
  timingFunction: string
  state: TransitionStatus
}) {
  const base: CSSProperties = {
    WebkitBackfaceVisibility: 'hidden',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: timingFunction,
  }
  const mounted = transitionStatuses[state] === 'in'

  if (typeof transition === 'object') {
    return {
      transitionProperty: transition.transitionProperty,
      ...base,
      ...transition.common,
      ...(mounted ? transition.in : transition.out),
    }
  }

  if (transition === 'fade-up') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(30px)',
    }
  }

  if (transition === 'fade-down') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(-30px)',
    }
  }

  if (transition === 'fade-left') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(30px)',
    }
  }

  if (transition === 'fade-right') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
    }
  }

  if (transition === 'slide-down') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      transformOrigin: 'top',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(-100%)',
    }
  }

  if (transition === 'slide-up') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      transformOrigin: 'bottom',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(100%)',
    }
  }

  if (transition === 'slide-left') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      transformOrigin: 'left',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(100%)',
    }
  }

  if (transition === 'slide-right') {
    return {
      ...base,
      transitionProperty: 'opacity, transform',
      transformOrigin: 'right',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateX(0)' : 'translateX(-100%)',
    }
  }

  if (transition === 'scale') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'top',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'scale(1)' : 'scale(0)',
    }
  }

  if (transition === 'scale-y') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'top',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'scaleY(1)' : 'scaleY(0)',
    }
  }

  if (transition === 'scale-x') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'left',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'scaleX(1)' : 'scaleX(0)',
    }
  }

  if (transition === 'skew-up') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'top',
      opacity: mounted ? 1 : 0,
      transform: mounted
        ? 'translateY(0) skew(0deg, 0deg)'
        : 'translateY(-20px) skew(-10deg, -5deg)',
    }
  }

  if (transition === 'skew-down') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'bottom',
      opacity: mounted ? 1 : 0,
      transform: mounted
        ? 'translateY(0) skew(0deg, 0deg)'
        : 'translateY(20px) skew(-10deg, -5deg)',
    }
  }

  if (transition === 'rotate-left') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'bottom',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(-5deg)',
    }
  }

  if (transition === 'rotate-right') {
    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin: 'top',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0) rotate(0deg)' : 'translateY(20px) rotate(5deg)',
    }
  }

  if (transition === 'pop' || transition.startsWith('pop-')) {
    const from = transition.includes('top') ? 'top' : 'bottom'
    const transformOrigin =
      transition === 'pop' ? 'center center' : transition.replace('pop-', '').replace('-', ' ')

    return {
      ...base,
      transitionProperty: 'transform, opacity',
      transformOrigin,
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'scale(1)' : `scale(.9) translateY(${from === 'bottom' ? 10 : -10}px)`,
    }
  }

  return { ...base, transitionProperty: 'opacity', opacity: mounted ? 1 : 0 }
}

let transitionKeyframeIndex = 0
const transitionKeyframes = new Map<string, string>()

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

function stylesToCss(styles: CSSProperties) {
  return Object.entries(styles)
    .filter(([property, value]) => {
      return (
        value !== undefined &&
        value !== null &&
        !property.startsWith('transition') &&
        !property.startsWith('animation')
      )
    })
    .map(([property, value]) => `${toKebabCase(property)}: ${value};`)
    .join(' ')
}

function getKeyframesName(from: CSSProperties, to: CSSProperties) {
  if (typeof document === 'undefined') return undefined

  const fromCss = stylesToCss(from)
  const toCss = stylesToCss(to)
  const key = `${fromCss}>>${toCss}`
  const cached = transitionKeyframes.get(key)

  if (cached) return cached

  const name = `mantine-vue-transition-${transitionKeyframeIndex++}`
  const style = document.createElement('style')
  style.setAttribute('data-mantine-vue-transition', name)
  style.textContent = `@keyframes ${name} { from { ${fromCss} } to { ${toCss} } }`
  document.head.appendChild(style)
  transitionKeyframes.set(key, name)
  return name
}

function getTransitionStyles(input: {
  transition: MantineTransition
  duration: number
  timingFunction: string
  state: TransitionStatus
}) {
  const styles = getTransitionBaseStyles(input)

  if (input.state !== 'entering' && input.state !== 'exiting') {
    return styles
  }

  const from = getTransitionBaseStyles({
    ...input,
    state: input.state === 'entering' ? 'pre-entering' : 'entered',
  })
  const animationName = getKeyframesName(from, styles)

  return {
    ...styles,
    animationName,
    animationDuration: `${input.duration}ms`,
    animationTimingFunction: input.timingFunction,
    animationFillMode: 'both',
  }
}

export const Transition = defineComponent({
  name: 'MantineTransition',
  slots: Object as SlotsType<TransitionSlots>,
  props: {
    keepMounted: { type: Boolean, default: false },
    transition: { type: [String, Object] as PropType<MantineTransition>, default: 'fade' },
    duration: { type: Number, default: 250 },
    exitDuration: { type: Number, default: undefined },
    timingFunction: { type: String, default: 'ease' },
    mounted: { type: Boolean, required: true },
    enterDelay: Number,
    exitDelay: Number,
  },
  emits: {
    enter: () => true,
    entered: () => true,
    exit: () => true,
    exited: () => true,
  },
  setup(props, { slots, emit }) {
    const env = useMantineEnv()
    const status = ref<TransitionStatus>(props.mounted ? 'entered' : 'exited')
    const transitionDuration = ref(props.duration)
    const emitTransitionEvent = emit as (event: 'enter' | 'entered' | 'exit' | 'exited') => void
    let transitionTimeout = -1
    let delayTimeout = -1
    let transitionId = 0

    const clear = () => {
      transitionId += 1
      if (typeof window === 'undefined') return
      window.clearTimeout(transitionTimeout)
      window.clearTimeout(delayTimeout)
    }

    const handleStateChange = (shouldMount: boolean) => {
      clear()
      const duration = shouldMount ? props.duration : (props.exitDuration ?? props.duration)
      transitionDuration.value = duration

      if (typeof window === 'undefined' || duration === 0) {
        emitTransitionEvent(shouldMount ? 'enter' : 'exit')
        emitTransitionEvent(shouldMount ? 'entered' : 'exited')
        status.value = shouldMount ? 'entered' : 'exited'
        return
      }

      status.value = shouldMount ? 'entering' : 'pre-exiting'
      const currentTransitionId = ++transitionId
      emitTransitionEvent(shouldMount ? 'enter' : 'exit')
      status.value = shouldMount ? 'entering' : 'exiting'
      transitionTimeout = window.setTimeout(() => {
        if (currentTransitionId !== transitionId) return

        emitTransitionEvent(shouldMount ? 'entered' : 'exited')
        status.value = shouldMount ? 'entered' : 'exited'
      }, duration)
    }

    const handleTransitionWithDelay = (shouldMount: boolean) => {
      clear()
      const delay = shouldMount ? props.enterDelay : props.exitDelay

      if (typeof window === 'undefined' || typeof delay !== 'number') {
        handleStateChange(shouldMount)
        return
      }

      delayTimeout = window.setTimeout(() => handleStateChange(shouldMount), delay)
    }

    watch(
      () => props.mounted,
      (value, oldValue) => {
        if (value !== oldValue) handleTransitionWithDelay(value)
      },
    )

    onBeforeUnmount(clear)

    return () => {
      if (env === 'test') {
        if (props.mounted) {
          emit('enter')
          emit('entered')
          return slots.default?.({})
        }

        emit('exit')
        emit('exited')
        return props.keepMounted ? slots.default?.({ display: 'none' }) : null
      }

      if (transitionDuration.value === 0) {
        if (props.keepMounted) return slots.default?.(props.mounted ? {} : { display: 'none' })
        return props.mounted ? slots.default?.({}) : null
      }

      if (status.value === 'exited') {
        return props.keepMounted ? slots.default?.({ display: 'none' }) : null
      }

      return slots.default?.(
        getTransitionStyles({
          transition: props.transition,
          duration: transitionDuration.value,
          timingFunction: props.timingFunction || 'ease',
          state: status.value,
        }),
      )
    }
  },
})
