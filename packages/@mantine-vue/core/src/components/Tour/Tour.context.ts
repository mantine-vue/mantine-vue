import { createSafeContext } from '../../core'
import type { MantineColor } from '../../core'
import type { TourLabels } from './Tour.types'

export const defaultTourLabels: TourLabels = {
  skip: 'Skip',
  back: 'Back',
  next: 'Next',
  close: 'Close',
  stepCounter: (current, total) => `${current} of ${total}`,
  beacon: 'Start tour',
}

export interface TourContextValue {
  getStyles: (selector: string, options?: any) => any
  step: number
  setStep: (step: number) => void
  stepsCount: number
  close: () => void
  withOverlay: boolean
  withOverlayInteraction: boolean
  withCloseButton: boolean
  closeOnOverlayClick: boolean
  spotlightPadding: number
  spotlightRadius: number
  color?: MantineColor
  labels: TourLabels
  titleId: string
  bodyId: string
  titleMounted: boolean
  bodyMounted: boolean
  registerTitle: (id: string | null) => void
  registerBody: (id: string | null) => void
  targetElement: HTMLElement | null
  setTargetElement: (element: HTMLElement | null) => void
}
export const [provideTourContext, useTourContext] = createSafeContext<TourContextValue>(
  'Tour component was not found in tree',
)
