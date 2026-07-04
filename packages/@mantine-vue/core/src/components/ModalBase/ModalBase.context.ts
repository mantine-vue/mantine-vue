import { createSafeContext } from '../../core'
export interface ModalBaseContextValue {
  unstyled?: boolean
  titleMounted: boolean
  bodyMounted: boolean
  setTitleMounted: (value: boolean) => void
  setBodyMounted: (value: boolean) => void
  getTitleId: () => string
  getBodyId: () => string
  transitionProps?: Record<string, any>
  onExitTransitionEnd?: () => void
  onEnterTransitionEnd?: () => void
  zIndex?: string | number
  opened: boolean
  onClose: () => void
  closeOnEscape?: boolean
  trapFocus?: boolean
  closeOnClickOutside?: boolean
}
export const [provideModalBaseContext, useModalBaseContext] =
  createSafeContext<ModalBaseContextValue>('ModalBase component was not found in tree')
