import { factory } from '../../core'
import ModalBaseHeaderComponent from './ModalBaseHeader.vue'
import type { ModalBaseHeaderFactory } from './ModalBaseHeader.types'

export const ModalBaseHeader = factory<ModalBaseHeaderFactory>(ModalBaseHeaderComponent)

export type {
  ModalBaseHeaderFactory,
  ModalBaseHeaderProps,
  ModalBaseHeaderSlots,
} from './ModalBaseHeader.types'
