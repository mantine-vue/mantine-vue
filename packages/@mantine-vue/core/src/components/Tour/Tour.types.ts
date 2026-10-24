import type { Ref, VNodeChild } from 'vue'
import type { BoxProps, Factory, MantineColor, StylesApiProps } from '../../core'
import type { FloatingPosition } from '../../utils/Floating'
import type { PortalProps } from '../Portal'
import type { TransitionOverride } from '../Transition'

export type TourTarget = string | Ref<HTMLElement | null>
export interface TourLabels {
  skip: string
  back: string
  next: string
  close: string
  stepCounter: (current: number, total: number) => string
  beacon: string
}
export interface TourStepProps {
  target?: TourTarget
  title?: VNodeChild
  position?: FloatingPosition
  withOverlay?: boolean
  spotlightPadding?: number
  spotlightRadius?: number
  withBeacon?: boolean
  onStepOpen?: () => void
  onStepClose?: () => void
}
export interface TourStepData extends TourStepProps {
  content?: () => VNodeChild
}
export interface TourRootProps extends TourOwnProps {
  stepsCount: number
}
export interface TourOverlayProps {
  targetRect?: { top: number; left: number; width: number; height: number } | null
  color?: string
  withInteraction?: boolean
}
export interface TourTooltipProps extends BoxProps {
  targetElement?: HTMLElement | null
  position?: FloatingPosition
  mounted?: boolean
  transitionProps?: TransitionOverride
}
export interface TourBeaconProps extends BoxProps {
  target?: TourTarget
}
export type TourNavigationProps = BoxProps
export type TourTitleProps = BoxProps
export type TourBodyProps = BoxProps
export type TourCloseButtonProps = BoxProps
export type TourStylesNames =
  | 'root'
  | 'overlay'
  | 'spotlight'
  | 'tooltip'
  | 'title'
  | 'body'
  | 'navigation'
  | 'closeButton'
  | 'stepCounter'
  | 'beacon'
  | 'beaconPulse'
  | 'navigationButton'
export type TourCssVariables = {
  root:
    | '--tour-z-index'
    | '--tour-overlay-color'
    | '--tour-tooltip-radius'
    | '--tour-tooltip-shadow'
    | '--tour-beacon-size'
    | '--tour-beacon-color'
    | '--tour-color'
}
export interface TourOwnProps extends StylesApiProps<TourFactory> {
  /** Whether the tour is active @default false */
  active?: boolean
  /** Controlled current step index */
  step?: number
  /** Uncontrolled default step index @default 0 */
  defaultStep?: number
  /** Tour mode @default "guided" */
  mode?: 'guided' | 'beacon'
  /** Whether to display the overlay @default true */
  withOverlay?: boolean
  /** Whether pointer events pass through the spotlight cutout to the target element, the rest of the overlay keeps blocking clicks @default false */
  withOverlayInteraction?: boolean
  /** Whether to display the close button @default true */
  withCloseButton?: boolean
  /** Whether keyboard navigation is enabled in guided mode @default true */
  withKeyboardNavigation?: boolean
  /** Whether to scroll target elements into view @default true */
  withScrollIntoView?: boolean
  /** Custom scroll handler */
  scrollToHandler?: (element: HTMLElement) => void
  /** Padding around the spotlight cutout in px @default 8 */
  spotlightPadding?: number
  /** Border radius of the spotlight cutout in px @default 4 */
  spotlightRadius?: number
  /** Whether pressing Escape closes the tour @default true */
  closeOnEscape?: boolean
  /** Whether clicking the overlay closes the tour, with `withOverlayInteraction` only clicks outside the spotlight cutout close it @default false */
  closeOnOverlayClick?: boolean
  /** Labels for tour UI elements */
  labels?: Partial<TourLabels>
  /** Whether to render inside a portal @default true */
  withinPortal?: boolean
  /** Props passed to the Portal component */
  portalProps?: PortalProps
  /** z-index of the tour @default 10000 */
  zIndex?: string | number
  /** Transition props for the tooltip @default { duration: 200, transition: 'pop' } */
  transitionProps?: TransitionOverride
  /** Duration of the tooltip position transition between steps in ms @default 300 */
  stepTransitionDuration?: number
  /** Max width of the tooltip, tooltip always takes this width if viewport allows @default 360 */
  maxWidth?: number
  /** Tour step overlay color @default "rgba(0, 0, 0, 0.5)" */
  overlayColor?: string
  /** Key of `theme.colors` or any valid CSS color, controls beacon color and `Tour.Navigation` next button color @default theme.primaryColor */
  color?: MantineColor
  /** Key of `theme.shadows` or any valid CSS box-shadow value, controls the tooltip shadow @default 'md' */
  tooltipShadow?: string
}
export interface TourProps extends Omit<BoxProps, keyof TourOwnProps>, TourOwnProps {}
export interface TourSlots {
  default?: () => VNodeChild
}
export interface TourEmits {
  close: []
  'update:step': [step: number]
  stepChange: [step: number]
  stepOpen: [step: number]
  stepClose: [step: number]
}
export type TourFactory = Factory<{
  props: TourProps
  slots: TourSlots
  emits: TourEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: TourStylesNames
  vars: TourCssVariables
}>
