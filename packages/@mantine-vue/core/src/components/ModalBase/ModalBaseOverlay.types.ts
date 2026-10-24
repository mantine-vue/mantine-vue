import type { OverlayProps } from '../Overlay'
import type { TransitionOverride } from '../Transition'

/** Props declared by `ModalBaseOverlay` itself. See `ModalBaseOverlayProps` for the full public type. */
export interface ModalBaseOverlayOwnProps {
  /** Props passed to the `Transition` component. */
  transitionProps?: TransitionOverride

  /** Determines whether the overlay is visible. Defaults to the modal `opened` state. */
  visible?: boolean
}

export interface ModalBaseOverlayProps
  extends
    Omit<
      OverlayProps,
      keyof ModalBaseOverlayOwnProps | 'styles' | 'classNames' | 'variant' | 'vars'
    >,
    ModalBaseOverlayOwnProps {}
