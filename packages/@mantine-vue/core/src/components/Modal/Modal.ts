import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import { createSafeContext, createVarsResolver, getSize, rem, useStyles } from '../../core'
import {
  ModalBase,
  ModalBaseBody,
  ModalBaseCloseButton,
  ModalBaseContent,
  ModalBaseHeader,
  ModalBaseOverlay,
  ModalBaseTitle,
  type ModalBaseProps,
} from '../ModalBase'
import classes from './Modal.module.css'

export interface ModalProps extends ModalBaseProps {
  title?: VNodeChild | (() => VNodeChild)
  withOverlay?: boolean
  overlayProps?: Record<string, any>
  withCloseButton?: boolean
  closeButtonProps?: Record<string, any>
  centered?: boolean
  fullScreen?: boolean
  radius?: string | number
  xOffset?: string | number
  yOffset?: string | number
  size?: string | number
  scrollAreaComponent?: any
  classNames?: any
  styles?: any
  vars?: any
}
const [provideModalContext, useModalContext] = createSafeContext<{
  getStyles: any
  fullScreen: boolean
  yOffset?: string | number
  scrollAreaComponent?: any
}>('Modal component was not found in tree')
const varsResolver = createVarsResolver<any>((_, props) => ({
  root: {
    '--modal-size': getSize(props.size, 'modal-size'),
    '--modal-radius': props.radius == null ? undefined : rem(props.radius),
    '--modal-y-offset': rem(props.yOffset),
    '--modal-x-offset': rem(props.xOffset),
  },
}))

export const ModalRoot = defineComponent({
  name: 'ModalRoot',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, required: true },
    onClose: { type: Function as PropType<() => void>, required: true },
    centered: Boolean,
    fullScreen: Boolean,
    radius: [String, Number],
    xOffset: { type: [String, Number], default: '5vw' },
    yOffset: { type: [String, Number], default: '5dvh' },
    size: { type: [String, Number], default: 'md' },
    scrollAreaComponent: { type: [Object, Function], default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: Boolean,
  },
  setup(props, { attrs, slots }) {
    const getStyles = useStyles({
      name: 'Modal',
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
    provideModalContext({
      getStyles,
      get fullScreen() {
        return props.fullScreen
      },
      get yOffset() {
        return props.yOffset
      },
      get scrollAreaComponent() {
        return props.scrollAreaComponent
      },
    })
    return () =>
      h(
        ModalBase,
        {
          ...attrs,
          opened: props.opened,
          onClose: props.onClose,
          unstyled: props.unstyled,
          ...getStyles('root'),
          mod: { centered: props.centered, 'full-screen': props.fullScreen },
        },
        slots,
      )
  },
})

function compound(
  name: string,
  Base: any,
  selector: string,
  extra?: (ctx: any) => Record<string, any>,
) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      visible: { type: Boolean, default: undefined },
      transitionProps: Object,
      __hidden: Boolean,
    },
    setup(props, { attrs, slots }) {
      const ctx = useModalContext()
      return () =>
        h(
          Base,
          {
            ...attrs,
            ...props,
            ...ctx.getStyles(selector, { className: attrs.class, style: attrs.style }),
            ...extra?.(ctx),
          },
          slots,
        )
    },
  })
}
export const ModalBody = compound('ModalBody', ModalBaseBody, 'body')
export const ModalCloseButton = compound('ModalCloseButton', ModalBaseCloseButton, 'close')
export const ModalHeader = compound('ModalHeader', ModalBaseHeader, 'header')
export const ModalOverlay = compound('ModalOverlay', ModalBaseOverlay, 'overlay')
export const ModalTitle = compound('ModalTitle', ModalBaseTitle, 'title')
export const ModalContent = compound('ModalContent', ModalBaseContent, 'content', (ctx) => ({
  innerProps: ctx.getStyles('inner'),
}))

const ModalBaseComponent = defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: {
    opened: { type: Boolean, required: true },
    onClose: { type: Function as PropType<() => void>, required: true },
    title: { type: [String, Object, Function] as PropType<any>, default: undefined },
    withOverlay: { type: Boolean, default: true },
    overlayProps: Object,
    withCloseButton: { type: Boolean, default: true },
    closeButtonProps: Object,
  },
  setup(props, { attrs, slots }) {
    return () => {
      const title = typeof props.title === 'function' ? props.title() : props.title
      const header = title != null || props.withCloseButton
      return h(
        ModalRoot,
        { ...attrs, opened: props.opened, onClose: props.onClose },
        {
          default: () => [
            props.withOverlay && h(ModalOverlay, props.overlayProps),
            h(ModalContent, null, {
              default: () => [
                header &&
                  h(ModalHeader, null, {
                    default: () => [
                      title != null && h(ModalTitle, null, { default: () => title as any }),
                      props.withCloseButton && h(ModalCloseButton, props.closeButtonProps),
                    ],
                  }),
                h(ModalBody, null, slots),
              ],
            }),
          ],
        },
      )
    }
  },
})
export const Modal = Object.assign(ModalBaseComponent, {
  classes,
  varsResolver,
  Root: ModalRoot,
  Overlay: ModalOverlay,
  Content: ModalContent,
  Body: ModalBody,
  Header: ModalHeader,
  Title: ModalTitle,
  CloseButton: ModalCloseButton,
})
export type ModalStylesNames =
  | 'root'
  | 'body'
  | 'close'
  | 'content'
  | 'header'
  | 'inner'
  | 'overlay'
  | 'title'
export type ModalCssVariables = any
export type ModalFactory = any
