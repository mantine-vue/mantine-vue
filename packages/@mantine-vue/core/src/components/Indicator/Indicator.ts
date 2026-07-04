import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getAutoContrastValue,
  getContrastColor,
  getRadius,
  getThemeColor,
  rem,
  useProps,
  useStyles,
} from '../../core'
import { getPositionVariables } from './get-position-variables/get-position-variables'
import type { IndicatorPosition } from './Indicator.types'
import classes from './Indicator.module.css'

const defaultProps = {
  position: 'top-end',
  offset: 0,
  showZero: true,
  zIndex: 200,
} as const

const varsResolver = createVarsResolver<any>(
  (theme, { color, position, offset, size, radius, zIndex, autoContrast }) => ({
    root: {
      '--indicator-color': color ? getThemeColor(color, theme) : undefined,
      '--indicator-text-color': getAutoContrastValue(autoContrast, theme)
        ? getContrastColor({ color, theme, autoContrast })
        : undefined,
      '--indicator-size': rem(size),
      '--indicator-radius': radius === undefined ? undefined : getRadius(radius),
      '--indicator-z-index': zIndex?.toString(),
      ...getPositionVariables(position, offset),
    },
  }),
)

function renderContent(content: any) {
  return typeof content === 'function' ? content() : content
}

export const Indicator = withBoxProps(
  defineComponent({
    name: 'Indicator',
    inheritAttrs: false,
    props: {
      position: { type: String as PropType<IndicatorPosition>, default: undefined },
      offset: {
        type: [Number, Object] as PropType<number | { x: number; y: number }>,
        default: undefined,
      },
      inline: { type: Boolean, default: false },
      size: [String, Number] as PropType<string | number>,
      label: { type: [String, Number, Object, Function], default: undefined },
      radius: [String, Number] as PropType<string | number>,
      color: { type: String, default: undefined },
      withBorder: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      processing: { type: Boolean, default: false },
      zIndex: [String, Number] as PropType<string | number>,
      autoContrast: { type: Boolean, default: undefined },
      maxValue: { type: Number, default: undefined },
      showZero: { type: Boolean, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Indicator', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Indicator',
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

      return () => {
        const shouldHideZero = !props.showZero && (props.label === 0 || props.label === '0')
        const formattedLabel =
          props.maxValue !== undefined &&
          typeof props.label === 'number' &&
          props.label > props.maxValue
            ? `${props.maxValue}+`
            : props.label

        return h(
          Box,
          {
            ...attrs,
            ...getStyles('root'),
            mod: [{ inline: props.inline }, props.mod],
          },
          () => [
            !props.disabled && !shouldHideZero
              ? h(
                  Box,
                  {
                    ...getStyles('indicator'),
                    mod: {
                      withLabel: Boolean(props.label),
                      withBorder: props.withBorder,
                      processing: props.processing,
                    },
                  },
                  () => renderContent(formattedLabel),
                )
              : null,
            slots.default?.(),
          ],
        )
      }
    },
  }),
)
