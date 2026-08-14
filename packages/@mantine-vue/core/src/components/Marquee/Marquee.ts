import { factory } from '../../core'
import MarqueeComponent, { varsResolver } from './Marquee.vue'
import type { MarqueeFactory } from './Marquee.types'
import classes from './Marquee.module.css'

export const Marquee = factory<MarqueeFactory>(MarqueeComponent, { classes, varsResolver })

export type {
  MarqueeCssVariables,
  MarqueeOwnProps,
  MarqueeProps,
  MarqueeSlots,
  MarqueeStylesNames,
  MarqueeFactory,
} from './Marquee.types'
