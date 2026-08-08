export { ModalsProvider } from './components/ModalsProvider'
export { useModals } from './use-modals'
export { ConfirmModal } from './components/ConfirmModal'
export {
  modals,
  openModal,
  closeModal,
  closeAllModals,
  openConfirmModal,
  openContextModal,
  updateModal,
  updateContextModal,
  createModalsStore,
  modalsStore,
  useModalsState,
  openModalAction,
  openConfirmModalAction,
  openContextModalAction,
  closeModalAction,
  closeAllModalsAction,
  updateModalAction,
  updateContextModalAction,
} from './modals.store'
export { modalsReducer, handleCloseModal } from './reducer'

export type { ModalsProviderProps } from './components/ModalsProvider'
export type {
  ConfirmModalCallbacks,
  ConfirmModalEmits,
  ConfirmModalProps,
} from './components/ConfirmModal'
export type { ModalsStore } from './modals.store'
export type { ModalsState, ModalsAction } from './reducer'
export type {
  ContextModalProps,
  ModalSettings,
  ModalState,
  ModalsContextProps,
  OpenConfirmModal,
  OpenContextModal,
  ConfirmLabels,
} from './context'
