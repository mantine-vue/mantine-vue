import { polymorphicFactory } from '../../core'
import BadgeComponent, { varsResolver } from './Badge.vue'
import type { BadgeFactory } from './Badge.types'
import classes from './Badge.module.css'

export const Badge = polymorphicFactory<BadgeFactory>(BadgeComponent, {
  classes,
  varsResolver,
})

export type {
  BadgeCssVariables,
  BadgeFactory,
  BadgeOwnProps,
  BadgeProps,
  BadgeSlots,
  BadgeStylesNames,
  BadgeVariant,
} from './Badge.types'
