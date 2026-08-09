import type { CSSProperties, VNodeChild } from 'vue'
import type { MantineTransition } from './transitions'

/** Props declared by the `Transition` component. */
export interface TransitionProps {
  /** If set, the element is kept in the DOM when hidden. */
  keepMounted?: boolean

  /** Transition name or transition definition object. */
  transition?: MantineTransition

  /** Transition duration in milliseconds. @default 250 */
  duration?: number

  /** Exit transition duration in milliseconds. @default duration */
  exitDuration?: number

  /** CSS transition timing function. @default 'ease' */
  timingFunction?: string

  /** Determines whether the content should be mounted. */
  mounted: boolean

  /** Delay in milliseconds before the enter transition starts. */
  enterDelay?: number

  /** Delay in milliseconds before the exit transition starts. */
  exitDelay?: number
}

export type TransitionOverride = Partial<Omit<TransitionProps, 'mounted'>>

export interface TransitionSlots {
  /** Render function that receives the current transition styles. */
  default?: (styles: CSSProperties) => VNodeChild
}

export interface TransitionEmits {
  /** Emitted when the enter transition starts. */
  enter: []

  /** Emitted when the enter transition ends. */
  entered: []

  /** Emitted when the exit transition starts. */
  exit: []

  /** Emitted when the exit transition ends. */
  exited: []
}
