import { factory } from '../../../core'
import EmptyStateActionsComponent from './EmptyStateActions.vue'
import type { EmptyStateActionsFactory } from './EmptyStateActions.types'
import classes from '../EmptyState.module.css'

export const EmptyStateActions = factory<EmptyStateActionsFactory>(EmptyStateActionsComponent, {
  classes,
})

export type {
  EmptyStateActionsOwnProps,
  EmptyStateActionsProps,
  EmptyStateActionsSlots,
  EmptyStateActionsStylesNames,
  EmptyStateActionsFactory,
} from './EmptyStateActions.types'
