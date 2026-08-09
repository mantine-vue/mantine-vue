import { withBoxProps } from '../../core'
import ColorSwatchComponent, { varsResolver } from './ColorSwatch.vue'
import classes from './ColorSwatch.module.css'

export const ColorSwatch = withBoxProps(ColorSwatchComponent)
Object.assign(ColorSwatch, { classes, varsResolver })

export type {
  ColorSwatchCssVariables,
  ColorSwatchOwnProps,
  ColorSwatchProps,
  ColorSwatchSlots,
  ColorSwatchStylesNames,
} from './ColorSwatch.types'
