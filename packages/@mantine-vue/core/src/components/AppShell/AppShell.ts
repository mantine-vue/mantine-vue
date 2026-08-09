import { withBoxProps } from '../../core'
import AppShellComponent, { varsResolver } from './AppShell.vue'
import { AppShellAside } from './AppShellAside/AppShellAside'
import { AppShellFooter } from './AppShellFooter/AppShellFooter'
import { AppShellHeader } from './AppShellHeader/AppShellHeader'
import { AppShellMain } from './AppShellMain/AppShellMain'
import { AppShellNavbar } from './AppShellNavbar/AppShellNavbar'
import { AppShellSection } from './AppShellSection/AppShellSection'
import classes from './AppShell.module.css'

export type AppShellStylesNames =
  | 'root'
  | 'navbar'
  | 'main'
  | 'header'
  | 'footer'
  | 'aside'
  | 'section'

export const AppShell = withBoxProps(
  Object.assign(AppShellComponent, {
    classes,
    varsResolver,
    Navbar: AppShellNavbar,
    Header: AppShellHeader,
    Main: AppShellMain,
    Aside: AppShellAside,
    Footer: AppShellFooter,
    Section: AppShellSection,
  }),
)
