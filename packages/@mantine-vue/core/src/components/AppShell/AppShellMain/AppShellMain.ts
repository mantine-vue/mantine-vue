import { factory } from '../../../core'
import AppShellMainComponent from './AppShellMain.vue'
import type { AppShellMainFactory } from './AppShellMain.types'
import classes from '../AppShell.module.css'

export const AppShellMain = factory<AppShellMainFactory>(AppShellMainComponent, {
  classes,
})

export type {
  AppShellMainOwnProps,
  AppShellMainProps,
  AppShellMainSlots,
  AppShellMainStylesNames,
  AppShellMainFactory,
} from './AppShellMain.types'
