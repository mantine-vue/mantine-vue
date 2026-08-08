import { withBoxProps } from '../../core'
import TextComponent, { varsResolver } from './Text.vue'
import classes from './Text.module.css'
export const Text = withBoxProps(TextComponent)
Object.assign(Text, { classes, varsResolver })
export type {
  TextCssVariables,
  TextOwnProps,
  TextProps,
  TextSlots,
  TextStylesNames,
  TextTruncate,
  TextVariant,
} from './Text.types'
