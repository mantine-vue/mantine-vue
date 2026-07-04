import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
} from 'vue'
import { withBoxProps, Box, createVarsResolver, rem, useProps, useStyles } from '../../core'
import { ScrollAreaCorner } from './ScrollAreaCorner/ScrollAreaCorner'
import { ScrollAreaRoot } from './ScrollAreaRoot/ScrollAreaRoot'
import { ScrollAreaScrollbar } from './ScrollAreaScrollbar/ScrollAreaScrollbar'
import { ScrollAreaThumb } from './ScrollAreaThumb/ScrollAreaThumb'
import { ScrollAreaViewport } from './ScrollAreaViewport/ScrollAreaViewport'
import classes from './ScrollArea.module.css'

export type ScrollAreaStylesNames =
  | 'root'
  | 'viewport'
  | 'scrollbar'
  | 'thumb'
  | 'corner'
  | 'content'
export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover' | 'never'
export type ScrollAreaScrollbars = 'x' | 'y' | 'xy' | false

export interface ScrollAreaProps {
  scrollbarSize?: number | string
  type?: ScrollAreaType
  scrollHideDelay?: number
  scrollbars?: ScrollAreaScrollbars
  offsetScrollbars?: boolean | 'x' | 'y' | 'present'
  viewportProps?: Record<string, any>
  onScrollPositionChange?: (position: { x: number; y: number }) => void
  onBottomReached?: () => void
  onTopReached?: () => void
  onLeftReached?: () => void
  onRightReached?: () => void
  overscrollBehavior?: string
  startScrollPosition?: { x?: number; y?: number }
}

const defaultProps = {
  scrollHideDelay: 1000,
  type: 'hover',
  scrollbars: 'xy',
} as const

const varsResolver = createVarsResolver<any>(
  (_, { scrollbarSize, overscrollBehavior, scrollbars }) => {
    let overrideOverscrollBehavior = overscrollBehavior

    if (overscrollBehavior && scrollbars) {
      if (scrollbars === 'x') {
        overrideOverscrollBehavior = `${overscrollBehavior} auto`
      } else if (scrollbars === 'y') {
        overrideOverscrollBehavior = `auto ${overscrollBehavior}`
      }
    }

    return {
      root: {
        '--scrollarea-scrollbar-size': rem(scrollbarSize),
        '--scrollarea-over-scroll-behavior': overrideOverscrollBehavior,
      },
    }
  },
)

function toOffsetScrollbars(value: ScrollAreaProps['offsetScrollbars']) {
  return value === true ? 'xy' : value || undefined
}

