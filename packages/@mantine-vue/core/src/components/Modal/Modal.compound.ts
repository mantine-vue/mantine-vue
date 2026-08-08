import {
  ModalBaseBody,
  ModalBaseCloseButton,
  ModalBaseContent,
  ModalBaseHeader,
  ModalBaseOverlay,
  ModalBaseTitle,
} from '../ModalBase'
import { createModalCompoundComponent } from './create-modal-compound-component'

export const ModalBody = createModalCompoundComponent('ModalBody', ModalBaseBody, 'body')
export const ModalCloseButton = createModalCompoundComponent(
  'ModalCloseButton',
  ModalBaseCloseButton,
  'close',
)
export const ModalHeader = createModalCompoundComponent('ModalHeader', ModalBaseHeader, 'header')
export const ModalOverlay = createModalCompoundComponent(
  'ModalOverlay',
  ModalBaseOverlay,
  'overlay',
)
export const ModalTitle = createModalCompoundComponent('ModalTitle', ModalBaseTitle, 'title')

/** The content also needs the `inner` styles, which wrap it and provide the offsets. */
export const ModalContent = createModalCompoundComponent(
  'ModalContent',
  ModalBaseContent,
  'content',
  (ctx) => ({ innerProps: ctx.getStyles('inner') }),
)
