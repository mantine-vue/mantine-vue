import type { Ref, VNodeChild } from 'vue'
import type { VueRefTarget } from '@mantine-vue/hooks'
import type { BoxProps, Factory, MantineColor, StylesApiProps } from '../../core'
import type { FloatingPosition } from '../../utils/Floating'
import type { TransitionProps } from '../Transition'

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
  transitionProps?: Partial<TransitionProps>
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
  rootRef?: VueRefTarget<Element>
  active?: boolean
  step?: number
  defaultStep?: number
  mode?: 'guided' | 'beacon'
  withOverlay?: boolean
  withOverlayInteraction?: boolean
  withCloseButton?: boolean
  withKeyboardNavigation?: boolean
  withScrollIntoView?: boolean
  scrollToHandler?: (element: HTMLElement) => void
  spotlightPadding?: number
  spotlightRadius?: number
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  labels?: Partial<TourLabels>
  withinPortal?: boolean
  portalProps?: Record<string, any>
  zIndex?: string | number
  transitionProps?: Partial<TransitionProps>
  stepTransitionDuration?: number
  maxWidth?: number
  overlayColor?: string
  color?: MantineColor
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
  props: Omit<TourProps, 'rootRef'>
  slots: TourSlots
  emits: TourEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: TourStylesNames
  vars: TourCssVariables
}>
