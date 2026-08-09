import { withBoxProps } from '../../../core'
import ActionIconGroupSectionComponent, { varsResolver } from './ActionIconGroupSection.vue'
import classes from '../ActionIcon.module.css'

export const ActionIconGroupSection = withBoxProps(ActionIconGroupSectionComponent)
Object.assign(ActionIconGroupSection, { classes, varsResolver })

export type {
  ActionIconGroupSectionCssVariables,
  ActionIconGroupSectionOwnProps,
  ActionIconGroupSectionProps,
  ActionIconGroupSectionSlots,
  ActionIconGroupSectionStylesNames,
} from './ActionIconGroupSection.types'
