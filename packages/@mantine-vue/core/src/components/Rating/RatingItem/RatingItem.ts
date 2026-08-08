import { withBoxProps } from '../../../core'
import RatingItemComponent from './RatingItem.vue'

/** A single symbol of a `Rating`, including its hidden radio input. */
export const RatingItem = withBoxProps(RatingItemComponent)

export type { RatingItemOwnProps, RatingItemProps } from './RatingItem.types'
