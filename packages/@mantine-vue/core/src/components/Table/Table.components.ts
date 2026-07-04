import { defineComponent, h, type PropType } from 'vue'
import { Box, useProps } from '../../core'
import { useTableContext, type TableContextValue } from './Table.context'
import classes from './Table.module.css'

interface TableElementOptions {
  columnBorder?: true
  rowBorder?: true
  striped?: true
  highlightOnHover?: true
  captionSide?: true
  stickyHeader?: true
}

function getDataAttributes(ctx: TableContextValue, options?: TableElementOptions) {
  if (!options) {
    return undefined
  }

  const data: Record<string, boolean | string | undefined> = {}

  if (options.columnBorder && ctx.withColumnBorders) {
    data['data-with-column-border'] = true
  }

  if (options.rowBorder && ctx.withRowBorders) {
    data['data-with-row-border'] = true
  }

  if (options.striped && ctx.striped) {
    data['data-striped'] = ctx.striped
  }

  if (options.highlightOnHover && ctx.highlightOnHover) {
    data['data-hover'] = true
  }

  if (options.captionSide && ctx.captionSide) {
    data['data-side'] = ctx.captionSide
  }

  if (options.stickyHeader && ctx.stickyHeader) {
    data['data-sticky'] = true
  }

  return data
}

export function tableElement(
  element: 'th' | 'td' | 'tr' | 'thead' | 'tbody' | 'tfoot' | 'caption',
  options?: TableElementOptions,
) {
  const name = `Table${element.charAt(0).toUpperCase()}${element.slice(1)}`

  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      className: { type: [String, Array, Object] as PropType<any>, default: undefined },
      style: { type: [String, Array, Object] as PropType<any>, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps(name, {}, rawProps)
      const ctx = useTableContext()

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: element,
            ...getDataAttributes(ctx, options),
            ...ctx.getStyles(element, {
              className: [props.className, attrs.class],
              style: [props.style, attrs.style],
              props,
            }),
          },
          () => slots.default?.(),
        )
    },
  })
}

export const TableTh = Object.assign(tableElement('th', { columnBorder: true }), { classes })
export const TableTd = Object.assign(tableElement('td', { columnBorder: true }), { classes })
export const TableTr = Object.assign(
  tableElement('tr', {
    rowBorder: true,
    striped: true,
    highlightOnHover: true,
  }),
  { classes },
)
export const TableThead = Object.assign(tableElement('thead', { stickyHeader: true }), { classes })
export const TableTbody = Object.assign(tableElement('tbody'), { classes })
export const TableTfoot = Object.assign(tableElement('tfoot'), { classes })
export const TableCaption = Object.assign(tableElement('caption', { captionSide: true }), {
  classes,
})
