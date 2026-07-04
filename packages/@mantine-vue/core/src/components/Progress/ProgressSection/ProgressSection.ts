import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  getAutoContrastValue,
  getContrastColor,
  getThemeColor,
  useMantineTheme,
  useProps,
} from '../../../core'
import { useProgressContext } from '../Progress.context'
import classes from '../Progress.module.css'

const defaultProps = {
  withAria: true,
} as const

export const ProgressSection = withBoxProps(
  defineComponent({
    name: 'ProgressSection',
    inheritAttrs: false,
    props: {
      value: { type: Number, required: true },
      withAria: { type: Boolean, default: undefined },
      color: { type: String, default: undefined },
      striped: { type: Boolean, default: false },
      animated: { type: Boolean, default: false },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('ProgressSection', defaultProps, rawProps)
      const ctx = useProgressContext()
      const theme = useMantineTheme()

      return () => {
        const ariaAttributes =
          props.withAria === false
            ? {}
            : {
                role: 'progressbar',
                'aria-valuemax': 100,
                'aria-valuemin': 0,
                'aria-valuenow': props.value,
                'aria-valuetext': `${props.value}%`,
              }

        return h(
          Box,
          {
            ...attrs,
            ...ariaAttributes,
            mod: [
              { striped: props.striped || props.animated, animated: props.animated },
              props.mod,
            ],
            ...ctx.getStyles('section', {
              className: attrs.class,
              style: {
                '--progress-section-size': `${props.value}%`,
                '--progress-section-color': getThemeColor(props.color, theme.value),
                '--progress-label-color': getAutoContrastValue(ctx.autoContrast, theme.value)
                  ? getContrastColor({
                      color: props.color,
                      theme: theme.value,
                      autoContrast: ctx.autoContrast,
                    })
                  : undefined,
                ...(attrs.style as Record<string, any>),
              },
              props,
            }),
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)

Object.assign(ProgressSection, { classes })
