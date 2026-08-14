import { factory } from '../../core'
import BurgerComponent, { varsResolver } from './Burger.vue'
import type { BurgerFactory } from './Burger.types'
import classes from './Burger.module.css'

export const Burger = factory<BurgerFactory>(BurgerComponent, { classes, varsResolver })

export type {
  BurgerCssVariables,
  BurgerOwnProps,
  BurgerProps,
  BurgerSlots,
  BurgerStylesNames,
  BurgerFactory,
} from './Burger.types'
