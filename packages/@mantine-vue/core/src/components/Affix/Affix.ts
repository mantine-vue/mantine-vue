import { factory } from '../../core'
import type { AffixFactory } from './Affix.types'
import AffixComponent, { varsResolver } from './Affix.vue'
import classes from './Affix.module.css'

export const Affix = factory<AffixFactory>(AffixComponent, { classes, varsResolver })

export type {
  AffixCssVariables,
  AffixFactory,
  AffixOwnProps,
  AffixPosition,
  AffixProps,
  AffixSlots,
  AffixStylesNames,
} from './Affix.types'
