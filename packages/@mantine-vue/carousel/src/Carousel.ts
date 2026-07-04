import {
  Comment,
  computed,
  defineComponent,
  h,
  ref,
  watch,
  type DefineComponent,
  type PropType,
  type VNode,
} from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { useId } from '@mantine-vue/hooks'
import {
  Box,
  createVarsResolver,
  getSpacing,
  rem,
  useDirection,
  useProps,
  useStyles,
  UnstyledButton,
  VisuallyHidden,
  withBoxProps,
  AccordionChevron,
} from '@mantine-vue/core'
import { provideCarouselContext } from './Carousel.context'
import { CarouselSlide } from './CarouselSlide'
import { CarouselContainerVariables, CarouselVariables } from './CarouselVariables'
import { getChevronRotation } from './get-chevron-rotation'
import { clamp, getNextIndicatorIndex, getPreviousIndicatorIndex } from './get-indicator-navigation'
import classes from './Carousel.module.css'

export type CarouselStylesNames =
  | 'slide'
  | 'root'
  | 'viewport'
  | 'container'
  | 'controls'
  | 'control'
  | 'indicators'
  | 'indicator'

export interface CarouselProps {
  /** Options passed down to embla carousel */
  emblaOptions?: EmblaOptionsType
  /** Called when next slide is shown */
  onNextSlide?: () => void
  /** Called when previous slider is shown */
  onPreviousSlide?: () => void
  /** Called with slide index when slide changes */
  onSlideChange?: (index: number) => void
  /** Get embla API as ref */
  getEmblaApi?: (embla: EmblaCarouselType) => void
  /** Props passed down to next control */
  nextControlProps?: Record<string, any>
  /** Props passed down to previous control */
  previousControlProps?: Record<string, any>
  /** Controls size of the next and previous controls @default 26 */
  controlSize?: string | number
  /** Controls position of the next and previous controls, key of `theme.spacing` or any valid CSS value @default 'sm' */
  controlsOffset?: string | number
  /** Controls slide width based on viewport width @default '100%' */
  slideSize?: string | number | Record<string, string | number>
  /** Key of theme.spacing or number to set gap between slides */
  slideGap?: string | number | Record<string, string | number>
  /** Carousel orientation @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** Determines type of queries used for responsive styles @default 'media' */
  type?: 'media' | 'container'
  /** Slides container `height`, required for vertical orientation */
  height?: string | number
  /** Determines whether gap between slides should be treated as part of the slide size @default true */
  includeGapInSize?: boolean
  /** Index of initial slide */
  initialSlide?: number
  /** Determines whether next/previous controls should be displayed @default true */
  withControls?: boolean
  /** Determines whether indicators should be displayed @default false */
  withIndicators?: boolean
  /** A list of embla plugins */
  plugins?: EmblaPluginType[]
  /** Icon of the next control */
  nextControlIcon?: any
  /** Icon of the previous control */
  previousControlIcon?: any
  /** Determines whether arrow key should switch slides @default true */
  withKeyboardEvents?: boolean
  /** Function to get props for indicator button */
  getIndicatorProps?: (index: number) => Record<string, any>
  id?: string
  classNames?: any
  styles?: any
  vars?: any
  unstyled?: boolean
  mod?: any
}

const defaultProps = {
  controlSize: 26,
  controlsOffset: 'sm',
  slideSize: '100%',
  slideGap: 0,
  orientation: 'horizontal',
  includeGapInSize: true,
  initialSlide: 0,
  withControls: true,
  withIndicators: false,
  withKeyboardEvents: true,
  type: 'media',
} as const

const defaultEmblaOptions: EmblaOptionsType = {
  align: 'center',
  loop: false,
  slidesToScroll: 1,
  dragFree: false,
  inViewThreshold: 0,
  skipSnaps: false,
  containScroll: 'trimSnaps',
}

const varsResolver = createVarsResolver<any>((_, { height, controlSize, controlsOffset }) => ({
  root: {
    '--carousel-height': rem(height),
    '--carousel-control-size': rem(controlSize),
    '--carousel-controls-offset': getSpacing(controlsOffset),
  },
}))

function useRandomClassName() {
  return `__mantine-vue-carousel-${Math.random().toString(36).slice(2, 9)}`
}

function countRealSlides(nodes: VNode[] | undefined): number {
  if (!nodes) {
    return 0
  }

  return nodes.filter((node) => node.type !== Comment).length
}

