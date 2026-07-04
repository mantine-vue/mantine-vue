import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  getThemeColor,
  rem,
  useProps,
  useStyles,
} from '../../core'
import {
  TableCaption,
  TableTbody,
  TableTd,
  TableTfoot,
  TableTh,
  TableThead,
  TableTr,
} from './Table.components'
import { provideTableContext } from './Table.context'
import { TableDataRenderer } from './TableDataRenderer'
import { TableScrollContainer } from './TableScrollContainer'
import classes from './Table.module.css'

export type TableVariant = 'default' | 'vertical'
export type TableStylesNames =
  | 'table'
  | 'thead'
  | 'tbody'
  | 'tfoot'
  | 'tr'
  | 'th'
  | 'td'
  | 'caption'

export interface TableData {
  head?: any[]
  body?: any[][]
  foot?: any[]
  caption?: string
}

const defaultProps = {
  withRowBorders: true,
  verticalSpacing: 7,
} as const

const varsResolver = createVarsResolver<any>(
  (
    theme,
    {
      layout,
      captionSide,
      horizontalSpacing,
      verticalSpacing,
      borderColor,
      stripedColor,
      highlightOnHoverColor,
      striped,
      highlightOnHover,
      stickyHeaderOffset,
      stickyHeader,
    },
  ) => ({
    table: {
      '--table-layout': layout,
      '--table-caption-side': captionSide,
      '--table-horizontal-spacing': getSpacing(horizontalSpacing),
      '--table-vertical-spacing': getSpacing(verticalSpacing),
      '--table-border-color': borderColor ? getThemeColor(borderColor, theme) : undefined,
      '--table-striped-color':
        striped && stripedColor ? getThemeColor(stripedColor, theme) : undefined,
      '--table-highlight-on-hover-color':
        highlightOnHover && highlightOnHoverColor
          ? getThemeColor(highlightOnHoverColor, theme)
          : undefined,
      '--table-sticky-header-offset': stickyHeader ? rem(stickyHeaderOffset) : undefined,
    },
  }),
)

const TableBase = defineComponent({
  name: 'Table',
  inheritAttrs: false,
  props: {
    layout: { type: String as PropType<string>, default: undefined },
    captionSide: { type: String as PropType<'top' | 'bottom'>, default: undefined },
    borderColor: { type: String, default: undefined },
    withTableBorder: { type: Boolean, default: false },
    withColumnBorders: { type: Boolean, default: false },
    withRowBorders: { type: Boolean, default: undefined },
    horizontalSpacing: { type: [String, Number] as PropType<string | number>, default: undefined },
    verticalSpacing: { type: [String, Number] as PropType<string | number>, default: undefined },
    striped: { type: [Boolean, String] as PropType<boolean | 'odd' | 'even'>, default: false },
    stripedColor: { type: String, default: undefined },
    highlightOnHover: { type: Boolean, default: false },
    highlightOnHoverColor: { type: String, default: undefined },
    data: { type: Object as PropType<TableData>, default: undefined },
    stickyHeader: { type: Boolean, default: false },
    stickyHeaderOffset: { type: [String, Number] as PropType<string | number>, default: undefined },
    tabularNums: { type: Boolean, default: false },
    variant: { type: String as PropType<TableVariant>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Table', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'Table',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    provideTableContext({
      getStyles,
      get stickyHeader() {
        return props.stickyHeader
      },
      get striped() {
        return props.striped === true ? 'odd' : props.striped || undefined
      },
      get highlightOnHover() {
        return props.highlightOnHover
      },
      get withColumnBorders() {
        return props.withColumnBorders
      },
      get withRowBorders() {
        return props.withRowBorders
      },
      get captionSide() {
        return props.captionSide || 'bottom'
      },
    })

    return () =>
      h(
        Box,
        {
          ...attrs,
          component: 'table',
          variant: props.variant,
          mod: [
            {
              withTableBorder: props.withTableBorder,
              tabularNums: props.tabularNums,
            },
            props.mod,
          ],
          ...getStyles('table', {
            className: attrs.class,
            style: attrs.style as any,
          }),
        },
        () =>
          slots.default
            ? slots.default()
            : props.data
              ? h(TableDataRenderer, { data: props.data })
              : null,
      )
  },
})

export const Table = withBoxProps(
  Object.assign(TableBase, {
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
