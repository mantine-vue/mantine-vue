import { factory } from '../../core'
import AspectRatioComponent, { varsResolver } from './AspectRatio.vue'
import type { AspectRatioFactory } from './AspectRatio.types'
import classes from './AspectRatio.module.css'

export const AspectRatio = factory<AspectRatioFactory>(AspectRatioComponent, {
  classes,
  varsResolver,
})

export type { AspectRatioOwnProps, AspectRatioProps, AspectRatioFactory } from './AspectRatio.types'