const CarouselBaseComponent = defineComponent({
  name: 'Carousel',
  inheritAttrs: false,
  props: {
    emblaOptions: { type: Object as PropType<EmblaOptionsType>, default: undefined },
    onNextSlide: { type: Function as PropType<() => void>, default: undefined },
    onPreviousSlide: { type: Function as PropType<() => void>, default: undefined },
    onSlideChange: { type: Function as PropType<(index: number) => void>, default: undefined },
    getEmblaApi: {
      type: Function as PropType<(embla: EmblaCarouselType) => void>,
      default: undefined,
    },
    nextControlProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    previousControlProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    controlSize: { type: [String, Number], default: undefined },
    controlsOffset: { type: [String, Number], default: undefined },
    slideSize: { type: [String, Number, Object], default: undefined },
    slideGap: { type: [String, Number, Object], default: undefined },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: undefined },
    type: { type: String as PropType<'media' | 'container'>, default: undefined },
    height: { type: [String, Number], default: undefined },
    includeGapInSize: { type: Boolean, default: undefined },
    initialSlide: { type: Number, default: undefined },
    withControls: { type: Boolean, default: undefined },
    withIndicators: { type: Boolean, default: undefined },
    plugins: { type: Array as PropType<EmblaPluginType[]>, default: undefined },
    nextControlIcon: { type: null, default: undefined },
    previousControlIcon: { type: null, default: undefined },
    withKeyboardEvents: { type: Boolean, default: undefined },
    getIndicatorProps: {
      type: Function as PropType<(index: number) => Record<string, any>>,
      default: undefined,
    },
    id: { type: String, default: undefined },
    mod: { type: [Object, Array] as PropType<any>, default: undefined },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('Carousel', defaultProps, rawProps)

    const getStyles = useStyles({
      name: 'Carousel',
      classes,
      props,
      get className() {
        return attrs.class
      },
      get style() {
        return attrs.style as any
      },
      get classNames() {
        return props.classNames as any
      },
      get styles() {
        return props.styles as any
      },
      get unstyled() {
        return props.unstyled
      },
      get vars() {
        return props.vars as any
      },
      varsResolver,
    })

    const _id = useId(props.id)
    const responsiveClassName = useRandomClassName()
    const { dir } = useDirection()

    const emblaOptionsRef = computed<EmblaOptionsType>(() => ({
      axis: props.orientation === 'horizontal' ? 'x' : 'y',
      direction: props.orientation === 'horizontal' ? dir.value : undefined,
      startIndex: props.initialSlide,
      ...defaultEmblaOptions,
      ...props.emblaOptions,
    }))
    const pluginsRef = computed(() => props.plugins ?? [])

    const [emblaNode, embla] = emblaCarouselVue(emblaOptionsRef, pluginsRef)

    const selected = ref(0)
    const slidesCount = ref(0)
    const slotSlideCount = ref(0)

    const handleScroll = (index: number) => {
      embla.value?.scrollTo(index)
    }

    const handleSelect = () => {
      const instance = embla.value
      if (!instance) {
        return
      }
      const slide = instance.selectedScrollSnap()
      const changed = slide !== selected.value
      selected.value = slide
      if (changed) {
        props.onSlideChange?.(slide)
      }
    }

    const handlePrevious = () => {
      embla.value?.scrollPrev()
      props.onPreviousSlide?.()
    }

    const handleNext = () => {
      embla.value?.scrollNext()
      props.onNextSlide?.()
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (!props.withKeyboardEvents) {
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNext()
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePrevious()
      }

      if (event.key === 'Home') {
        event.preventDefault()
        embla.value?.scrollTo(0)
      }

      if (event.key === 'End') {
        event.preventDefault()
        embla.value?.scrollTo(embla.value.scrollSnapList().length - 1)
      }
    }

    const handleIndicatorKeyDown = (event: KeyboardEvent, index: number) => {
      const isHorizontal = props.orientation === 'horizontal'
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
      const parent = (event.currentTarget as HTMLElement | null)?.parentElement

      if (event.key === nextKey) {
        event.preventDefault()
        const nextIndex = getNextIndicatorIndex(index, slidesCount.value)
        handleScroll(nextIndex)
        ;(parent?.children[nextIndex] as HTMLElement | undefined)?.focus()
      }

      if (event.key === prevKey) {
        event.preventDefault()
        const prevIndex = getPreviousIndicatorIndex(index, slidesCount.value)
        handleScroll(prevIndex)
        ;(parent?.children[prevIndex] as HTMLElement | undefined)?.focus()
      }

      if (event.key === 'Home') {
        event.preventDefault()
        handleScroll(0)
        ;(parent?.children[0] as HTMLElement | undefined)?.focus()
      }

      if (event.key === 'End') {
        event.preventDefault()
        handleScroll(slidesCount.value - 1)
        ;(parent?.children[slidesCount.value - 1] as HTMLElement | undefined)?.focus()
      }
    }

    watch(
      embla,
      (instance, _prev, onCleanup) => {
        if (!instance) {
          return
        }

        props.getEmblaApi?.(instance)
        handleSelect()
        slidesCount.value = instance.scrollSnapList().length
        instance.on('select', handleSelect)

        onCleanup(() => {
          instance.off('select', handleSelect)
        })
      },
      { immediate: true },
    )

    watch([slotSlideCount, () => props.emblaOptions?.slidesToScroll], ([childrenCount]) => {
      const instance = embla.value
      if (!instance) {
        return
      }

      instance.reInit()
      slidesCount.value = instance.scrollSnapList().length
      selected.value = clamp(selected.value, 0, childrenCount - 1)
    })

    provideCarouselContext({
      getStyles,
      get orientation() {
        return props.orientation
      },
    } as any)

    return () => {
      const canScrollPrev = embla.value?.canScrollPrev() || false
      const canScrollNext = embla.value?.canScrollNext() || false

      const defaultSlot = slots.default?.()
      slotSlideCount.value = countRealSlides(defaultSlot)

      const indicators = Array(slidesCount.value)
        .fill(0)
        .map((_, index) =>
          h(UnstyledButton, {
            ...getStyles('indicator'),
            key: index,
            role: 'tab',
            'aria-label': `Go to slide ${index + 1}`,
            'aria-selected': index === selected.value,
            tabindex: index === selected.value ? 0 : -1,
            'data-active': index === selected.value || undefined,
            onClick: () => handleScroll(index),
            onKeydown: (event: KeyboardEvent) => handleIndicatorKeyDown(event, index),
            'data-orientation': props.orientation,
            onMousedown: (event: Event) => event.preventDefault(),
            ...props.getIndicatorProps?.(index),
          }),
        )

      const variablesProps = {
        selector: `.${responsiveClassName}`,
        slideSize: props.slideSize,
        slideGap: props.slideGap,
      }

      return [
        props.type === 'container'
          ? h(CarouselContainerVariables, variablesProps)
          : h(CarouselVariables, variablesProps),

        h(
          Box,
          {
            role: 'region',
            'aria-roledescription': 'carousel',
            ...attrs,
            ...getStyles('root', { className: responsiveClassName }),
            id: _id.value,
            mod: [
              { orientation: props.orientation, 'include-gap-in-size': props.includeGapInSize },
              props.mod,
            ],
            onKeydownCapture: handleKeydown,
          },
          () => [
            h(
              VisuallyHidden,
              { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' },
              () =>
                slidesCount.value > 0 ? `Slide ${selected.value + 1} of ${slidesCount.value}` : '',
            ),

            props.withControls &&
              h('div', { ...getStyles('controls'), 'data-orientation': props.orientation }, [
                h(
                  UnstyledButton,
                  {
                    'aria-controls': _id.value,
                    'aria-label': 'Previous slide',
                    'aria-disabled': !canScrollPrev,
                    'data-inactive': !canScrollPrev || undefined,
                    'data-type': 'previous',
                    tabindex: canScrollPrev ? 0 : -1,
                    ...props.previousControlProps,
                    ...getStyles('control', {
                      className: props.previousControlProps?.className,
                      style: props.previousControlProps?.style,
                    }),
                    onClick: (event: Event) => {
                      handlePrevious()
                      props.previousControlProps?.onClick?.(event)
                    },
                  },
                  () =>
                    typeof props.previousControlIcon !== 'undefined'
                      ? props.previousControlIcon
                      : h(AccordionChevron, {
                          style: {
                            transform: `rotate(${getChevronRotation({
                              dir: dir.value,
                              orientation: props.orientation,
                              direction: 'previous',
                            })}deg)`,
                          },
                        }),
                ),

                h(
                  UnstyledButton,
                  {
                    'aria-controls': _id.value,
                    'aria-label': 'Next slide',
                    'aria-disabled': !canScrollNext,
                    'data-inactive': !canScrollNext || undefined,
                    'data-type': 'next',
                    tabindex: canScrollNext ? 0 : -1,
                    ...getStyles('control', {
                      className: props.nextControlProps?.className,
                      style: props.nextControlProps?.style,
                    }),
                    ...props.nextControlProps,
                    onClick: (event: Event) => {
                      handleNext()
                      props.nextControlProps?.onClick?.(event)
                    },
                  },
                  () =>
                    typeof props.nextControlIcon !== 'undefined'
                      ? props.nextControlIcon
                      : h(AccordionChevron, {
                          style: {
                            transform: `rotate(${getChevronRotation({
                              dir: dir.value,
                              orientation: props.orientation,
                              direction: 'next',
                            })}deg)`,
                          },
                        }),
                ),
              ]),

            h('div', { ...getStyles('viewport'), ref: emblaNode, 'data-type': props.type }, [
              h(
                'div',
                {
                  ...getStyles('container', { className: responsiveClassName }),
                  'data-orientation': props.orientation,
                },
                defaultSlot,
              ),
            ]),

            props.withIndicators &&
              h(
                'div',
                {
                  ...getStyles('indicators'),
                  role: 'tablist',
                  'aria-label': 'Slides',
                  'data-orientation': props.orientation,
                },
                indicators,
              ),
          ],
        ),
      ]
    }
  },
})

export const Carousel: DefineComponent<CarouselProps> & {
  classes: typeof classes
  varsResolver: typeof varsResolver
  Slide: typeof CarouselSlide
} = Object.assign(withBoxProps(CarouselBaseComponent) as DefineComponent<CarouselProps>, {
  classes,
  varsResolver,
  Slide: CarouselSlide,
})
