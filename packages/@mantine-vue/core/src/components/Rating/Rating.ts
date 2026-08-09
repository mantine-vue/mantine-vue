import { withBoxProps } from '../../core'
import RatingComponent, { varsResolver } from './Rating.vue'
import classes from './Rating.module.css'

export const Rating = withBoxProps(Object.assign(RatingComponent, { classes, varsResolver }))

export type {
  RatingCssVariables,
  RatingOwnProps,
  RatingProps,
  RatingSlots,
  RatingStylesNames,
} from './Rating.types'
