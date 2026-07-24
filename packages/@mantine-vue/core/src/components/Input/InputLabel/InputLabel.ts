import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getFontSize,
  useStyles,
  type MantineFontSize,
} from '../../../core'
import { useInputWrapperContext } from '../InputWrapper.context'
import classes from '../Input.module.css'

export type InputLabelStylesNames = 'label' | 'required'

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  label: {
    '--input-label-size': getFontSize(size),
    '--input-asterisk-color': undefined,
  },
}))

export const InputLabel = withBoxProps(
  defineComponent({
    name: 'InputLabel',
    inheritAttrs: false,
    props: {
      required: { type: Boolean, default: false },
      size: { type: [String, Number] as PropType<MantineFontSize | number>, default: undefined },
      labelElement: { type: String as PropType<'label' | 'div'>, default: 'label' },
      htmlFor: { type: String, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
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
        const getStyles = wrapperCtx.getStyles || ownGetStyles

        return h(
          Box,
          {
            ...attrs,
            component: props.labelElement,
            htmlFor: props.labelElement === 'label' ? props.htmlFor : undefined,
            ...getStyles('label', { className: attrs.class, style: attrs.style as any, props }),
            mod: [{ required: props.required }, props.mod],
            onMousedown: (event: MouseEvent) => {
              if (!event.defaultPrevented && event.detail > 1) {
                event.preventDefault()
              }
            },
          },
          () => [
            slots.default?.(),
            props.required
              ? h('span', { ...getStyles('required', { props }), 'aria-hidden': true }, ' *')
              : null,
          ],
        )
      }
    },
  }),
)

Object.assign(InputLabel, { classes, varsResolver })
