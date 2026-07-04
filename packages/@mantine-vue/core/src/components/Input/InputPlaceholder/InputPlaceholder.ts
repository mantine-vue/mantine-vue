import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box, useStyles } from '../../../core'
import classes from '../Input.module.css'

export type InputPlaceholderStylesNames = 'placeholder'

export const InputPlaceholder = withBoxProps(
  defineComponent({
    name: 'InputPlaceholder',
    inheritAttrs: false,
    props: {
      error: { type: [String, Number, Object, Boolean] as PropType<any>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const getStyles = useStyles({
        name: 'InputPlaceholder',
        props,
        classes,
        className: attrs.class,
        style: attrs.style as any,
        classNames: props.classNames as any,
        styles: props.styles as any,
        unstyled: props.unstyled,
      })

      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'span',
            ...getStyles('placeholder', { className: attrs.class, style: attrs.style as any }),
            mod: [{ error: Boolean(props.error) }, props.mod],
          },
          () => slots.default?.(),
        )
    },
  }),
)
