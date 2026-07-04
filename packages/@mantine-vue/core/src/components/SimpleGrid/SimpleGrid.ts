import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, useProps, useRandomClassName, useStyles } from '../../core'
import { SimpleGridContainerVariables, SimpleGridMediaVariables } from './SimpleGridVariables'
import classes from './SimpleGrid.module.css'

type StyleProp<T> = T | Partial<Record<string, T>>

const defaultProps = {
  cols: 1,
  spacing: 'md',
  type: 'media',
} as const

export const SimpleGrid = withBoxProps(
  defineComponent({
    name: 'SimpleGrid',
    inheritAttrs: false,
    props: {
      cols: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
      spacing: {
        type: [String, Number, Object] as PropType<StyleProp<string | number>>,
        default: undefined,
      },
      verticalSpacing: {
        type: [String, Number, Object] as PropType<StyleProp<string | number>>,
        default: undefined,
      },
      type: { type: String as PropType<'media' | 'container'>, default: undefined },
      minColWidth: [String, Number] as PropType<string | number>,
      autoFlow: { type: String as PropType<'auto-fit' | 'auto-fill'>, default: undefined },
      autoRows: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('SimpleGrid', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'SimpleGrid',
        props,
        classes,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        unstyled: props.unstyled,
      })
      const responsiveClassName = useRandomClassName()

      return () => {
        const autoColsAttr =
          props.minColWidth !== undefined ? props.autoFlow || 'auto-fill' : undefined
        const variablesProps = {
          selector: `.${responsiveClassName}`,
          cols: props.cols,
          spacing: props.spacing,
          verticalSpacing: props.verticalSpacing,
          minColWidth: props.minColWidth,
          autoRows: props.autoRows,
        }
        const root = h(
          Box,
          {
            ...attrs,
            ...getStyles('root', { className: responsiveClassName }),
            'data-auto-cols': autoColsAttr,
          },
          () => slots.default?.(),
        )

        if (props.type === 'container') {
          return [
            h(SimpleGridContainerVariables, variablesProps),
            h('div', getStyles('container'), root),
          ]
        }

        return [h(SimpleGridMediaVariables, variablesProps), root]
      }
    },
  }),
)
