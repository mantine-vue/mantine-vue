import { defineComponent, h, type PropType } from 'vue'
import {
  createVarsResolver,
  getSize,
  useMantineEnv,
  useProps,
  useStyles,
  type MantineRadius,
  type MantineSize,
  type MantineSpacing,
} from '../../core'
import { Affix, type AffixPosition } from '../Affix'
import { CloseButton } from '../CloseButton'
import { Paper } from '../Paper'
import { Transition, type MantineTransition } from '../Transition'
import classes from './Dialog.module.css'

export type DialogStylesNames = 'root' | 'closeButton'

const defaultProps = {
  shadow: 'md',
  p: 'md',
  withBorder: true,
  transitionProps: { transition: 'pop-top-right' as MantineTransition, duration: 200 },
  position: { bottom: 30, right: 30 },
} as const

const varsResolver = createVarsResolver<any>((_, { size }) => ({
  root: {
    '--dialog-size': getSize(size, 'dialog-size'),
  },
}))

export const Dialog = defineComponent({
  name: 'Dialog',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, required: true },
    keepMounted: { type: Boolean, default: false },
    withCloseButton: { type: Boolean, default: false },
    onClose: { type: Function as PropType<() => void>, default: undefined },
    transitionProps: {
      type: Object as PropType<{
        transition?: MantineTransition
        duration?: number
        keepMounted?: boolean
      }>,
      default: undefined,
    },
    size: {
      type: [String, Number] as PropType<MantineSize | (string & {}) | number>,
      default: undefined,
    },
    zIndex: { type: [String, Number] as PropType<string | number>, default: undefined },
    withinPortal: { type: Boolean, default: undefined },
    portalProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    position: { type: Object as PropType<AffixPosition>, default: undefined },
    shadow: { type: String, default: undefined },
    radius: { type: [String, Number] as PropType<MantineRadius>, default: undefined },
    withBorder: { type: Boolean, default: undefined },
    p: { type: [String, Number] as PropType<MantineSpacing>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Dialog', defaultProps, rawProps)
    const env = useMantineEnv()
    const getStyles = useStyles({
      name: 'Dialog',
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

    const renderPaper = (transitionStyles: any) =>
      h(
        Paper,
        {
          ...attrs,
          ...getStyles('root', { style: transitionStyles, className: attrs.class }),
          unstyled: props.unstyled,
          shadow: props.shadow,
          radius: props.radius,
          withBorder: props.withBorder,
          p: props.p,
        },
        () => [
          props.withCloseButton
            ? h(CloseButton, {
                onClick: props.onClose,
                unstyled: props.unstyled,
                ...getStyles('closeButton'),
              })
            : null,
          slots.default?.(),
        ],
      )

    return () =>
      h(
        Affix,
        {
          zIndex: props.zIndex,
          position: props.position,
          withinPortal: props.withinPortal,
          portalProps: props.portalProps,
          unstyled: props.unstyled,
        },
        () =>
          env === 'test'
            ? props.opened
              ? renderPaper({})
              : props.keepMounted
                ? renderPaper({ display: 'none' })
                : null
            : h(
                Transition,
                {
                  keepMounted: props.keepMounted,
                  mounted: props.opened,
                  ...props.transitionProps,
                },
                { default: renderPaper },
              ),
      )
  },
})

Object.assign(Dialog, { classes, varsResolver })
