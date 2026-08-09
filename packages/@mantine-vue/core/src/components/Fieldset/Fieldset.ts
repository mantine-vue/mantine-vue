import { withBoxProps } from '../../core'
import FieldsetComponent, { varsResolver } from './Fieldset.vue'
import classes from './Fieldset.module.css'

export const Fieldset = withBoxProps(FieldsetComponent)
Object.assign(Fieldset, { classes, varsResolver })

export type {
  FieldsetOwnProps,
  FieldsetProps,
  FieldsetSlots,
  FieldsetStylesNames,
  FieldsetVariant,
} from './Fieldset.types'
