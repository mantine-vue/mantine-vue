import type { ModalSettings, ModalState } from './context'

export interface ModalsState {
  modals: ModalState[]
  current: ModalState | null
}

export interface OpenAction {
  type: 'OPEN'
  modal: ModalState
}

export interface CloseAction {
  type: 'CLOSE'
  modalId: string
  canceled?: boolean
}

export interface CloseAllAction {
  type: 'CLOSE_ALL'
  canceled?: boolean
}

export interface UpdateAction {
  type: 'UPDATE'
  modalId: string
  newProps: Partial<ModalSettings>
}

export type ModalsAction = OpenAction | CloseAction | CloseAllAction | UpdateAction

export function handleCloseModal(modal: ModalState, canceled?: boolean) {
  if (canceled && modal.type === 'confirm') {
    modal.props.onCancel?.()
  }

  modal.props.onClose?.()
}

export function modalsReducer(state: ModalsState, action: ModalsAction): ModalsState {
  switch (action.type) {
    case 'OPEN': {
      if (state.modals.some((modal) => modal.id === action.modal.id)) {
        return state
      }

      return {
        current: action.modal,
        modals: [...state.modals, action.modal],
      }
    }

    case 'CLOSE': {
      const modals = state.modals.filter((modal) => modal.id !== action.modalId)
      return {
        current: modals.length > 0 ? modals[modals.length - 1] : state.current,
        modals,
      }
    }

    case 'CLOSE_ALL': {
      return {
        current: state.current,
        modals: [],
      }
    }

    case 'UPDATE': {
      const modals = state.modals.map((modal) => {
        if (modal.id !== action.modalId) {
          return modal
        }

        if (modal.type === 'context') {
          return {
            ...modal,
            props: {
              ...modal.props,
              ...action.newProps,
              innerProps: {
                ...modal.props.innerProps,
                ...(action.newProps as any).innerProps,
              },
            },
          }
        }

        return { ...modal, props: { ...modal.props, ...action.newProps } } as ModalState
      })

      const current =
        state.current && state.current.id === action.modalId
          ? modals.find((modal) => modal.id === action.modalId) || state.current
          : state.current

      return { current, modals }
    }

    default:
      return state
  }
}
