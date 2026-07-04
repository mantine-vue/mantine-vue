import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, createVarsResolver, getFontSize, rem, useStyles } from '../../../core'
import { useInputWrapperContext } from '../InputWrapper.context'
import classes from '../Input.module.css'

export type InputErrorStylesNames = 'error'

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  error: {
    '--input-error-size': size === undefined ? undefined : `calc(${getFontSize(size)} - ${rem(2)})`,
  },
}))

export const InputError = withBoxProps(
  defineComponent({
    name: 'InputError',
    inheritAttrs: false,
    props: {
      size: { type: [String, Number] as PropType<string | number>, default: undefined },
      __inheritStyles: { type: Boolean, default: true },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const wrapperCtx = useInputWrapperContext()
      const ownGetStyles = useStyles({
        name: 'InputWrapper',
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
        const getStyles = (props.__inheritStyles && wrapperCtx.getStyles) || ownGetStyles

        return h(
          Box,
          {
            ...attrs,
            component: 'p',
            ...getStyles('error', { className: attrs.class, style: attrs.style as any, props }),
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)

Object.assign(InputError, { classes, varsResolver })
