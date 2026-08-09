import { polymorphicFactory } from '../../core'
import ImageComponent, { varsResolver } from './Image.vue'
import type { ImageFactory } from './Image.types'
import classes from './Image.module.css'

export const Image = polymorphicFactory<ImageFactory>(ImageComponent, {
  classes,
  varsResolver,
})

export type {
  ImageCssVariables,
  ImageEmits,
  ImageFactory,
  ImageOwnProps,
  ImageProps,
  ImageStylesNames,
} from './Image.types'
