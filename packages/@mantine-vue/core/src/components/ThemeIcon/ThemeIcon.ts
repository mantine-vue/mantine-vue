import { factory } from '../../core'
import ThemeIconComponent, { varsResolver } from './ThemeIcon.vue'
import type { ThemeIconFactory } from './ThemeIcon.types'
import classes from './ThemeIcon.module.css'

export const ThemeIcon = factory<ThemeIconFactory>(ThemeIconComponent, {
  classes,
  varsResolver,
})

export type {
  ThemeIconCssVariables,
  ThemeIconFactory,
  ThemeIconOwnProps,
  ThemeIconProps,
  ThemeIconSlots,
  ThemeIconStylesNames,
  ThemeIconVariant,
} from './ThemeIcon.types'
