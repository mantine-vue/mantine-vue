import { defineComponent, h, onBeforeUnmount, watch, type PropType } from 'vue'
import { OptionalPortal, Progress, getDefaultZIndex } from '@mantine-vue/core'
import {
  nprogressStore,
  resetNavigationProgressAction,
  useNprogress,
  type NprogressStore,
} from './nprogress.store'
import classes from './NavigationProgress.module.css'

export interface NavigationProgressProps {
  store?: NprogressStore
  initialProgress?: number
  color?: string
  size?: number
  stepInterval?: number
  withinPortal?: boolean
  portalProps?: Record<string, any>
  zIndex?: string | number
}

export const NavigationProgress = defineComponent({
  name: 'NavigationProgress',
  inheritAttrs: false,
  props: {
    store: { type: Object as PropType<NprogressStore>, default: () => nprogressStore },
    initialProgress: { type: Number, default: 0 },
    color: { type: String, default: undefined },
    size: { type: Number, default: 3 },
    stepInterval: { type: Number, default: 500 },
    withinPortal: { type: Boolean, default: true },
    portalProps: { type: Object as PropType<Record<string, any>>, default: undefined },
    zIndex: {
      type: [Number, String] as PropType<string | number>,
      default: () => getDefaultZIndex('max'),
    },
  },
  setup(props, { attrs }) {
    const state = useNprogress(props.store)

    watch(
      () => [props.initialProgress, props.stepInterval, props.store] as const,
      () => {
        props.store.setState((current) => ({
          ...current,
          progress: props.initialProgress,
          stepInterval: props.stepInterval,
        }))
      },
      { immediate: true },
    )

    onBeforeUnmount(() => resetNavigationProgressAction(props.store))

    return () =>
      h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
        h(Progress, {
          ...attrs,
          radius: 0,
          value: state.value.progress,
          size: props.size,
          color: props.color,
          classNames: classes,
          'data-mounted': state.value.mounted || undefined,
          vars: {
            root: {
              '--nprogress-z-index': props.zIndex?.toString(),
            },
          },
        }),
      )
  },
})
