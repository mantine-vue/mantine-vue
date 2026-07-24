import { defineComponent, h, resolveDynamicComponent, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getSize,
  getThemeColor,
  useProps,
  useStyles,
  type MantineColor,
  type MantineSize,
} from '../../core'
import { Bars } from './loaders/Bars'
import { Dots } from './loaders/Dots'
import { Oval } from './loaders/Oval'
import type { MantineLoader, MantineLoadersRecord } from './Loader.types'
import classes from './Loader.module.css'

export const defaultLoaders: MantineLoadersRecord = {
  bars: Bars,
  oval: Oval,
  dots: Dots,
}

const defaultProps = {
  loaders: defaultLoaders,
  type: 'oval',
  size: 'md',
}

const varsResolver = createVarsResolver<any>((theme, { size, color }) => ({
  root: {
    '--loader-size': getSize(size, 'loader-size'),
    '--loader-color': color ? getThemeColor(color, theme) : undefined,
  },
}))

export const Loader = withBoxProps(
  defineComponent({
    name: 'Loader',
    inheritAttrs: false,
    props: {
      size: [String, Number] as PropType<MantineSize | (string & {}) | number>,
      color: { type: String as PropType<MantineColor>, default: undefined },
      type: { type: String as PropType<MantineLoader>, default: undefined },
      loaders: { type: Object as PropType<MantineLoadersRecord>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Loader', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Loader',
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
        if (slots.default) {
          return h(Box, { ...attrs, ...getStyles('root') }, () => slots.default?.())
        }

        const loaders = props.loaders ?? defaultLoaders
        const type = props.type ?? 'oval'
        const loader = resolveDynamicComponent(loaders[type] ?? defaultLoaders.oval)
        return h(Box, {
          ...attrs,
          ...getStyles('root'),
          component: loader as any,
          size: props.size,
        })
      }
    },
  }),
)
