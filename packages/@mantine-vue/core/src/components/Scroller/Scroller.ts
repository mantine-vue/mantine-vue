import { withBoxProps } from '../../core'
import ScrollerComponent, { varsResolver } from './Scroller.vue'
import classes from './Scroller.module.css'

export const Scroller = withBoxProps(ScrollerComponent)
Object.assign(Scroller, { classes, varsResolver })

export type {
  ScrollerCssVariables,
  ScrollerOwnProps,
  ScrollerProps,
  ScrollerSlots,
  ScrollerStylesNames,
} from './Scroller.types'
