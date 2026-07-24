import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  useProps,
  useStyles,
  type MantineSpacing,
} from '../../core'
import classes from './Marquee.module.css'

export type MarqueeStylesNames = 'root' | 'content' | 'group'

const defaultProps = {
  repeat: 4,
  duration: 100000,
  orientation: 'horizontal',
  fadeEdges: true,
} as const

const varsResolver = createVarsResolver<any>(
  (_, { duration, gap, repeat, fadeEdgeColor, fadeEdgeSize }) => ({
    root: {
      '--marquee-duration': `${duration}ms`,
      '--marquee-gap': getSpacing(gap),
      '--marquee-repeat': (repeat ?? 4).toString(),
      '--marquee-fade-color': fadeEdgeColor,
      '--marquee-fade-size': fadeEdgeSize,
    },
  }),
)

export const Marquee = withBoxProps(
  defineComponent({
    name: 'Marquee',
    inheritAttrs: false,
    props: {
      reverse: { type: Boolean, default: false },
      pauseOnHover: { type: Boolean, default: false },
      orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
      repeat: { type: Number, default: undefined },
      duration: { type: Number, default: undefined },
      gap: { type: [String, Number] as PropType<MantineSpacing>, default: undefined },
      fadeEdges: { type: Boolean, default: undefined },
      fadeEdgeColor: { type: String, default: undefined },
      fadeEdgeSize: { type: String, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Marquee', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Marquee',
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
        const repeatedChildren = Array.from(
          { length: props.repeat ?? defaultProps.repeat },
          (_, index) => h('div', { key: index, ...getStyles('group') }, slots.default?.()),
        )

        return h(
          Box,
          {
            ...attrs,
            mod: [
              {
                orientation: props.orientation,
                reverse: props.reverse,
                pauseOnHover: props.pauseOnHover,
                fadeEdges: props.fadeEdges,
              },
              props.mod,
            ],
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => h('div', getStyles('content'), repeatedChildren),
        )
      }
    },
  }),
)

Object.assign(Marquee, { classes, varsResolver })
