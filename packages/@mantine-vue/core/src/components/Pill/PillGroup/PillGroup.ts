import { defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSize,
  useProps,
  useStyles,
  type MantineSize,
} from '../../../core'
import { usePillsInputContext } from '../../PillsInput/PillsInput.context'
import classes from '../Pill.module.css'

export interface PillGroupContextValue {
  size?: MantineSize | (string & {}) | number
  disabled?: boolean
}

const PillGroupContextKey: InjectionKey<PillGroupContextValue> = Symbol('PillGroupContext')

export function usePillGroupContext() {
  return inject(PillGroupContextKey, null)
}

export type PillGroupStylesNames = 'group'

const varsResolver = createVarsResolver<any>((_, { gap }, ctx) => ({
  group: {
    '--pg-gap': gap !== undefined ? getSize(gap) : getSize(ctx.size, 'pg-gap'),
  },
}))

export const PillGroup = withBoxProps(
  defineComponent({
    name: 'PillGroup',
    inheritAttrs: false,
    props: {
      gap: {
        type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
        default: undefined,
      },
      size: { type: String as PropType<MantineSize | (string & {})>, default: undefined },
      disabled: { type: Boolean, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('PillGroup', null, rawProps)
      const pillsInputContext = usePillsInputContext()
      const getSizeValue = () => pillsInputContext?.size || props.size || undefined
      const getStyles = useStyles({
        name: 'PillGroup',
        classes,
        props,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
        vars: props.vars as any,
        varsResolver,
        stylesCtx: {
          get size() {
            return getSizeValue()
          },
        },
      })

      provide(PillGroupContextKey, {
        get size() {
          return getSizeValue()
        },
        get disabled() {
          return props.disabled
        },
      })

      return () =>
        h(
          Box,
          {
            ...attrs,
            ...getStyles('group', { className: attrs.class, style: attrs.style as any }),
            component: 'div',
            'data-size': getSizeValue(),
          },
          () => slots.default?.(),
        )
    },
  }),
)

Object.assign(PillGroup, { classes, varsResolver })
