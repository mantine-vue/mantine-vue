import { withBoxProps } from '../../../core'
import EmptyStateActionsComponent from './EmptyStateActions.vue'
import classes from '../EmptyState.module.css'

export const EmptyStateActions = withBoxProps(EmptyStateActionsComponent)
Object.assign(EmptyStateActions, { classes })

export type {
  EmptyStateActionsOwnProps,
  EmptyStateActionsProps,
  EmptyStateActionsSlots,
  EmptyStateActionsStylesNames,
} from './EmptyStateActions.types'
