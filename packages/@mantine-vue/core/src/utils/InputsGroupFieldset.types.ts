import type { VNodeChild } from 'vue'
import type { BoxProps } from '../core'

export interface InputsGroupFieldsetSlots {
  /** Group content. */
  default?: () => VNodeChild
}

/**
 * `InputsGroupFieldset` declares no runtime props – every attribute falls through to
 * the `fieldset` element – so its public type is `BoxProps`.
 */
export type InputsGroupFieldsetProps = BoxProps
