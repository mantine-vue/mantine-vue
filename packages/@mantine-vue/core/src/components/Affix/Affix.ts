import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getDefaultZIndex,
  getSpacing,
  useProps,
  useStyles,
} from '../../core'
import { OptionalPortal } from '../Portal'
import classes from './Affix.module.css'

export type AffixStylesNames = 'root'

export interface AffixPosition {
  top?: string | number
  left?: string | number
  bottom?: string | number
  right?: string | number
}

const defaultProps = {
  position: { bottom: 0, right: 0 },
  zIndex: getDefaultZIndex('modal'),
  withinPortal: true,
} as const

const varsResolver = createVarsResolver<any>((_, { zIndex, position }) => ({
  root: {
    '--affix-z-index': zIndex?.toString(),
    '--affix-top': getSpacing(position?.top),
    '--affix-left': getSpacing(position?.left),
    '--affix-bottom': getSpacing(position?.bottom),
    '--affix-right': getSpacing(position?.right),
  },
}))

export const Affix = withBoxProps(
  defineComponent({
    name: 'Affix',
    inheritAttrs: false,
    props: {
      zIndex: { type: [String, Number] as PropType<string | number>, default: undefined },
      withinPortal: { type: Boolean, default: undefined },
      portalProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      position: { type: Object as PropType<AffixPosition>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Affix', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Affix',
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

      return () =>
        h(
          OptionalPortal,
          {
            ...props.portalProps,
            withinPortal: props.withinPortal,
          },
          () =>
            h(
              Box,
              {
                ...attrs,
                ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
              },
              () => slots.default?.(),
            ),
        )
    },
  }),
)

Object.assign(Affix, { classes, varsResolver })
