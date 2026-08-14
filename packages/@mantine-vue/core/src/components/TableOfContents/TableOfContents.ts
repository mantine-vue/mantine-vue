import { factory } from '../../core'
import type { TableOfContentsFactory } from './TableOfContents.types'
import TableOfContentsComponent, { varsResolver } from './TableOfContents.vue'
import classes from './TableOfContents.module.css'
export const TableOfContents = factory<TableOfContentsFactory>(TableOfContentsComponent, {
  classes,
  varsResolver,
})
export type {
  InitialTableOfContentsData,
  TableOfContentsCssVariables,
  TableOfContentsFactory,
  TableOfContentsOwnProps,
  TableOfContentsProps,
  TableOfContentsStylesNames,
  TableOfContentsVariant,
} from './TableOfContents.types'
