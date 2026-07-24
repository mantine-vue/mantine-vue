import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  useProps,
  useRandomClassName,
  type AlignItems,
  type StyleProp,
} from '../../../core'
import { useGridContext } from '../Grid.context'
import { GridColVariables, type ColSpan } from './GridColVariables'

const defaultProps = {
  span: 12,
} as const

export const GridCol = withBoxProps(
  defineComponent({
    name: 'GridCol',
    inheritAttrs: false,
    props: {
      span: { type: [Number, String, Object] as PropType<StyleProp<ColSpan>>, default: undefined },
      order: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
      offset: { type: [Number, Object] as PropType<StyleProp<number>>, default: undefined },
      align: { type: [String, Object] as PropType<StyleProp<AlignItems>>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('GridCol', defaultProps, rawProps)
      const ctx = useGridContext()
      const responsiveClassName = useRandomClassName()

      return () => [
        h(GridColVariables, {
          selector: `.${responsiveClassName}`,
          span: props.span,
          order: props.order,
          offset: props.offset,
          align: props.align,
        }),
        h(
          Box,
          {
            ...attrs,
            ...ctx.getStyles('col', {
              className: [attrs.class, responsiveClassName],
              style: attrs.style as any,
            }),
          },
          () => slots.default?.(),
        ),
      ]
    },
  }),
)
