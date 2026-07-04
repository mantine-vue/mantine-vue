import { computed, defineComponent, h, type PropType } from 'vue'
import { useCollapse, useHorizontalCollapse, useReducedMotion } from '@mantine-vue/hooks'
import { withBoxProps, Box, useMantineEnv, useMantineTheme } from '../../core'

const defaultProps = {
  transitionDuration: 200,
  transitionTimingFunction: 'ease',
  animateOpacity: true,
  orientation: 'vertical',
  keepMounted: true,
} as const

export const Collapse = withBoxProps(
  defineComponent({
    name: 'Collapse',
    inheritAttrs: false,
    props: {
      orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: undefined },
      expanded: { type: Boolean, required: true },
      onTransitionEnd: { type: Function as PropType<() => void>, default: undefined },
      onTransitionStart: { type: Function as PropType<() => void>, default: undefined },
      transitionDuration: { type: Number, default: undefined },
      transitionTimingFunction: { type: String, default: undefined },
      animateOpacity: { type: Boolean, default: undefined },
      keepMounted: { type: Boolean, default: undefined },
    },
    setup(rawProps, { attrs, slots }) {
      const props = rawProps
      const env = useMantineEnv()
      const theme = useMantineTheme()
      const shouldReduceMotion = useReducedMotion(false, { getInitialValueInEffect: false })
      const expanded = computed(() => props.expanded)
      const transitionDuration = computed(
        () => props.transitionDuration ?? defaultProps.transitionDuration,
      )
      const transitionTimingFunction = computed(
        () => props.transitionTimingFunction ?? defaultProps.transitionTimingFunction,
      )
      const animateOpacity = computed(() => props.animateOpacity ?? defaultProps.animateOpacity)
      const orientation = computed(() => props.orientation ?? defaultProps.orientation)
      const keepMounted = computed(() => props.keepMounted ?? defaultProps.keepMounted)
      const duration = computed(() =>
        theme.value.respectReducedMotion && shouldReduceMotion.value ? 0 : transitionDuration.value,
      )

      const verticalCollapse = useCollapse({
        expanded,
        transitionDuration: duration.value,
        transitionTimingFunction: transitionTimingFunction.value,
        onTransitionEnd: props.onTransitionEnd,
        onTransitionStart: props.onTransitionStart,
        keepMounted: false,
      })

      const horizontalCollapse = useHorizontalCollapse({
        expanded,
        transitionDuration: duration.value,
        transitionTimingFunction: transitionTimingFunction.value,
        onTransitionEnd: props.onTransitionEnd,
        onTransitionStart: props.onTransitionStart,
        keepMounted: false,
      })

      return () => {
        if (duration.value === 0) {
          if (!props.expanded && !(keepMounted.value === true && env !== 'test')) {
            return null
          }

          return h(
            Box,
            {
              ...attrs,
              style: {
                ...(attrs.style as any),
                display: props.expanded ? undefined : 'none',
              },
            },
            () => slots.default?.(),
          )
        }

        const collapse = orientation.value === 'horizontal' ? horizontalCollapse : verticalCollapse
        const isExited = collapse.state.value === 'exited'

        if (keepMounted.value === false && isExited) {
          return null
        }

        const collapseProps = collapse.getCollapseProps({
          style: {
            ...(attrs.style as any),
            opacity: props.expanded || !animateOpacity.value ? 1 : 0,
            transition: animateOpacity.value
              ? `opacity ${duration.value}ms ${transitionTimingFunction.value}`
              : 'none',
          },
        })

        return h(
          Box,
          {
            ...attrs,
            ...collapseProps,
          },
          () => slots.default?.(),
        )
      }
    },
  }),
)
