import { factory } from '../../core'
import RatingComponent, { varsResolver } from './Rating.vue'
import type { RatingFactory } from './Rating.types'
import classes from './Rating.module.css'

export const Rating = factory<RatingFactory>(RatingComponent, {
  classes,
  varsResolver,
})

export type {
  RatingCssVariables,
  RatingFactory,
  RatingOwnProps,
  RatingProps,
  RatingSlots,
  RatingStylesNames,
} from './Rating.types'
