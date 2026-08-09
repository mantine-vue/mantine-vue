import { withBoxProps } from '../../core'
import ImageComponent, { varsResolver } from './Image.vue'
import classes from './Image.module.css'
export const Image = withBoxProps(ImageComponent)
Object.assign(Image, { classes, varsResolver })
export type {
  ImageCssVariables,
  ImageEmits,
  ImageOwnProps,
  ImageProps,
  ImageStylesNames,
} from './Image.types'
