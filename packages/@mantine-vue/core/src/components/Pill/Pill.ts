import { factory } from '../../core'
import PillComponent, { varsResolver } from './Pill.vue'
import type { PillFactory } from './Pill.types'
import { PillGroup } from './PillGroup/PillGroup'
import classes from './Pill.module.css'

export const Pill = factory<PillFactory>(PillComponent, { classes, varsResolver, Group: PillGroup })

export type {
  PillOwnProps,
  PillProps,
  PillSlots,
  PillStylesNames,
  PillVariant,
  PillFactory,
} from './Pill.types'
