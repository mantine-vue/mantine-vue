import { withBoxProps } from '../../../core'
import EmptyStateIndicatorComponent from './EmptyStateIndicator.vue'
import classes from '../EmptyState.module.css'

export const EmptyStateIndicator = withBoxProps(EmptyStateIndicatorComponent)
Object.assign(EmptyStateIndicator, { classes })

export type {
  EmptyStateIndicatorOwnProps,
  EmptyStateIndicatorProps,
  EmptyStateIndicatorSlots,
  EmptyStateIndicatorStylesNames,
} from './EmptyStateIndicator.types'
