import { polymorphicFactory } from '../../core'
import ColorSwatchComponent, { varsResolver } from './ColorSwatch.vue'
import type { ColorSwatchFactory } from './ColorSwatch.types'
import classes from './ColorSwatch.module.css'

export const ColorSwatch = polymorphicFactory<ColorSwatchFactory>(ColorSwatchComponent, {
  classes,
  varsResolver,
})

export type {
  ColorSwatchCssVariables,
  ColorSwatchFactory,
  ColorSwatchOwnProps,
  ColorSwatchProps,
  ColorSwatchSlots,
  ColorSwatchStylesNames,
} from './ColorSwatch.types'
