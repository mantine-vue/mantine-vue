import { defineComponent, h, inject, provide, type InjectionKey, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSpacing,
  useProps,
  useStyles,
} from '../../../core'
import classes from '../Avatar.module.css'

export interface AvatarGroupContextValue {
  withinGroup: boolean
}

export const AvatarGroupContextKey = Symbol(
  'AvatarGroupContext',
) as InjectionKey<AvatarGroupContextValue>

export function useAvatarGroupContext() {
  return inject(AvatarGroupContextKey, { withinGroup: false })
}

const varsResolver = createVarsResolver<any>((_, { spacing }) => ({
  group: {
    '--ag-spacing': getSpacing(spacing),
  },
}))

export const AvatarGroup = withBoxProps(
  defineComponent({
    name: 'AvatarGroup',
    inheritAttrs: false,
    props: {
      spacing: [String, Number] as PropType<string | number>,
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('AvatarGroup', null, rawProps)
      const getStyles = useStyles({
        name: 'AvatarGroup',
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

      provide(AvatarGroupContextKey, { withinGroup: true })

      return () => h(Box, { ...attrs, ...getStyles('group') }, () => slots.default?.())
    },
  }),
)
