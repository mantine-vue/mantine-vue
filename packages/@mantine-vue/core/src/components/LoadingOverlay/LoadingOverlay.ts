import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getDefaultZIndex,
  useMantineTheme,
  useProps,
  useStyles,
} from '../../core'
import { Loader } from '../Loader'
import { Overlay } from '../Overlay'
import { Transition, type MantineTransition } from '../Transition'
import classes from './LoadingOverlay.module.css'

const defaultProps: Record<string, any> = {
  transitionProps: { transition: 'fade', duration: 0 },
  overlayProps: { backgroundOpacity: 0.75 },
  zIndex: getDefaultZIndex('overlay'),
}

const varsResolver = createVarsResolver<any>((_, { zIndex }) => ({
  root: {
    '--lo-z-index': zIndex?.toString(),
  },
}))

export const LoadingOverlay = withBoxProps(
  defineComponent({
    name: 'LoadingOverlay',
    inheritAttrs: false,
    props: {
      transitionProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      loaderProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      overlayProps: { type: Object as PropType<Record<string, any>>, default: undefined },
      visible: { type: Boolean, default: false },
      zIndex: [String, Number] as PropType<string | number>,
      onEnter: { type: Function as PropType<() => void>, default: undefined },
      onEntered: { type: Function as PropType<() => void>, default: undefined },
      onExit: { type: Function as PropType<() => void>, default: undefined },
      onExited: { type: Function as PropType<() => void>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
      vars: { type: [Object, Function], default: undefined },
      unstyled: { type: Boolean, default: false },
    },
    setup(rawProps, { attrs }) {
      const props = useProps('LoadingOverlay', defaultProps, rawProps)
      const theme = useMantineTheme()
      const getStyles = useStyles({
        name: 'LoadingOverlay',
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
        const overlayProps: Record<string, any> = {
          ...defaultProps.overlayProps,
          ...props.overlayProps,
        }
        const transitionProps: Record<string, any> = {
          ...defaultProps.transitionProps,
          ...props.transitionProps,
        }

        return h(
          Transition,
          {
            transition: transitionProps.transition as MantineTransition,
            duration: transitionProps.duration,
            timingFunction: transitionProps.timingFunction,
            keepMounted: transitionProps.keepMounted,
            mounted: props.visible,
            onEnter: props.onEnter,
            onEntered: props.onEntered,
            onExit: props.onExit,
            onExited: props.onExited,
          },
          {
            default: (transitionStyles: any) =>
              props.visible
                ? h(
                    Box,
                    {
                      ...attrs,
                      ...getStyles('root', { style: transitionStyles }),
                    },
                    () => [
                      h(Loader, {
                        unstyled: props.unstyled,
                        ...props.loaderProps,
                        ...getStyles('loader', {
                          className: props.loaderProps?.class,
                          style: props.loaderProps?.style,
                        }),
                      }),
                      h(Overlay, {
                        ...overlayProps,
                        ...getStyles('overlay', {
                          className: ['mantine-dark-hidden', overlayProps.class],
                          style: overlayProps.style,
                        }),
                        unstyled: props.unstyled,
                        color: overlayProps.color || theme.value.white,
                      }),
                      h(Overlay, {
                        ...overlayProps,
                        ...getStyles('overlay', {
                          className: ['mantine-light-hidden', overlayProps.class],
                          style: overlayProps.style,
                        }),
                        unstyled: props.unstyled,
                        color: overlayProps.color || theme.value.colors.dark[5],
                      }),
                    ],
                  )
                : null,
          },
        )
      }
    },
  }),
)
