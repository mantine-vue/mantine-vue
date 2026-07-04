import { type Ref } from 'vue'
import { createStore, type MantineStore } from '@mantine-vue/store'
import type { ModalSettings, OpenConfirmModal, OpenContextModal } from './context'
import { handleCloseModal, modalsReducer, type ModalsAction, type ModalsState } from './reducer'

export type ModalsStore = MantineStore<ModalsState>

function randomId() {
  return `mantine-${Math.random().toString(36).slice(2, 11)}`
}

export const createModalsStore = () => createStore<ModalsState>({ modals: [], current: null })

export const modalsStore = createModalsStore()

export const useModalsState = (store: ModalsStore = modalsStore): Readonly<Ref<ModalsState>> =>
  store.value

const closingMap = new WeakMap<ModalsStore, boolean>()

function dispatch(action: ModalsAction, store: ModalsStore) {
  store.setState((state) => modalsReducer(state, action))
}

export function openModalAction(props: ModalSettings, store: ModalsStore = modalsStore): string {
  const { modalId, ...rest } = props
  const id = modalId || randomId()
  dispatch({ type: 'OPEN', modal: { id, type: 'content', props: rest } }, store)
  return id
}

export function openConfirmModalAction(
  props: OpenConfirmModal,
  store: ModalsStore = modalsStore,
): string {
  const { modalId, ...rest } = props
  const id = modalId || randomId()
  dispatch({ type: 'OPEN', modal: { id, type: 'confirm', props: rest } }, store)
  return id
}

export function openContextModalAction(
  modal: string,
  props: OpenContextModal,
  store: ModalsStore = modalsStore,
): string {
  const { modalId, ...rest } = props
  const id = modalId || randomId()
  dispatch({ type: 'OPEN', modal: { id, type: 'context', props: rest, ctx: modal } }, store)
  return id
}

export function closeModalAction(id: string, canceled?: boolean, store: ModalsStore = modalsStore) {
  if (!closingMap.get(store)) {
    const modal = store.getState().modals.find((item) => item.id === id)
    if (modal) {
      closingMap.set(store, true)
      handleCloseModal(modal, canceled)
      closingMap.set(store, false)
    }
  }

  dispatch({ type: 'CLOSE', modalId: id, canceled }, store)
}

export function closeAllModalsAction(canceled?: boolean, store: ModalsStore = modalsStore) {
  if (!closingMap.get(store)) {
    closingMap.set(store, true)
    store
      .getState()
      .modals.slice()
      .reverse()
      .forEach((modal) => handleCloseModal(modal, canceled))
    closingMap.set(store, false)
  }

  dispatch({ type: 'CLOSE_ALL', canceled }, store)
}

export function updateModalAction(
  payload: { modalId: string } & Partial<ModalSettings>,
  store: ModalsStore = modalsStore,
) {
  const { modalId, ...newProps } = payload
  dispatch({ type: 'UPDATE', modalId, newProps }, store)
}

export function updateContextModalAction(
  payload: { modalId: string } & Partial<OpenContextModal<any>>,
  store: ModalsStore = modalsStore,
) {
  const { modalId, ...newProps } = payload
  dispatch({ type: 'UPDATE', modalId, newProps }, store)
}

function openContextModalPayload(
  payload: OpenContextModal & { modal: string },
  store: ModalsStore = modalsStore,
): string {
  const { modal, ...rest } = payload
  return openContextModalAction(modal, rest, store)
}

export const modals = {
  open: (props: ModalSettings) => openModalAction(props),
  close: (id: string) => closeModalAction(id),
  closeAll: () => closeAllModalsAction(),
  openConfirmModal: (props: OpenConfirmModal) => openConfirmModalAction(props),
  openContextModal: (payload: OpenContextModal & { modal: string }) =>
    openContextModalPayload(payload),
  updateModal: (payload: { modalId: string } & Partial<OpenConfirmModal>) =>
    updateModalAction(payload),
  updateContextModal: (payload: { modalId: string } & Partial<OpenContextModal<any>>) =>
    updateContextModalAction(payload),
} as const

export const openModal = modals.open
export const closeModal = modals.close
export const closeAllModals = modals.closeAll
export const openConfirmModal = modals.openConfirmModal
export const openContextModal = modals.openContextModal
export const updateModal = modals.updateModal
export const updateContextModal = modals.updateContextModal
