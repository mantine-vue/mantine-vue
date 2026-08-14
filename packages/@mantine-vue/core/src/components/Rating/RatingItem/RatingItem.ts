import { factory } from '../../../core'
import RatingItemComponent from './RatingItem.vue'
import type { RatingItemFactory } from './RatingItem.types'
import classes from '../Rating.module.css'

/** A single symbol of a `Rating`, including its hidden radio input. */
export const RatingItem = factory<RatingItemFactory>(RatingItemComponent, {
  classes,
})

export type { RatingItemOwnProps, RatingItemProps, RatingItemFactory } from './RatingItem.types'
