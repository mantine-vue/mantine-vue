import classes from './Table.module.css'
import TableThComponent from './TableTh.vue'
import TableTdComponent from './TableTd.vue'
import TableTrComponent from './TableTr.vue'
import TableTheadComponent from './TableThead.vue'
import TableTbodyComponent from './TableTbody.vue'
import TableTfootComponent from './TableTfoot.vue'
import TableCaptionComponent from './TableCaption.vue'

/**
 * The seven table elements share `TableElement.vue`; each wrapper only fixes the tag it
 * renders, which `Table` options it reacts to, and its theme lookup name. Separate
 * named components rather than one with an `element` prop, because the names are public
 * and `findComponent({ name })` depends on them.
 */
export const TableTh = Object.assign(TableThComponent, { classes })
export const TableTd = Object.assign(TableTdComponent, { classes })
export const TableTr = Object.assign(TableTrComponent, { classes })
export const TableThead = Object.assign(TableTheadComponent, { classes })
export const TableTbody = Object.assign(TableTbodyComponent, { classes })
export const TableTfoot = Object.assign(TableTfootComponent, { classes })
export const TableCaption = Object.assign(TableCaptionComponent, { classes })

export type {
  TableElementName,
  TableElementOptions,
  TableElementOwnProps,
  TableElementProps,
  TableElementSlots,
} from './TableElement.types'

/** Every table element takes the same props; the names are kept for discoverability. */
export type {
  TableElementProps as TableThProps,
  TableElementProps as TableTdProps,
  TableElementProps as TableTrProps,
  TableElementProps as TableTheadProps,
  TableElementProps as TableTbodyProps,
  TableElementProps as TableTfootProps,
  TableElementProps as TableCaptionProps,
} from './TableElement.types'
