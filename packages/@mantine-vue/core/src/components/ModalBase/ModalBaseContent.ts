import { factory } from '../../core'
import type { ModalBaseContentFactory } from './ModalBaseContent.types'
import ModalBaseContentComponent from './ModalBaseContent.vue'

/** Transitioned, focus-trapped dialog surface shared by `Modal` and `Drawer`. */
export const ModalBaseContent = factory<ModalBaseContentFactory>(ModalBaseContentComponent)

export type {
  ModalBaseContentFactory,
  ModalBaseContentOwnProps,
  ModalBaseContentProps,
  ModalBaseContentSlots,
} from './ModalBaseContent.types'
