import { factory } from '../../core'
import { ActionBarCloseButton } from './ActionBarCloseButton/ActionBarCloseButton'
import { ActionBarDivider } from './ActionBarDivider/ActionBarDivider'
import ActionBarComponent from './ActionBar.vue'
import type { ActionBarFactory } from './ActionBar.types'
import classes from './ActionBar.module.css'

export const ActionBar = factory<ActionBarFactory>(ActionBarComponent, {
  classes,
  Divider: ActionBarDivider,
  CloseButton: ActionBarCloseButton,
})

export type {
  ActionBarEmits,
  ActionBarFactory,
  ActionBarOwnProps,
  ActionBarProps,
  ActionBarSlots,
  ActionBarStylesNames,
} from './ActionBar.types'
