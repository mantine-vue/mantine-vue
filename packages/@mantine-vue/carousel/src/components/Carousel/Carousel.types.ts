import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'

export type CarouselStylesNames =
  | 'slide'
  | 'root'
  | 'viewport'
  | 'container'
  | 'controls'
  | 'control'
  | 'indicators'
  | 'indicator'

/** Props accepted by `Carousel`. */
export interface CarouselProps {
  /** Options passed to Embla Carousel. */
  emblaOptions?: EmblaOptionsType
  /** Props passed down to next control. */
  nextControlProps?: Record<string, any>
  /** Props passed down to previous control. */
  previousControlProps?: Record<string, any>
  /** Previous and next control size @default 26 */
  controlSize?: string | number
  /** Controls offset @default 'sm' */
  controlsOffset?: string | number
  /** Slide width @default '100%' */
  slideSize?: string | number | Record<string, string | number>
  /** Gap between slides @default 0 */
  slideGap?: string | number | Record<string, string | number>
  /** Carousel orientation @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Responsive query type @default 'media' */
  type?: 'media' | 'container'
  /** Carousel height, required for vertical orientation. */
  height?: string | number
  /** Includes gap in slide size calculations @default true */
  includeGapInSize?: boolean
  /** Initial slide index @default 0 */
  initialSlide?: number
  /** Displays previous and next controls @default true */
  withControls?: boolean
  /** Displays slide indicators @default false */
  withIndicators?: boolean
  /** A list of Embla plugins. */
  plugins?: EmblaPluginType[]
  /** Icon of the next control */
  nextControlIcon?: any
  /** Icon of the previous control */
  previousControlIcon?: any
  /** Enables arrow-key navigation @default true */
  withKeyboardEvents?: boolean

  /** Function to get props for indicator button */
  getIndicatorProps?: (index: number) => Record<string, any>
  /** Id assigned to the carousel root element and referenced by previous and next controls. */
  id?: string
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  mod?: any
}

/** Events emitted by `Carousel`. */
export interface CarouselEmits {
  /** Emitted when the next slide control is activated. */
  'next-slide': []
  /** Emitted when the previous slide control is activated. */
  'previous-slide': []
  /** Emitted with the selected slide index. */
  'slide-change': [index: number]
  /** Emitted with the Embla API instance once it becomes available. */
  'embla-api-ready': [embla: EmblaCarouselType]
}
