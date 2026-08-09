import { withBoxProps } from '../../core'
import NavLinkComponent, { varsResolver } from './NavLink.vue'
import classes from './NavLink.module.css'

export const NavLink = withBoxProps(NavLinkComponent)
Object.assign(NavLink, { classes, varsResolver })

export type {
  NavLinkOwnProps,
  NavLinkProps,
  NavLinkSlots,
  NavLinkStylesNames,
  NavLinkVariant,
} from './NavLink.types'
