import { polymorphicFactory } from '../../../core'
import AppShellSectionComponent from './AppShellSection.vue'
import type { AppShellSectionFactory } from './AppShellSection.types'
import classes from '../AppShell.module.css'

export const AppShellSection = polymorphicFactory<AppShellSectionFactory>(
  AppShellSectionComponent,
  {
    classes,
  },
)

export type {
  AppShellSectionFactory,
  AppShellSectionOwnProps,
  AppShellSectionProps,
  AppShellSectionSlots,
  AppShellSectionStylesNames,
} from './AppShellSection.types'
