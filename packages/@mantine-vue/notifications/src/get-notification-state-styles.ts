import type { CSSProperties } from 'vue'
import type { NotificationPosition } from './notifications.store'

export type NotificationTransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited'

interface NotificationStateStylesProps {
  state: NotificationTransitionStatus
  maxHeight: number | string
  position: NotificationPosition
  transitionDuration: number
}

const transforms = {
  left: 'translateX(-100%)',
  right: 'translateX(100%)',
  'top-center': 'translateY(-100%)',
  'bottom-center': 'translateY(100%)',
}

const noTransform = {
  left: 'translateX(0)',
  right: 'translateX(0)',
  'top-center': 'translateY(0)',
  'bottom-center': 'translateY(0)',
}

function toCssLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

export function getNotificationStateStyles({
  state,
  maxHeight,
  position,
  transitionDuration,
}: NotificationStateStylesProps): CSSProperties {
  const [vertical, horizontal] = position.split('-')
  const property = (
    horizontal === 'center' ? `${vertical}-center` : horizontal
  ) as keyof typeof transforms

  const commonStyles: CSSProperties = {
    opacity: 0,
    maxHeight: toCssLength(maxHeight),
    transform: transforms[property],
    transitionDuration: `${transitionDuration}ms, ${transitionDuration}ms, ${transitionDuration}ms`,
    transitionTimingFunction: 'cubic-bezier(.51,.3,0,1.21), cubic-bezier(.51,.3,0,1.21), linear',
    transitionProperty: 'opacity, transform, max-height',
  }

  const inState: CSSProperties = {
    opacity: 1,
    transform: noTransform[property],
  }

  const outState: CSSProperties = {
    opacity: 0,
    maxHeight: toCssLength(0),
    transform: transforms[property],
  }

  const transitionStyles = {
    entering: inState,
    entered: inState,
    exiting: outState,
    exited: outState,
  }

  return { ...commonStyles, ...transitionStyles[state] }
}
