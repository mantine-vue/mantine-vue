import { withBoxProps } from '../../core'
import MarqueeComponent, { varsResolver } from './Marquee.vue'
import classes from './Marquee.module.css'

export const Marquee = withBoxProps(MarqueeComponent)
Object.assign(Marquee, { classes, varsResolver })

export type {
  MarqueeCssVariables,
  MarqueeOwnProps,
  MarqueeProps,
  MarqueeSlots,
  MarqueeStylesNames,
} from './Marquee.types'
