import { polymorphicFactory } from '../../core'
import BackgroundImageComponent, { varsResolver } from './BackgroundImage.vue'
import type { BackgroundImageFactory } from './BackgroundImage.types'
import classes from './BackgroundImage.module.css'

export const BackgroundImage = polymorphicFactory<BackgroundImageFactory>(
  BackgroundImageComponent,
  {
    classes,
    varsResolver,
  },
)

export type {
  BackgroundImageCssVariables,
  BackgroundImageFactory,
  BackgroundImageOwnProps,
  BackgroundImageProps,
  BackgroundImageSlots,
  BackgroundImageStylesNames,
} from './BackgroundImage.types'
