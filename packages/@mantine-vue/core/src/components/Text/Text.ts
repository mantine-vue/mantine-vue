import { polymorphicFactory } from '../../core'
import TextComponent, { varsResolver } from './Text.vue'
import type { TextFactory } from './Text.types'
import classes from './Text.module.css'

export const Text = polymorphicFactory<TextFactory>(TextComponent, {
  classes,
  varsResolver,
})

export type {
  TextCssVariables,
  TextFactory,
  TextOwnProps,
  TextProps,
  TextSlots,
  TextStylesNames,
  TextTruncate,
  TextVariant,
} from './Text.types'
