import { factory } from '../../core'
import ModalBaseTitleComponent from './ModalBaseTitle.vue'
import type { ModalBaseTitleFactory } from './ModalBaseTitle.types'

export const ModalBaseTitle = factory<ModalBaseTitleFactory>(ModalBaseTitleComponent)

export type {
  ModalBaseTitleFactory,
  ModalBaseTitleProps,
  ModalBaseTitleSlots,
} from './ModalBaseTitle.types'
