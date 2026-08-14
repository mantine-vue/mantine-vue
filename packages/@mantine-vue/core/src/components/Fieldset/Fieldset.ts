import { factory } from '../../core'
import FieldsetComponent, { varsResolver } from './Fieldset.vue'
import type { FieldsetFactory } from './Fieldset.types'
import classes from './Fieldset.module.css'

export const Fieldset = factory<FieldsetFactory>(FieldsetComponent, { classes, varsResolver })

export type {
  FieldsetOwnProps,
  FieldsetProps,
  FieldsetSlots,
  FieldsetStylesNames,
  FieldsetVariant,
  FieldsetFactory,
} from './Fieldset.types'
