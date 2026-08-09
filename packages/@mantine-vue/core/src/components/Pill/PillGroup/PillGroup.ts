import { withBoxProps } from '../../../core'
import { usePillGroupContext } from './PillGroup.context'
import PillGroupComponent, { varsResolver } from './PillGroup.vue'
import classes from '../Pill.module.css'

export const PillGroup = withBoxProps(PillGroupComponent)
Object.assign(PillGroup, { classes, varsResolver })

export { usePillGroupContext }
export type {
  PillGroupContextValue,
  PillGroupCssVariables,
  PillGroupOwnProps,
  PillGroupProps,
  PillGroupSlots,
  PillGroupStylesNames,
} from './PillGroup.types'
