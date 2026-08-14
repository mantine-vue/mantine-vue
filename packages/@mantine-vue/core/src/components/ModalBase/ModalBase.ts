import { factory } from '../../core'
import type { ModalBaseFactory } from './ModalBase.types'
import ModalBaseComponent from './ModalBase.vue'

export const ModalBase = factory<ModalBaseFactory>(ModalBaseComponent)

export type {
  ModalBaseFactory,
  ModalBaseOwnProps,
  ModalBaseProps,
  ModalBaseSlots,
} from './ModalBase.types'
