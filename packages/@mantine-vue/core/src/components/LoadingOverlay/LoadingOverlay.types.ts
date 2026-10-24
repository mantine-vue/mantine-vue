import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../core'
import type { LoaderProps } from '../Loader'
import type { OverlayProps } from '../Overlay'
import type { TransitionOverride } from '../Transition'

export type LoadingOverlayStylesNames = 'root' | 'loader' | 'overlay'

export type LoadingOverlayCssVariables = {
  root: '--lo-z-index'
}

/** Props declared by `LoadingOverlay` itself. See `LoadingOverlayProps` for the full public type. */
export interface LoadingOverlayOwnProps extends StylesApiProps<LoadingOverlayFactory> {
  /**
   * Props passed down to `Transition` component. Set `duration` to create custom transition or override default transition.
   *
   * @default { transition: 'fade', duration: 0 }
   */
  transitionProps?: TransitionOverride

  /** Props passed down to `Loader` component */
  loaderProps?: LoaderProps

  /**
   * Props passed down to `Overlay` component. Use to customizing blur, opacity, color and other properties.
   *
   * @default { backgroundOpacity: 0.75 }
   */
  overlayProps?: OverlayProps

  /**
   * Controls overlay visibility. Typically used with state (useState, useDisclosure).
   *
   * @default false
   */
  visible?: boolean

  /**
   * Controls `z-index` of both the overlay and loader. The loader receives `z-index + 1`.
   *
   * @default getDefaultZIndex('overlay')
   */
  zIndex?: string | number
}

export interface LoadingOverlayProps
  extends Omit<BoxProps, keyof LoadingOverlayOwnProps>, LoadingOverlayOwnProps {}

export interface LoadingOverlaySlots {
  /** Custom content rendered in place of the default loader. */
  loader?: () => VNodeChild
}

export type LoadingOverlayFactory = Factory<{
  props: LoadingOverlayProps
  slots: LoadingOverlaySlots
  ref: HTMLDivElement
  exposed: { rootElement: Element | null }
  element: 'div'
  stylesNames: LoadingOverlayStylesNames
  vars: LoadingOverlayCssVariables
}>
