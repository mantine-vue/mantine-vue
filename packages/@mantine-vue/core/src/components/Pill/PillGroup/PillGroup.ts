import { factory } from '../../../core'
import { usePillGroupContext } from './PillGroup.context'
import PillGroupComponent, { varsResolver } from './PillGroup.vue'
import type { PillGroupFactory } from './PillGroup.types'
import classes from '../Pill.module.css'

export const PillGroup = factory<PillGroupFactory>(PillGroupComponent, { classes, varsResolver })

export { usePillGroupContext }
export type {
  PillGroupContextValue,
  PillGroupCssVariables,
  PillGroupOwnProps,
  PillGroupProps,
  PillGroupSlots,
  PillGroupStylesNames,
  PillGroupFactory,
} from './PillGroup.types'
