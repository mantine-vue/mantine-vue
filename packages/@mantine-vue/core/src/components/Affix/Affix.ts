import { withBoxProps } from '../../core'
import AffixComponent, { varsResolver } from './Affix.vue'
import classes from './Affix.module.css'

export const Affix = withBoxProps(AffixComponent)
Object.assign(Affix, { classes, varsResolver })

export type {
  AffixOwnProps,
  AffixPosition,
  AffixProps,
  AffixSlots,
  AffixStylesNames,
} from './Affix.types'
