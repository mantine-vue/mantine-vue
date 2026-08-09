import { withBoxProps } from '../../core'
import ThemeIconComponent from './ThemeIcon.vue'

export const ThemeIcon = withBoxProps(ThemeIconComponent)

export type {
  ThemeIconCssVariables,
  ThemeIconOwnProps,
  ThemeIconProps,
  ThemeIconSlots,
  ThemeIconStylesNames,
  ThemeIconVariant,
} from './ThemeIcon.types'
