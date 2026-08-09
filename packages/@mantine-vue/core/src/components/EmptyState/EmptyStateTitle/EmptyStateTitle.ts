import { withBoxProps } from '../../../core'
import EmptyStateTitleComponent from './EmptyStateTitle.vue'
import classes from '../EmptyState.module.css'

export const EmptyStateTitle = withBoxProps(EmptyStateTitleComponent)
Object.assign(EmptyStateTitle, { classes })

export type {
  EmptyStateTitleOwnProps,
  EmptyStateTitleProps,
  EmptyStateTitleSlots,
  EmptyStateTitleStylesNames,
} from './EmptyStateTitle.types'