export const ScrollAreaBase = defineComponent({
  name: 'ScrollArea',
  inheritAttrs: false,
  props: {
    scrollbarSize: [String, Number] as PropType<string | number>,
    type: { type: String as PropType<ScrollAreaType>, default: undefined },
    scrollHideDelay: { type: Number, default: undefined },
    scrollbars: { type: [String, Boolean] as PropType<ScrollAreaScrollbars>, default: undefined },
    offsetScrollbars: {
      type: [String, Boolean] as PropType<ScrollAreaProps['offsetScrollbars']>,
      default: undefined,
    },
    viewportProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    onScrollPositionChange: {
      type: Function as PropType<ScrollAreaProps['onScrollPositionChange']>,
      default: undefined,
    },
    onBottomReached: {
      type: Function as PropType<ScrollAreaProps['onBottomReached']>,
      default: undefined,
    },
    onTopReached: {
      type: Function as PropType<ScrollAreaProps['onTopReached']>,
      default: undefined,
    },
    onLeftReached: {
      type: Function as PropType<ScrollAreaProps['onLeftReached']>,
      default: undefined,
    },
    onRightReached: {
      type: Function as PropType<ScrollAreaProps['onRightReached']>,
      default: undefined,
    },
    overscrollBehavior: { type: String, default: undefined },
    startScrollPosition: {
      type: Object as PropType<ScrollAreaProps['startScrollPosition']>,
      default: undefined,
    },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps('ScrollArea', defaultProps, rawProps)
    const viewport = ref<HTMLDivElement | null>(null)
    const content = ref<HTMLDivElement | null>(null)
    const hovered = ref(false)
    const scrollingX = ref(false)
    const scrollingY = ref(false)
    const overflowX = ref(false)
    const overflowY = ref(false)
    const prevAtTop = ref(true)
    const prevAtBottom = ref(false)
    const prevAtLeft = ref(true)
    const prevAtRight = ref(false)
    const prevScrollTop = ref(0)
    const prevScrollLeft = ref(0)
    let resizeObserver: ResizeObserver | null = null
    let scrollTimerX: number | null = null
    let scrollTimerY: number | null = null
    let hoverHideTimer: number | null = null

    const getStyles = useStyles({
      name: 'ScrollArea',
      props,
      classes,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
      varsResolver,
    })

    const updateOverflow = () => {
      if (!viewport.value) {
        overflowX.value = false
        overflowY.value = false
        return
      }

      overflowX.value = viewport.value.offsetWidth < viewport.value.scrollWidth
      overflowY.value = viewport.value.offsetHeight < viewport.value.scrollHeight
    }

    const observeOverflow = () => {
      resizeObserver?.disconnect()
      resizeObserver = null

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(updateOverflow)

        if (viewport.value) {
          resizeObserver.observe(viewport.value)
        }

        if (content.value) {
          resizeObserver.observe(content.value)
        }
      }

      updateOverflow()
    }

    const setScrolling = (axis: 'x' | 'y') => {
      const current = axis === 'x' ? scrollingX : scrollingY
      const currentTimer = axis === 'x' ? scrollTimerX : scrollTimerY

      current.value = true

      if (currentTimer) {
        window.clearTimeout(currentTimer)
      }

      const nextTimer = window.setTimeout(() => {
        current.value = false
      }, props.scrollHideDelay)

      if (axis === 'x') {
        scrollTimerX = nextTimer
      } else {
        scrollTimerY = nextTimer
      }
    }

    const getScrollbarState = (orientation: 'horizontal' | 'vertical') => {
      const isHorizontal = orientation === 'horizontal'
      const hasOverflow = isHorizontal ? overflowX.value : overflowY.value

      if (props.type === 'always') {
        return 'visible'
      }

      if (props.type === 'auto') {
        return hasOverflow ? 'visible' : 'hidden'
      }

      if (props.type === 'hover') {
        return hovered.value && hasOverflow ? 'visible' : 'hidden'
      }

      if (props.type === 'scroll') {
        return (isHorizontal ? scrollingX.value : scrollingY.value) && hasOverflow
          ? 'visible'
          : 'hidden'
      }

      return 'hidden'
    }

    watch([viewport, content], observeOverflow, { flush: 'post' })

    onMounted(async () => {
      await nextTick()
      observeOverflow()
      if (props.startScrollPosition && viewport.value) {
        viewport.value.scrollTo({
          left: props.startScrollPosition.x ?? 0,
          top: props.startScrollPosition.y ?? 0,
        })
      }
    })

    onBeforeUnmount(() => {
      resizeObserver?.disconnect()

      if (scrollTimerX) {
        window.clearTimeout(scrollTimerX)
      }

      if (scrollTimerY) {
        window.clearTimeout(scrollTimerY)
      }

      if (hoverHideTimer) {
        window.clearTimeout(hoverHideTimer)
      }
    })

    const handleScroll = (event: Event) => {
      props.viewportProps?.onScroll?.(event)
      const node = event.currentTarget as HTMLDivElement
      props.onScrollPositionChange?.({ x: node.scrollLeft, y: node.scrollTop })

      const isAtBottom = node.scrollTop - (node.scrollHeight - node.clientHeight) >= -0.8
      const isAtTop = node.scrollTop === 0
      const isAtRight = node.scrollLeft - (node.scrollWidth - node.clientWidth) >= -0.8
      const isAtLeft = node.scrollLeft === 0

      if (node.scrollLeft !== prevScrollLeft.value) {
        setScrolling('x')
      }

      if (node.scrollTop !== prevScrollTop.value) {
        setScrolling('y')
      }

      updateOverflow()

      if (isAtBottom && !prevAtBottom.value) {
        props.onBottomReached?.()
      }

      if (isAtTop && !prevAtTop.value) {
        props.onTopReached?.()
      }

      if (isAtRight && !prevAtRight.value) {
        props.onRightReached?.()
      }

      if (isAtLeft && !prevAtLeft.value) {
        props.onLeftReached?.()
      }

      prevAtBottom.value = isAtBottom
      prevAtTop.value = isAtTop
      prevAtRight.value = isAtRight
      prevAtLeft.value = isAtLeft
      prevScrollTop.value = node.scrollTop
      prevScrollLeft.value = node.scrollLeft
    }

    return () =>
      h(
        ScrollAreaRoot,
        {
          ...attrs,
          ...getStyles('root'),
          getStyles,
          type: props.type === 'never' ? 'always' : props.type,
          scrollHideDelay: props.scrollHideDelay,
          scrollbars: props.scrollbars,
          mod: { autosize: attrs['data-autosize'] === 'true' || attrs['data-autosize'] === true },
          onPointerenter: (event: PointerEvent) => {
            ;(attrs.onPointerenter as ((event: PointerEvent) => void) | undefined)?.(event)
            if (hoverHideTimer) {
              window.clearTimeout(hoverHideTimer)
            }
            hovered.value = true
          },
          onPointerleave: (event: PointerEvent) => {
            ;(attrs.onPointerleave as ((event: PointerEvent) => void) | undefined)?.(event)
            hoverHideTimer = window.setTimeout(() => {
              hovered.value = false
            }, props.scrollHideDelay)
          },
        },
        () => [
          h(
            ScrollAreaViewport,
            {
              ...props.viewportProps,
              ...getStyles('viewport', { style: props.viewportProps?.style }),
              onViewportMounted: (node: HTMLDivElement | null) => {
                viewport.value = node
              },
              onContentMounted: (node: HTMLDivElement | null) => {
                content.value = node
              },
              'data-offset-scrollbars': toOffsetScrollbars(props.offsetScrollbars),
              'data-scrollbars': props.scrollbars || undefined,
              onScroll: handleScroll,
            },
            () => slots.default?.(),
          ),
          (props.scrollbars === 'xy' || props.scrollbars === 'x') &&
            h(
              ScrollAreaScrollbar,
              {
                ...getStyles('scrollbar'),
                orientation: 'horizontal',
                'data-hidden': props.type === 'never' ? true : undefined,
                'data-state': getScrollbarState('horizontal'),
                forceMount: true,
              },
              () => h(ScrollAreaThumb, getStyles('thumb')),
            ),
          (props.scrollbars === 'xy' || props.scrollbars === 'y') &&
            h(
              ScrollAreaScrollbar,
              {
                ...getStyles('scrollbar'),
                orientation: 'vertical',
                'data-hidden': props.type === 'never' ? true : undefined,
                'data-state': getScrollbarState('vertical'),
                forceMount: true,
              },
              () => h(ScrollAreaThumb, getStyles('thumb')),
            ),
          h(ScrollAreaCorner, {
            ...getStyles('corner'),
            'data-hidden': props.type === 'never' ? true : undefined,
          }),
        ],
      )
  },
})

export const ScrollAreaAutosize = defineComponent({
  name: 'ScrollAreaAutosize',
  inheritAttrs: false,
  props: ScrollAreaBase.props,
  setup(props: any, { attrs, slots }) {
    return () =>
      h(
        Box,
        {
          ...attrs,
          style: [{ display: 'flex', overflow: 'hidden' }, attrs.style as any],
        },
        () =>
          h(
            Box,
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                overflow: 'hidden',
                minWidth: props.scrollbars === 'x' ? undefined : 0,
                minHeight: props.scrollbars === 'y' ? undefined : 0,
              },
            },
            () => h(ScrollAreaBase, { ...props, 'data-autosize': 'true' }, () => slots.default?.()),
          ),
      )
  },
})

export const ScrollArea = withBoxProps(
  Object.assign(ScrollAreaBase, {
    Autosize: ScrollAreaAutosize,
    classes,
    varsResolver,
  }),
)
