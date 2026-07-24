import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getSize,
  useProps,
  useStyles,
  type MantineRadius,
  type MantineSize,
} from '../../../core'
import { provideProgressContext } from '../Progress.context'
import classes from '../Progress.module.css'

export type ProgressRootStylesNames = 'root' | 'section' | 'label'

const varsResolver = createVarsResolver<any>((_, { size, radius, transitionDuration }) => ({
  root: {
    '--progress-size': getSize(size, 'progress-size'),
    '--progress-radius': radius === undefined ? undefined : getRadius(radius),
    '--progress-transition-duration':
      typeof transitionDuration === 'number' ? `${transitionDuration}ms` : undefined,
  },
}))

export const ProgressRoot = withBoxProps(
  defineComponent({
    name: 'ProgressRoot',
    inheritAttrs: false,
    props: {
      size: {
        type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
        default: undefined,
      },
      radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
      autoContrast: { type: Boolean, default: undefined },
      transitionDuration: { type: Number, default: undefined },
      orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ProgressRoot', null, rawProps)
      const getStyles = useStyles({
        name: 'Progress',
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

      provideProgressContext({ getStyles, autoContrast: props.autoContrast })

      return () =>
        h(
          Box,
          {
            ...attrs,
            mod: [{ orientation: props.orientation }, props.mod],
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => slots.default?.(),
        )
    },
  }),
)

Object.assign(ProgressRoot, { classes, varsResolver })
