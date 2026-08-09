import { withBoxProps } from '../../core'
import BurgerComponent, { varsResolver } from './Burger.vue'
import classes from './Burger.module.css'

export const Burger = withBoxProps(BurgerComponent)
Object.assign(Burger, { classes, varsResolver })

export type {
  BurgerCssVariables,
  BurgerOwnProps,
  BurgerProps,
  BurgerSlots,
  BurgerStylesNames,
} from './Burger.types'
