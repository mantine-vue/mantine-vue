import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  Text,
  type PropType,
  type VNode,
} from 'vue'
import { withBoxProps, Box, createVarsResolver, getSpacing, useProps, useStyles } from '../../core'
import classes from './Breadcrumbs.module.css'

const defaultProps = {
  separator: '/',
}

const varsResolver = createVarsResolver<any>((_, { separatorMargin }) => ({
  root: {
    '--bc-separator-margin': getSpacing(separatorMargin),
  },
}))

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

function flattenChildren(children: VNode[]): VNode[] {
  return children.flatMap((child) =>
    child.type === Fragment && Array.isArray(child.children)
      ? flattenChildren(child.children as VNode[])
      : child.type === Comment
        ? []
        : [child],
  )
}

export const Breadcrumbs = withBoxProps(
  defineComponent({
    name: 'Breadcrumbs',
    inheritAttrs: false,
    props: {
      separator: { type: [String, Number, Object, Function], default: undefined },
      separatorMargin: [String, Number] as PropType<string | number>,
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Breadcrumbs', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Breadcrumbs',
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

      return () => {
        const children = flattenChildren(slots.default?.() ?? [])
        const items = children.reduce<VNode[]>((acc, child, index) => {
          const item =
            child.type === Text
              ? h('div', getStyles('breadcrumb'), child.children as any)
              : cloneVNode(
                  child,
                  getStyles('breadcrumb', { className: (child.props as any)?.class }),
                )

          acc.push(item)

          if (index !== children.length - 1) {
            acc.push(
              h(
                Box,
                {
                  ...getStyles('separator'),
                  key: `separator-${index}`,
                },
                () => renderContent(props.separator),
              ),
            )
          }

          return acc
        }, [])

        return h(Box, { ...attrs, ...getStyles('root') }, () => items)
      }
    },
  }),
)
