import { factory } from '../../core'
import EmptyStateComponent, { varsResolver } from './EmptyState.vue'
import type { EmptyStateFactory } from './EmptyState.types'
import { EmptyStateActions } from './EmptyStateActions/EmptyStateActions'
import { EmptyStateDescription } from './EmptyStateDescription/EmptyStateDescription'
import { EmptyStateIndicator } from './EmptyStateIndicator/EmptyStateIndicator'
import { EmptyStateTitle } from './EmptyStateTitle/EmptyStateTitle'
import classes from './EmptyState.module.css'

export const EmptyState = factory<EmptyStateFactory>(EmptyStateComponent, {
  classes,
  varsResolver,
  Indicator: EmptyStateIndicator,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Actions: EmptyStateActions,
})

export type {
  EmptyStateCssVariables,
  EmptyStateOwnProps,
  EmptyStateProps,
  EmptyStateSlots,
  EmptyStateStylesNames,
  EmptyStateVariant,
  EmptyStateFactory,
} from './EmptyState.types'
