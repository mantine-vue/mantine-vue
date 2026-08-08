import { withBoxProps } from '../../core'
import ModalBaseContentComponent from './ModalBaseContent.vue'

/** Transitioned, focus-trapped dialog surface shared by `Modal` and `Drawer`. */
export const ModalBaseContent = withBoxProps(ModalBaseContentComponent)

export type {
  ModalBaseContentOwnProps,
  ModalBaseContentProps,
  ModalBaseContentSlots,
} from './ModalBaseContent.types'
