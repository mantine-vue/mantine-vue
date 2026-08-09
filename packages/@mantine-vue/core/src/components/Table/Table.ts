import { withBoxProps } from '../../core'
import TableComponent, { varsResolver } from './Table.vue'
import {
  TableCaption,
  TableTbody,
  TableTd,
  TableTfoot,
  TableTh,
  TableThead,
  TableTr,
} from './Table.components'
import { TableDataRenderer } from './TableDataRenderer'
import { TableScrollContainer } from './TableScrollContainer'
import classes from './Table.module.css'

export const Table = withBoxProps(
  Object.assign(TableComponent, {
    classes,
    varsResolver,
    Thead: TableThead,
    Tbody: TableTbody,
    Tfoot: TableTfoot,
    Td: TableTd,
    Th: TableTh,
    Tr: TableTr,
    Caption: TableCaption,
    ScrollContainer: TableScrollContainer,
    DataRenderer: TableDataRenderer,
  }),
)

export type {
  TableCssVariables,
  TableData,
  TableOwnProps,
  TableProps,
  TableSlots,
  TableStylesNames,
  TableVariant,
} from './Table.types'
