import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, useProps, useStyles } from '../../core'
import { getTitleSize, type TitleOrder, type TitleSize } from './get-title-size'
import classes from './Title.module.css'

const defaultProps = {
  order: 1,
} as const

const varsResolver = createVarsResolver<any>((_, { order, size, lineClamp, textWrap }) => {
  const sizeVariables = getTitleSize(order || 1, size)
  return {
    root: {
      '--title-fw': sizeVariables.fontWeight,
      '--title-lh': sizeVariables.lineHeight,
      '--title-fz': sizeVariables.fontSize,
      '--title-line-clamp': typeof lineClamp === 'number' ? lineClamp.toString() : undefined,
      '--title-text-wrap': textWrap,
    },
  }
})

export const Title = withBoxProps(
  defineComponent({
    name: 'Title',
    inheritAttrs: false,
    props: {
      order: { type: Number as PropType<TitleOrder>, default: undefined },
      size: [String, Number] as PropType<TitleSize>,
      lineClamp: { type: Number, default: undefined },
      textWrap: {
        type: String as PropType<'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'>,
        default: undefined,
      },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Title', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Title',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        vars: props.vars as any,
        varsResolver,
        unstyled: props.unstyled,
      })

      return () => {
        const order = props.order ?? 1

        if (![1, 2, 3, 4, 5, 6].includes(order)) {
          return null
        }

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            component: `h${order}`,
            mod: { order, lineClamp: typeof props.lineClamp === 'number' },
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)
