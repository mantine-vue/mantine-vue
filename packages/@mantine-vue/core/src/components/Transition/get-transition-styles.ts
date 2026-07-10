import type { CSSProperties } from 'vue'
import { transitions, type MantineTransition } from './transitions'

export type TransitionStatus =
  | 'entered'
  | 'exited'
  | 'entering'
  | 'exiting'
  | 'pre-exiting'
  | 'pre-entering'

const transitionStatuses: Record<TransitionStatus, 'in' | 'out'> = {
  entering: 'in',
  entered: 'in',
  exiting: 'out',
  exited: 'out',
  'pre-exiting': 'out',
  'pre-entering': 'out',
}

export function getTransitionStyles({
  transition,
  state,
  duration,
  timingFunction,
}: {
  transition: MantineTransition
  state: TransitionStatus
  duration: number
  timingFunction: CSSProperties['transitionTimingFunction']
}): CSSProperties {
  const shared: CSSProperties = {
    WebkitBackfaceVisibility: 'hidden',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: timingFunction,
  }

  if (typeof transition === 'string') {
    if (!(transition in transitions)) {
      return {}
    }

    return {
      transitionProperty: transitions[transition].transitionProperty,
      ...shared,
      ...transitions[transition].common,
      ...transitions[transition][transitionStatuses[state]],
    }
  }

  return {
    transitionProperty: transition.transitionProperty,
    ...shared,
    ...transition.common,
    ...transition[transitionStatuses[state]],
  }
}
