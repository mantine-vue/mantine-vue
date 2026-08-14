import { factory } from '../../../core'
import EmptyStateIndicatorComponent from './EmptyStateIndicator.vue'
import type { EmptyStateIndicatorFactory } from './EmptyStateIndicator.types'
import classes from '../EmptyState.module.css'

export const EmptyStateIndicator = factory<EmptyStateIndicatorFactory>(
  EmptyStateIndicatorComponent,
  { classes },
)

export type {
  EmptyStateIndicatorOwnProps,
  EmptyStateIndicatorProps,
  EmptyStateIndicatorSlots,
  EmptyStateIndicatorStylesNames,
  EmptyStateIndicatorFactory,
} from './EmptyStateIndicator.types'
