import {
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from './Drawer.compound'
import DrawerComponent from './Drawer.vue'
import DrawerRootComponent, { varsResolver } from './DrawerRoot.vue'
import DrawerStackComponent from './DrawerStack.vue'
import classes from './Drawer.module.css'

export const DrawerRoot = DrawerRootComponent
export const DrawerStack = DrawerStackComponent

export { DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, DrawerTitle }
export { useDrawersStack } from './use-drawers-stack'

export const Drawer = Object.assign(DrawerComponent, {
  classes,
  varsResolver,
  Root: DrawerRoot,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Body: DrawerBody,
  Header: DrawerHeader,
  Title: DrawerTitle,
  CloseButton: DrawerCloseButton,
  Stack: DrawerStack,
})

export type { DrawerStackContextValue } from './Drawer.context'
export type { UseDrawersStackReturnType } from './use-drawers-stack'
export type {
  DrawerCompoundProps,
  DrawerCssVariables,
  DrawerFactory,
  DrawerPosition,
  DrawerProps,
  DrawerRootProps,
  DrawerRootSlots,
  DrawerSlots,
  DrawerStackSlots,
  DrawerStylesNames,
} from './Drawer.types'
