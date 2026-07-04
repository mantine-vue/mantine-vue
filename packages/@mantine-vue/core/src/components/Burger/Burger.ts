import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSize,
  getThemeColor,
  rem,
  useProps,
  useStyles,
} from '../../core'
import { UnstyledButton } from '../UnstyledButton'
import classes from './Burger.module.css'

const varsResolver = createVarsResolver<any>(
  (theme, { color, size, lineSize, transitionDuration, transitionTimingFunction }) => ({
    root: {
      '--burger-color': color ? getThemeColor(color, theme) : undefined,
      '--burger-size': getSize(size, 'burger-size'),
      '--burger-line-size': lineSize ? rem(lineSize) : undefined,
      '--burger-transition-duration':
        transitionDuration === undefined ? undefined : `${transitionDuration}ms`,
      '--burger-transition-timing-function': transitionTimingFunction,
    },
  }),
)

export const Burger = withBoxProps(
  defineComponent({
    name: 'Burger',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<string | number>,
      lineSize: [String, Number] as PropType<string | number>,
      color: { type: String, default: undefined },
      opened: { type: Boolean, default: false },
      transitionDuration: { type: Number, default: undefined },
      transitionTimingFunction: { type: String, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Burger', null, rawProps)
      const getStyles = useStyles({
        name: 'Burger',
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

      return () =>
        h(
          UnstyledButton,
          {
            ...attrs,
            ...getStyles('root'),
            unstyled: props.unstyled,
          },
          () => [
            h(Box, {
              ...getStyles('burger'),
              mod: { opened: props.opened },
            }),
            slots.default?.(),
          ],
        )
    },
  }),
)
