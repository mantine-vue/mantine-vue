import { factory } from '../core'
import InputsGroupFieldsetComponent from './InputsGroupFieldset.vue'
import type { InputsGroupFieldsetFactory } from './InputsGroupFieldset.types'

/**
 * Resets the browser's default `fieldset` styling. Used by the selection group
 * components to associate a group of inputs with its label.
 */
export const InputsGroupFieldset = factory<InputsGroupFieldsetFactory>(InputsGroupFieldsetComponent)

export type {
  InputsGroupFieldsetProps,
  InputsGroupFieldsetSlots,
  InputsGroupFieldsetFactory,
} from './InputsGroupFieldset.types'
