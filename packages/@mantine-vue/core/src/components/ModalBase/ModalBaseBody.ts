import { factory } from '../../core'
import ModalBaseBodyComponent from './ModalBaseBody.vue'
import type { ModalBaseBodyFactory } from './ModalBaseBody.types'

export const ModalBaseBody = factory<ModalBaseBodyFactory>(ModalBaseBodyComponent)
export type {
  ModalBaseBodyProps,
  ModalBaseBodySlots,
  ModalBaseBodyFactory,
} from './ModalBaseBody.types'
