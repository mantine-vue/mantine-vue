import { createSafeContext } from '../../core'

export interface ModalContextValue {
  /** Styles API accessor of the owning `Modal.Root`. */
  getStyles: any

  /** Whether the modal covers the whole viewport. */
  fullScreen: boolean

  /** Vertical offset of the modal, needed by the content to size its scroll area. */
  yOffset?: string | number

  /** Component used to render the scrollable area of the content. */
  scrollAreaComponent?: any
}

export const [provideModalContext, useModalContext] = createSafeContext<ModalContextValue>(
  'Modal component was not found in tree',
)
