import ColorPickerComponent, { varsResolver } from './ColorPicker.vue'
import classes from './ColorPicker.module.css'

export const ColorPicker = Object.assign(ColorPickerComponent, { classes, varsResolver })

export type {
  ColorPickerCssVariables,
  ColorPickerOwnProps,
  ColorPickerProps,
  ColorPickerStylesNames,
} from './ColorPicker.props.types'
