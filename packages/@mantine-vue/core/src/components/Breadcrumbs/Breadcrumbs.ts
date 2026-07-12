import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  Text,
  type PropType,
  type SlotsType,
  type VNode,
  type VNodeChild,
} from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  resolveNode,
  type MantineNode,
  useProps,
  useStyles,
} from '../../core'
import classes from './Breadcrumbs.module.css'

export interface BreadcrumbsSlots {
  default?: () => VNodeChild
  separator?: () => VNodeChild
}

const defaultProps = {
  separator: '/',
}

const varsResolver = createVarsResolver<any>((_, { separatorMargin }) => ({
  root: {
    '--bc-separator-margin': getSpacing(separatorMargin),
  },
}))

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
    slots: Object as SlotsType<BreadcrumbsSlots>,
    props: {
      separator: { type: null as unknown as PropType<MantineNode>, default: undefined },
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
        const children = flattenChildren((slots.default?.() ?? []) as VNode[])
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
                () => resolveNode(props.separator, slots.separator),
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
