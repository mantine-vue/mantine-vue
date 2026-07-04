import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, rem, useProps, useStyles } from '../../core'
import { ScrollArea, type ScrollAreaProps } from '../ScrollArea'
import classes from './Table.module.css'

export type TableScrollContainerStylesNames = 'scrollContainer' | 'scrollContainerInner'

export interface TableScrollContainerProps {
  minWidth: string | number
  maxHeight?: string | number
  type?: 'native' | 'scrollarea'
  scrollAreaProps?: Partial<ScrollAreaProps> & Record<string, any>
}

const defaultProps = {
  type: 'scrollarea',
} as const

const varsResolver = createVarsResolver<any>((_, { minWidth, maxHeight, type }) => ({
  scrollContainer: {
    '--table-min-width': rem(minWidth),
    '--table-max-height': rem(maxHeight),
    '--table-overflow': type === 'native' ? 'auto' : undefined,
  },
}))

export const TableScrollContainer = withBoxProps(
  defineComponent({
    name: 'TableScrollContainer',
    inheritAttrs: false,
    props: {
      minWidth: { type: [String, Number] as PropType<string | number>, required: true },
      maxHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
      type: { type: String as PropType<'native' | 'scrollarea'>, default: undefined },
      scrollAreaProps: {
        type: Object as PropType<TableScrollContainerProps['scrollAreaProps']>,
        default: undefined,
      },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('TableScrollContainer', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'TableScrollContainer',
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

      return () => {
        const content = () => h('div', getStyles('scrollContainerInner'), slots.default?.())

        if (props.type === 'scrollarea') {
          return h(
            ScrollArea as any,
            {
              ...(props.maxHeight
                ? { offsetScrollbars: 'xy', ...props.scrollAreaProps }
                : { offsetScrollbars: 'x', ...props.scrollAreaProps }),
              ...getStyles('scrollContainer'),
            },
            content,
          )
        }

        return h(Box, { component: 'div', ...getStyles('scrollContainer') }, content)
      }
    },
  }),
)

Object.assign(TableScrollContainer, { classes, varsResolver })
