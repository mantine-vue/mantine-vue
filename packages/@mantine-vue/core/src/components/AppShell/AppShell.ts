import { defineComponent, h, type PropType } from 'vue'
import {
  withBoxProps,
  Box,
  createVarsResolver,
  getDefaultZIndex,
  useProps,
  useStyles,
} from '../../core'
import { provideAppShellContext } from './AppShell.context'
import type {
  AppShellAsideConfiguration,
  AppShellFooterConfiguration,
  AppShellHeaderConfiguration,
  AppShellNavbarConfiguration,
  AppShellResponsiveSize,
  AppShellSize,
} from './AppShell.types'
import { AppShellAside } from './AppShellAside/AppShellAside'
import { AppShellFooter } from './AppShellFooter/AppShellFooter'
import { AppShellHeader } from './AppShellHeader/AppShellHeader'
import { AppShellMain } from './AppShellMain/AppShellMain'
import { AppShellMediaStyles } from './AppShellMediaStyles/AppShellMediaStyles'
import { AppShellNavbar } from './AppShellNavbar/AppShellNavbar'
import { AppShellSection } from './AppShellSection/AppShellSection'
import { useResizing } from './use-resizing/use-resizing'
import classes from './AppShell.module.css'
export type AppShellStylesNames =
  | 'root'
  | 'navbar'
  | 'main'
  | 'header'
  | 'footer'
  | 'aside'
  | 'section'
const defaults = {
  withBorder: true,
  padding: 0,
  transitionDuration: 200,
  transitionTimingFunction: 'ease',
  zIndex: getDefaultZIndex('app'),
  mode: 'fixed',
  offsetScrollbars: true,
} as const
const varsResolver = createVarsResolver<any>(
  (_, { transitionDuration, transitionTimingFunction }) => ({
    root: {
      '--app-shell-transition-duration': `${transitionDuration}ms`,
      '--app-shell-transition-timing-function': transitionTimingFunction,
    },
  }),
)
let appShellId = 0
const AppShellBase = defineComponent({
  name: 'AppShell',
  inheritAttrs: false,
  props: {
    withBorder: { type: Boolean, default: undefined },
    padding: {
      type: [String, Number, Object] as PropType<AppShellSize | AppShellResponsiveSize>,
      default: undefined,
    },
    navbar: { type: Object as PropType<AppShellNavbarConfiguration>, default: undefined },
    aside: { type: Object as PropType<AppShellAsideConfiguration>, default: undefined },
    header: { type: Object as PropType<AppShellHeaderConfiguration>, default: undefined },
    footer: { type: Object as PropType<AppShellFooterConfiguration>, default: undefined },
    transitionDuration: { type: Number, default: undefined },
    transitionTimingFunction: { type: String, default: undefined },
    zIndex: { type: [String, Number] as PropType<string | number>, default: undefined },
    layout: { type: String as PropType<'default' | 'alt'>, default: 'default' },
    disabled: { type: Boolean, default: false },
    offsetScrollbars: { type: Boolean, default: undefined },
    mode: { type: String as PropType<'fixed' | 'static'>, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('AppShell', defaults as any, rawProps) as any
    const id = (attrs.id as string | undefined) ?? `mantine-app-shell-${++appShellId}`
    const getStyles = useStyles({
      name: 'AppShell',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames,
      styles: props.styles,
      vars: props.vars,
      unstyled: props.unstyled,
      varsResolver,
    })
    const resizing = useResizing({
      transitionDuration: () => props.transitionDuration,
      disabled: () => props.disabled,
    })
    provideAppShellContext({
      getStyles,
      get withBorder() {
        return props.withBorder
      },
      get zIndex() {
        return props.zIndex
      },
      get disabled() {
        return props.disabled
      },
      get offsetScrollbars() {
        return props.offsetScrollbars
      },
      get mode() {
        return props.mode
      },
    } as any)
    return () =>
      h(
        Box,
        {
          ...attrs,
          id,
          ...getStyles('root', { className: attrs.class, style: attrs.style }),
          mod: [
            {
              resizing: resizing.value,
              layout: props.layout,
              disabled: props.disabled,
              mode: props.mode,
            },
            props.mod,
          ],
        },
        () => [
          h(AppShellMediaStyles, {
            navbar: props.navbar,
            aside: props.aside,
            header: props.header,
            footer: props.footer,
            padding: props.padding,
            mode: props.mode,
            selector: props.mode === 'static' ? `#${id}` : undefined,
          }),
          slots.default?.(),
        ],
      )
  },
})
export const AppShell = withBoxProps(
  Object.assign(AppShellBase, {
    classes,
    varsResolver,
    Navbar: AppShellNavbar,
    Header: AppShellHeader,
    Main: AppShellMain,
    Aside: AppShellAside,
    Footer: AppShellFooter,
    Section: AppShellSection,
  }),
)
