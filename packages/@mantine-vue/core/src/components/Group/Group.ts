import { Comment, defineComponent, h, reactive, type PropType, type VNode } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  useProps,
  useStyles,
  type AlignItems,
  type FlexWrap,
  type JustifyContent,
  type MantineSpacing,
} from '../../core'
import classes from './Group.module.css'

const defaultProps = {
  preventGrowOverflow: true,
  gap: 'md',
  align: 'center',
  justify: 'flex-start',
  wrap: 'wrap',
} as const

function filterFalsyChildren(children: VNode[]) {
  return children.filter((child) => child.type !== Comment)
}

const varsResolver = createVarsResolver<any>(
  (_, { grow, preventGrowOverflow, gap, align, justify, wrap }, { childWidth }) => ({
    root: {
      '--group-child-width': grow && preventGrowOverflow ? childWidth : undefined,
      '--group-gap': getSpacing(gap),
      '--group-align': align,
      '--group-justify': justify,
      '--group-wrap': wrap,
    },
  }),
)

export const Group = withBoxProps(
  defineComponent({
    name: 'Group',
    inheritAttrs: false,
    props: {
      justify: { type: String as PropType<JustifyContent>, default: undefined },
      align: { type: String as PropType<AlignItems>, default: undefined },
      wrap: { type: String as PropType<FlexWrap>, default: undefined },
      gap: [String, Number] as PropType<MantineSpacing>,
      grow: { type: Boolean, default: false },
      preventGrowOverflow: { type: Boolean, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Group', defaultProps, rawProps)
      const stylesCtx = reactive({ childWidth: '' })
      const getStyles = useStyles({
        name: 'Group',
        classes,
        props,
        stylesCtx,
        className: undefined,
        style: undefined,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        varsResolver,
        unstyled: props.unstyled,
      })

      return () => {
        const children = filterFalsyChildren(slots.default?.() ?? [])
        const childrenCount = Math.max(children.length, 1)
        const resolvedGap = getSpacing(props.gap ?? 'md')
        stylesCtx.childWidth = `calc(${100 / childrenCount}% - (${resolvedGap} - ${resolvedGap} / ${childrenCount}))`

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
            mod: { grow: props.grow },
          },
          () => children,
        )
      }
    },
  }),
)
