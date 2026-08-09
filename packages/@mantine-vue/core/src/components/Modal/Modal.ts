import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from './Modal.compound'
import ModalComponent from './Modal.vue'
import ModalRootComponent, { varsResolver } from './ModalRoot.vue'
import classes from './Modal.module.css'

export const ModalRoot = ModalRootComponent

export { ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalTitle }

export const Modal = Object.assign(ModalComponent, {
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

export type {
  ModalCompoundProps,
  ModalCssVariables,
  ModalFactory,
  ModalProps,
  ModalRootProps,
  ModalRootSlots,
  ModalSlots,
  ModalStylesNames,
} from './Modal.types'
