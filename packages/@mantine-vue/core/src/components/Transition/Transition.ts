import {
  defineComponent,
  type CSSProperties,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { useMantineEnv } from '../../core'
import { getTransitionStyles } from './get-transition-styles'
import type { MantineTransition } from './transitions'
import { useTransition } from './use-transition'

export type { MantineTransition } from './transitions'

export interface TransitionSlots {
  default?: (styles: CSSProperties) => VNodeChild
}

export interface TransitionProps {
  /** If set, the element is kept in the DOM when hidden */
  keepMounted?: boolean

  /** Transition name or object */
  transition?: MantineTransition

  /** Transition duration in ms @default 250 */
  duration?: number

  /** Exit transition duration in ms @default duration */
  exitDuration?: number

  /** Transition timing function @default theme.transitionTimingFunction */
  timingFunction?: string

  /** Determines whether component should be mounted to the DOM */
  mounted: boolean

  /** Delay in ms before enter transition starts */
  enterDelay?: number

  /** Delay in ms before exit transition starts */
  exitDelay?: number
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
    enterDelay: { type: Number, default: undefined },
    exitDelay: { type: Number, default: undefined },
  },
  emits: {
    enter: () => true,
    entered: () => true,
    exit: () => true,
    exited: () => true,
  },
  setup(props, { slots, emit }) {
    const env = useMantineEnv()

    const { transitionDuration, transitionStatus, transitionTimingFunction } = useTransition({
      mounted: () => props.mounted,
      duration: () => props.duration,
      exitDuration: () => props.exitDuration ?? props.duration,
      timingFunction: () => props.timingFunction,
      enterDelay: () => props.enterDelay,
      exitDelay: () => props.exitDelay,
      onEnter: () => emit('enter'),
      onExit: () => emit('exit'),
      onEntered: () => emit('entered'),
      onExited: () => emit('exited'),
    })

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

      if (isExited) return null

      return slots.default?.(
        getTransitionStyles({
          transition: props.transition,
          duration: transitionDuration.value,
          state: transitionStatus.value,
          timingFunction: transitionTimingFunction.value,
        }),
      )
    }
  },
})
