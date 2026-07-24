import { defineComponent, h, type PropType, type SlotsType, type VNodeChild } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSize,
  getThemeColor,
  hasNode,
  resolveNode,
  type MantineColor,
  type MantineNode,
  type MantineSize,
  useProps,
  useStyles,
} from '../../core'
import classes from './Divider.module.css'

export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export interface DividerSlots {
  default?: () => VNodeChild
  label?: () => VNodeChild
}

const defaultProps = {
  orientation: 'horizontal',
  labelPosition: 'center',
  variant: 'solid',
} as const

const varsResolver = createVarsResolver<any>((theme, { color, variant, size }) => ({
  root: {
    '--divider-color': color ? getThemeColor(color, theme) : undefined,
    '--divider-border-style': variant,
    '--divider-size': getSize(size, 'divider-size'),
  },
}))

export const Divider = withBoxProps(
  defineComponent({
    name: 'Divider',
    inheritAttrs: false,
    slots: Object as SlotsType<DividerSlots>,
    props: {
      color: { type: String as PropType<MantineColor>, default: undefined },
      size: [String, Number] as PropType<MantineSize | number | (string & {})>,
      label: { type: null as unknown as PropType<MantineNode>, default: undefined },
      labelPosition: { type: String as PropType<'left' | 'center' | 'right'>, default: undefined },
      orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
      variant: { type: String as PropType<DividerVariant>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Divider', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Divider',
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
        const label = resolveNode(props.label, slots.label ?? slots.default)

        return h(
          Box,
          {
            ...attrs,
            role: 'separator',
            ...getStyles('root'),
            mod: { orientation: props.orientation, withLabel: hasNode(label) },
          },
          () =>
            hasNode(label)
              ? h(
                  Box as any,
                  {
                    component: 'span',
                    ...getStyles('label'),
                    mod: { position: props.labelPosition },
                  },
                  () =>
                    typeof label === 'string' || typeof label === 'number' ? String(label) : label,
                )
              : undefined,
        )
      }
    },
  }),
)
