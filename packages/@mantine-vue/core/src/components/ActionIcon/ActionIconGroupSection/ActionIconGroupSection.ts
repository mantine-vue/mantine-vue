import { factory } from '../../../core'
import ActionIconGroupSectionComponent, { varsResolver } from './ActionIconGroupSection.vue'
import type { ActionIconGroupSectionFactory } from './ActionIconGroupSection.types'
import classes from '../ActionIcon.module.css'

export const ActionIconGroupSection = factory<ActionIconGroupSectionFactory>(
  ActionIconGroupSectionComponent,
  { classes, varsResolver },
)

export type {
  ActionIconGroupSectionCssVariables,
  ActionIconGroupSectionOwnProps,
  ActionIconGroupSectionProps,
  ActionIconGroupSectionSlots,
  ActionIconGroupSectionStylesNames,
  ActionIconGroupSectionFactory,
} from './ActionIconGroupSection.types'
