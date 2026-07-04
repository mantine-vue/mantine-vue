import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, getRadius, useProps, useStyles } from '../../core'
import classes from './Fieldset.module.css'

export type FieldsetStylesNames = 'root' | 'legend'
export type FieldsetVariant = 'default' | 'filled' | 'unstyled'

const defaultProps = {
  variant: 'default',
} as const

const varsResolver = createVarsResolver<any>((_, { radius }) => ({
  root: {
    '--fieldset-radius': radius === undefined ? undefined : getRadius(radius),
  },
}))

export const Fieldset = withBoxProps(
  defineComponent({
    name: 'Fieldset',
    inheritAttrs: false,
    props: {
      legend: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      variant: { type: String as PropType<FieldsetVariant>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Fieldset', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Fieldset',
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
      const renderContent = (value: any) => (typeof value === 'function' ? value() : value)

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'fieldset',
            variant: props.variant,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => [
            props.legend ? h('legend', getStyles('legend'), renderContent(props.legend)) : null,
            slots.default?.(),
          ],
        )
    },
  }),
)

Object.assign(Fieldset, { classes, varsResolver })
