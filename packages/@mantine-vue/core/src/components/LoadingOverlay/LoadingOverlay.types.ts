import type { BoxProps, StylesApiProps } from '../../core'

export type LoadingOverlayStylesNames = 'root' | 'loader' | 'overlay'

/** Props declared by `LoadingOverlay` itself. See `LoadingOverlayProps` for the full public type. */
export interface LoadingOverlayOwnProps extends StylesApiProps<LoadingOverlayProps> {
  /**
   * Props passed down to `Transition` component. Set `duration` to create custom transition or override default transition.
   *
   * @default { transition: 'fade', duration: 0 }
   */
  transitionProps?: Record<string, any>

  /** Props passed down to `Loader` component */
  loaderProps?: Record<string, any>

  /**
   * Props passed down to `Overlay` component. Use to customizing blur, opacity, color and other properties.
   *
   * @default { backgroundOpacity: 0.75 }
   */
  overlayProps?: Record<string, any>

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
