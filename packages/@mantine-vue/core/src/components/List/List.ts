import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  getLineHeight,
  getSpacing,
  useProps,
  useStyles,
} from '../../core'
import { ListItem } from './ListItem/ListItem'
import { provideListContext } from './List.context'
import classes from './List.module.css'

const defaultProps = {
  type: 'unordered',
} as const

const varsResolver = createVarsResolver<any>((_, { size, spacing }) => ({
  root: {
    '--list-fz': getFontSize(size),
    '--list-lh': getLineHeight(size),
    '--list-spacing': getSpacing(spacing),
  },
}))

const ListBase = defineComponent({
  name: 'List',
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<'ordered' | 'unordered'>, default: undefined },
    withPadding: { type: Boolean, default: false },
    size: { type: String, default: undefined },
    icon: { type: [String, Number, Object, Function], default: undefined },
    spacing: [String, Number] as PropType<string | number>,
    center: { type: Boolean, default: false },
    listStyleType: { type: String, default: undefined },
    start: { type: Number, default: undefined },
    reversed: { type: Boolean, default: false },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('List', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'List',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      vars: props.vars as any,
      varsResolver,
      unstyled: props.unstyled,
    })

    provideListContext({
      getStyles,
      center: props.center,
      icon: props.icon,
    })

    return () =>
      h(
        Box,
        {
          ...attrs,
          ...getStyles('root', { style: { listStyleType: props.listStyleType } }),
          component: props.type === 'unordered' ? 'ul' : 'ol',
          start: props.type === 'ordered' ? props.start : undefined,
          reversed: props.type === 'ordered' && props.reversed ? '' : undefined,
          mod: [
            {
              withPadding: props.withPadding,
              type: props.icon ? 'none' : props.listStyleType,
            },
            props.mod,
          ],
        },
        () => slots.default?.(),
      )
  },
})

export const List = withBoxProps(
  Object.assign(ListBase, {
    Item: ListItem,
  }),
)
