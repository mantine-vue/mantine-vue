import { withBoxProps } from '../../core'
import TableOfContentsComponent, { varsResolver } from './TableOfContents.vue'
import classes from './TableOfContents.module.css'
export const TableOfContents = withBoxProps(TableOfContentsComponent)
Object.assign(TableOfContents, { classes, varsResolver })
export type {
  InitialTableOfContentsData,
  TableOfContentsCssVariables,
  TableOfContentsOwnProps,
  TableOfContentsProps,
  TableOfContentsStylesNames,
  TableOfContentsVariant,
} from './TableOfContents.types'
