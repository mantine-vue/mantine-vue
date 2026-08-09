import { withBoxProps } from '../../../core'
import AppShellSectionComponent from './AppShellSection.vue'
import classes from '../AppShell.module.css'

export const AppShellSection = withBoxProps(AppShellSectionComponent)
Object.assign(AppShellSection, { classes })

export type {
  AppShellSectionOwnProps,
  AppShellSectionProps,
  AppShellSectionSlots,
} from './AppShellSection.types'
