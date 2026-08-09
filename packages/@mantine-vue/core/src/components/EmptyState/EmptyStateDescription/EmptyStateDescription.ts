import { withBoxProps } from '../../../core'
import EmptyStateDescriptionComponent from './EmptyStateDescription.vue'
import classes from '../EmptyState.module.css'

export const EmptyStateDescription = withBoxProps(EmptyStateDescriptionComponent)
Object.assign(EmptyStateDescription, { classes })

export type {
  EmptyStateDescriptionOwnProps,
  EmptyStateDescriptionProps,
  EmptyStateDescriptionSlots,
  EmptyStateDescriptionStylesNames,
} from './EmptyStateDescription.types'
