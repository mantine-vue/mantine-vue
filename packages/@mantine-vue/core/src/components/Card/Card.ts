import { cloneVNode, defineComponent, h, type PropType, type VNode } from 'vue'
import { withBoxProps, createVarsResolver, getSpacing, useProps, useStyles } from '../../core'
import { Paper } from '../Paper'
import { CardSection } from './CardSection/CardSection'
import { provideCardContext } from './Card.context'
import classes from './Card.module.css'

const defaultProps = {
  orientation: 'vertical',
} as const

const varsResolver = createVarsResolver<any>((_, { padding }) => ({
  root: {
    '--card-padding': getSpacing(padding),
  },
}))

function isCardSection(child: VNode) {
  return (
    child.type === CardSection ||
    (typeof child.type === 'object' && (child.type as any).name === 'CardSection')
  )
}

const CardBase = defineComponent({
  name: 'Card',
  inheritAttrs: false,
  props: {
    component: { type: String, default: 'div' },
    shadow: { type: String, default: undefined },
    radius: [String, Number] as PropType<string | number>,
    withBorder: { type: Boolean, default: false },
    padding: [String, Number] as PropType<string | number>,
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Card', defaultProps, rawProps)
    const getStyles = useStyles({
      name: 'Card',
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

    provideCardContext({ getStyles })

    return () => {
      const children = slots.default?.() ?? []
      const content = children.map((child, index) =>
        isCardSection(child)
          ? cloneVNode(child, {
              'data-orientation': props.orientation,
              'data-first-section': index === 0 ? '' : undefined,
              'data-last-section': index === children.length - 1 ? '' : undefined,
            })
          : child,
      )

      return h(
        Paper,
        {
          ...attrs,
          ...getStyles('root'),
          component: props.component,
          shadow: props.shadow,
          radius: props.radius,
          withBorder: props.withBorder,
          unstyled: props.unstyled,
          'data-orientation': props.orientation,
        },
        () => content,
      )
    }
  },
})

export const Card = withBoxProps(
  Object.assign(CardBase, {
    Section: CardSection,
  }),
)
