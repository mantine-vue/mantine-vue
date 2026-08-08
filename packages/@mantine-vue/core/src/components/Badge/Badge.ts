import { withBoxProps } from '../../core'
import BadgeComponent from './Badge.vue'

export const Badge = withBoxProps(BadgeComponent)

export type {
  BadgeCssVariables,
  BadgeOwnProps,
  BadgeProps,
  BadgeSlots,
  BadgeStylesNames,
  BadgeVariant,
} from './Badge.types'
