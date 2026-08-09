import { polymorphicFactory } from '../../core'
import NavLinkComponent, { varsResolver } from './NavLink.vue'
import type { NavLinkFactory } from './NavLink.types'
import classes from './NavLink.module.css'

export const NavLink = polymorphicFactory<NavLinkFactory>(NavLinkComponent, {
  classes,
  varsResolver,
})

export type {
  NavLinkCssVariables,
  NavLinkEmits,
  NavLinkFactory,
  NavLinkOwnProps,
  NavLinkProps,
  NavLinkSlots,
  NavLinkStylesNames,
  NavLinkVariant,
} from './NavLink.types'
