import { factory } from '../../../core'
import EmptyStateDescriptionComponent from './EmptyStateDescription.vue'
import type { EmptyStateDescriptionFactory } from './EmptyStateDescription.types'
import classes from '../EmptyState.module.css'

export const EmptyStateDescription = factory<EmptyStateDescriptionFactory>(
  EmptyStateDescriptionComponent,
  { classes },
)

export type {
  EmptyStateDescriptionOwnProps,
  EmptyStateDescriptionProps,
  EmptyStateDescriptionSlots,
  EmptyStateDescriptionStylesNames,
  EmptyStateDescriptionFactory,
} from './EmptyStateDescription.types'
