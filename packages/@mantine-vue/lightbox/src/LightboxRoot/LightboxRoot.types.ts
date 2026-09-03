import type { VNodeChild } from 'vue'
import type { EmblaOptionsType } from 'embla-carousel'
import type { BoxProps, Factory, TransitionOverride } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { LightboxLabels, LightboxSlideData } from '../types'

export type LightboxRootStylesNames =
  | 'root'
  | 'overlay'
  | 'content'
  | 'toolbar'
  | 'toolbarGroup'
  | 'toolbarButton'
  | 'counter'
  | 'slides'
  | 'slidesViewport'
  | 'slidesContainer'
  | 'slide'
  | 'slideImage'
  | 'slideVideo'
  | 'thumbnails'
  | 'thumbnailsViewport'
  | 'thumbnailsContainer'
  | 'thumbnail'
  | 'thumbnailImage'
  | 'navigation'
  | 'navigationButton'
  | 'caption'
  | 'closeButton'

export type LightboxCssVariables = {
  root:
    | '--lightbox-transition-duration'
    | '--lightbox-overlay-color'
    | '--lightbox-z-index'
    | '--lightbox-toolbar-height'
    | '--lightbox-thumbnails-height'
}

export interface LightboxRootOwnProps extends StylesApiProps<LightboxRootFactory> {
  /** Determines whether the lightbox is opened */
  opened: boolean
  /** Array of slide data objects */
  slides: LightboxSlideData[]
  /** Controlled current slide index */
  currentIndex?: number
  /** Labels used for accessibility and localization */
  labels?: Partial<LightboxLabels>
  /** Enables image zoom on click, wheel and pinch @default false */
  withZoom?: boolean
  /** Shows the bottom thumbnail strip @default false */
  withThumbnails?: boolean
  /** Adds the fullscreen toggle to the toolbar @default false */
  withFullscreen?: boolean
  /** Adds the download button to the toolbar @default false */
  withDownload?: boolean
  /** Enables infinite loop navigation @default false */
  loop?: boolean
  /** Closes the lightbox when the empty space around slide content is clicked @default false */
  closeOnClickOutside?: boolean
  /** Closes the lightbox when swiping down on mobile @default true */
  closeOnSwipeDown?: boolean
  /** Enables keyboard shortcuts; Escape always closes the lightbox @default true */
  withKeyboardEvents?: boolean
  /** Determines whether focus is returned to the last active element after close @default true */
  returnFocus?: boolean
  /** Adds an initial hidden focus target for pointer-opened lightboxes @default true */
  withInitialFocusPlaceholder?: boolean
  /** Determines whether the lightbox is rendered inside a portal @default true */
  withinPortal?: boolean
  /** Z-index of the overlay and content @default 400 */
  zIndex?: string | number
  /** Transition duration in milliseconds @default 200 */
  transitionDuration?: number
  /** Props passed to the content transition */
  transitionProps?: TransitionOverride
  /** Additional Embla carousel options; loop and startIndex are controlled by root props */
  emblaOptions?: EmblaOptionsType
  /** Maximum image zoom scale @default 3 */
  zoomMaxScale?: number
  /** Enables animated programmatic slide transitions @default false */
  withSlideTransition?: boolean
}

export interface LightboxRootProps
  extends Omit<BoxProps, keyof LightboxRootOwnProps>, LightboxRootOwnProps {}
export interface LightboxRootEmits {
  close: []
  'update:opened': [opened: boolean]
  indexChange: [index: number]
  'update:currentIndex': [index: number]
}
export interface LightboxRootSlots {
  default?: () => VNodeChild
}
export type LightboxRootFactory = Factory<{
  props: LightboxRootProps
  slots: LightboxRootSlots
  emits: LightboxRootEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: LightboxRootStylesNames
  vars: LightboxCssVariables
}>
