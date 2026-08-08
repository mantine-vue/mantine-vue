import { withBoxProps } from '../../../core'
import AppShellMainComponent from './AppShellMain.vue'
import classes from '../AppShell.module.css'

export const AppShellMain = withBoxProps(Object.assign(AppShellMainComponent, { classes }))

export type {
  AppShellMainOwnProps,
  AppShellMainProps,
  AppShellMainSlots,
  AppShellMainStylesNames,
} from './AppShellMain.types'
