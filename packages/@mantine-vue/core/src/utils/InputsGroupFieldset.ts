import { withBoxProps } from '../core'
import InputsGroupFieldsetComponent from './InputsGroupFieldset.vue'

/**
 * Resets the browser's default `fieldset` styling. Used by the selection group
 * components to associate a group of inputs with its label.
 */
export const InputsGroupFieldset = withBoxProps(InputsGroupFieldsetComponent)

export type {
  InputsGroupFieldsetProps,
  InputsGroupFieldsetSlots,
} from './InputsGroupFieldset.types'
