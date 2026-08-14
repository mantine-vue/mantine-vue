import { factory } from '../../../core'
import EmptyStateTitleComponent from './EmptyStateTitle.vue'
import type { EmptyStateTitleFactory } from './EmptyStateTitle.types'
import classes from '../EmptyState.module.css'

export const EmptyStateTitle = factory<EmptyStateTitleFactory>(EmptyStateTitleComponent, {
  classes,
})

export type {
  EmptyStateTitleOwnProps,
  EmptyStateTitleProps,
  EmptyStateTitleSlots,
  EmptyStateTitleStylesNames,
  EmptyStateTitleFactory,
} from './EmptyStateTitle.types'
