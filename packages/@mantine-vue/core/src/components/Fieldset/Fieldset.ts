import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  hasNode,
  resolveNode,
  type MantineNode,
  useProps,
  useStyles,
} from '../../core'
import classes from './Fieldset.module.css'

export type FieldsetStylesNames = 'root' | 'legend'
export type FieldsetVariant = 'default' | 'filled' | 'unstyled'

export interface FieldsetSlots {
  default?: () => VNodeChild
  legend?: () => VNodeChild
}

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
    slots: Object as SlotsType<FieldsetSlots>,
    props: {
      legend: { type: null as unknown as PropType<MantineNode>, default: undefined },
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
      return () => {
        const legend = resolveNode(props.legend, slots.legend)

        return h(
          Box,
          {
            ...attrs,
            component: 'fieldset',
            variant: props.variant,
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => [
            hasNode(legend) ? h('legend', getStyles('legend'), legend as any) : null,
            slots.default?.(),
          ],
        )
      }
    },
  }),
)

Object.assign(Fieldset, { classes, varsResolver })
