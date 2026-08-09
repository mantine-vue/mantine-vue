import {
  ModalBaseBody,
  ModalBaseCloseButton,
  ModalBaseContent,
  ModalBaseHeader,
  ModalBaseOverlay,
  ModalBaseTitle,
} from '../ModalBase'
import { createDrawerCompoundComponent } from './create-drawer-compound-component'

export const DrawerBody = createDrawerCompoundComponent('DrawerBody', ModalBaseBody, 'body')
export const DrawerCloseButton = createDrawerCompoundComponent(
  'DrawerCloseButton',
  ModalBaseCloseButton,
  'close',
)
export const DrawerHeader = createDrawerCompoundComponent('DrawerHeader', ModalBaseHeader, 'header')
export const DrawerOverlay = createDrawerCompoundComponent(
  'DrawerOverlay',
  ModalBaseOverlay,
  'overlay',
)
export const DrawerTitle = createDrawerCompoundComponent('DrawerTitle', ModalBaseTitle, 'title')

/**
 * The content also needs the `inner` styles that position the drawer, and the radius,
 * which lives on the root rather than on the content itself.
 */
export const DrawerContent = createDrawerCompoundComponent(
  'DrawerContent',
  ModalBaseContent,
  'content',
  (ctx) => ({
    innerProps: ctx.getStyles('inner'),
    radius: ctx.radius ?? 0,
  }),
)
