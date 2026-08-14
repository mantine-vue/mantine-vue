import { factory } from '../../core'
import ScrollerComponent, { varsResolver } from './Scroller.vue'
import type { ScrollerFactory } from './Scroller.types'
import classes from './Scroller.module.css'

export const Scroller = factory<ScrollerFactory>(ScrollerComponent, {
  classes,
  varsResolver,
})

export type {
  ScrollerCssVariables,
  ScrollerFactory,
  ScrollerOwnProps,
  ScrollerProps,
  ScrollerSlots,
  ScrollerStylesNames,
} from './Scroller.types'
