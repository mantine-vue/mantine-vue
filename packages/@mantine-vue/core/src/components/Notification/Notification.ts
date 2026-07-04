import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getRadius,
  getThemeColor,
  useProps,
  useStyles,
} from '../../core'
import { CloseButton } from '../CloseButton'
import { Loader } from '../Loader'
import classes from './Notification.module.css'

export type NotificationStylesNames =
  | 'root'
  | 'icon'
  | 'loader'
  | 'body'
  | 'title'
  | 'description'
  | 'closeButton'

const defaultProps = {
  withCloseButton: true,
} as const

const varsResolver = createVarsResolver<any>((theme, { radius, color }) => ({
  root: {
    '--notification-radius': radius === undefined ? undefined : getRadius(radius),
    '--notification-color': color ? getThemeColor(color, theme) : undefined,
  },
}))

export const Notification = withBoxProps(
  defineComponent({
    name: 'Notification',
    inheritAttrs: false,
    props: {
      onClose: { type: Function as PropType<() => void>, default: undefined },
      color: { type: String, default: undefined },
      radius: { type: [String, Number] as PropType<string | number>, default: undefined },
      icon: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      title: { type: [String, Number, Object, Function] as PropType<any>, default: undefined },
      loading: { type: Boolean, default: false },
      withBorder: { type: Boolean, default: false },
      withCloseButton: { type: Boolean, default: undefined },
      closeButtonProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      loaderProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs, slots }) {
      const props = useProps('Notification', defaultProps, rawProps)
      const getStyles = useStyles({
        name: 'Notification',
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
      const renderContent = (value: any) => (typeof value === 'function' ? value() : value)

      return () =>
        h(
          Box,
          {
            ...attrs,
            role: attrs.role || 'alert',
            mod: [
              { withIcon: Boolean(props.icon) || props.loading, withBorder: props.withBorder },
              props.mod,
            ],
            ...getStyles('root', { className: attrs.class, style: attrs.style as any }),
          },
          () => [
            props.icon && !props.loading
              ? h('div', getStyles('icon'), renderContent(props.icon))
              : null,
            props.loading
              ? h(Loader, {
                  size: 28,
                  color: props.color,
                  ...getStyles('loader'),
                  ...props.loaderProps,
                })
              : null,
            h('div', getStyles('body'), [
              props.title ? h('div', getStyles('title'), renderContent(props.title)) : null,
              h(
                Box,
                {
                  ...getStyles('description'),
                  mod: { withTitle: Boolean(props.title) },
                },
                () => slots.default?.(),
              ),
            ]),
            props.withCloseButton
              ? h(CloseButton, {
                  iconSize: 16,
                  color: 'gray',
                  __staticSelector: 'Notification',
                  unstyled: props.unstyled,
                  ...props.closeButtonProps,
                  ...getStyles('closeButton'),
                  onClick: (event: MouseEvent) => {
                    props.closeButtonProps?.onClick?.(event)
                    props.onClose?.()
                  },
                })
              : null,
          ],
        )
    },
  }),
)

Object.assign(Notification, { classes, varsResolver })
