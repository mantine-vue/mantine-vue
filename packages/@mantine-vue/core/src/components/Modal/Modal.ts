import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from './Modal.compound'
import { factory } from '../../core'
import ModalComponent from './Modal.vue'
import type { ModalFactory } from './Modal.types'
import ModalRootComponent, { varsResolver } from './ModalRoot.vue'
import classes from './Modal.module.css'

export const ModalRoot = ModalRootComponent

export { ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalTitle }

export const Modal = factory<ModalFactory>(ModalComponent, {
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
  ModalEmits,
  ModalFactory,
  ModalProps,
  ModalRootProps,
  ModalRootSlots,
  ModalSlots,
  ModalStylesNames,
} from './Modal.types'
