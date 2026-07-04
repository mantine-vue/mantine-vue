import { computed, defineComponent, h, ref, watch, type PropType } from 'vue'
import { Modal, getDefaultZIndex, rem, useProps, useStyles } from '@mantine-vue/core'
import { useHotkeys } from '@mantine-vue/hooks'
import { getHotkeys } from './get-hotkeys'
import { provideSpotlightContext } from './Spotlight.context'
import { mergeClassNames, mergeStyles } from './style-api'
import {
  spotlightActions,
  spotlightStore,
  useSpotlight,
  type SpotlightStore,
} from './spotlight.store'
import classes from './Spotlight.module.css'

export type SpotlightRootStylesNames =
  | 'root'
  | 'body'
  | 'close'
  | 'content'
  | 'header'
  | 'inner'
  | 'overlay'
  | 'title'
  | 'search'
  | 'actionsList'
  | 'actionsListInner'
  | 'action'
  | 'empty'
  | 'footer'
  | 'actionBody'
  | 'actionLabel'
  | 'actionDescription'
  | 'actionSection'
  | 'actionsGroup'

export interface SpotlightRootProps {
  store?: SpotlightStore
  query?: string
  onQueryChange?: (query: string) => void
  clearQueryOnClose?: boolean
  shortcut?: string | string[] | null
  tagsToIgnore?: string[]
  triggerOnContentEditable?: boolean
  disabled?: boolean
  onSpotlightOpen?: () => void
  onSpotlightClose?: () => void
  forceOpened?: boolean
  closeOnActionTrigger?: boolean
  maxHeight?: string | number
  scrollable?: boolean
  classNames?: Record<string, any>
  styles?: Record<string, any>
  vars?: Record<string, any>
  unstyled?: boolean
  [key: string]: any
}

const defaultProps = {
  size: 600,
  yOffset: 80,
  zIndex: getDefaultZIndex('max'),
  overlayProps: { backgroundOpacity: 0.35, blur: 7 },
  transitionProps: { duration: 200, transition: 'pop' },
  store: spotlightStore,
  clearQueryOnClose: true,
  closeOnActionTrigger: true,
  shortcut: 'mod + K',
  maxHeight: 400,
} satisfies Partial<SpotlightRootProps>

export const SpotlightRoot = defineComponent({
  name: 'SpotlightRoot',
  inheritAttrs: false,
  props: {
    store: { type: Object as PropType<SpotlightStore>, default: undefined },
    query: { type: String, default: undefined },
    onQueryChange: { type: Function as PropType<(query: string) => void>, default: undefined },
    clearQueryOnClose: { type: Boolean, default: undefined },
    shortcut: {
      type: [String, Array, null] as PropType<string | string[] | null>,
      default: undefined,
    },
    tagsToIgnore: { type: Array as PropType<string[]>, default: undefined },
    triggerOnContentEditable: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: false },
    onSpotlightOpen: { type: Function as PropType<() => void>, default: undefined },
    onSpotlightClose: { type: Function as PropType<() => void>, default: undefined },
    forceOpened: { type: Boolean, default: false },
    closeOnActionTrigger: { type: Boolean, default: undefined },
    maxHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
    scrollable: { type: Boolean, default: false },
    classNames: { type: [Object, Function], default: undefined },
    styles: { type: [Object, Function], default: undefined },
    vars: { type: [Object, Function], default: undefined },
    unstyled: { type: Boolean, default: false },
  },
  setup(rawProps, { attrs, slots }) {
    const props = useProps<SpotlightRootProps>('SpotlightRoot', defaultProps, rawProps as any)
    const state = useSpotlight(props.store!)
    const previousOpened = ref(state.value.opened)
    const currentQuery = computed(() =>
      typeof props.query === 'string' ? props.query : state.value.query,
    )

    const setQuery = (query: string) => {
      props.onQueryChange?.(query)
      spotlightActions.setQuery(query, props.store!)
    }

    const getStyles = useStyles({
      name: 'Spotlight',
      classes,
      props,
      className: attrs.class,
      style: attrs.style as any,
      classNames: props.classNames as any,
      styles: props.styles as any,
      unstyled: props.unstyled,
      vars: props.vars as any,
    })

    provideSpotlightContext({
      get query() {
        return currentQuery.value
      },
      setQuery,
      getStyles,
      store: props.store!,
      get closeOnActionTrigger() {
        return props.closeOnActionTrigger
      },
    })

    useHotkeys(
      () => getHotkeys(props.shortcut, props.store!),
      () => props.tagsToIgnore,
      () => props.triggerOnContentEditable,
    )

    watch(
      () => state.value.opened,
      (opened) => {
        if (opened === previousOpened.value) {
          return
        }

        if (opened) {
          props.onSpotlightOpen?.()
        } else {
          props.onSpotlightClose?.()
        }
        previousOpened.value = opened
      },
    )

    return () => {
      if (props.disabled) {
        return null
      }

      const rootStyles = getStyles('root', { className: attrs.class, style: attrs.style as any })
      const {
        _classNames,
        _styles,
        _vars,
        _store,
        _query,
        _onQueryChange,
        _clearQueryOnClose,
        _shortcut,
        _tagsToIgnore,
        _triggerOnContentEditable,
        _disabled,
        _onSpotlightOpen,
        _onSpotlightClose,
        _forceOpened,
        _closeOnActionTrigger,
        _maxHeight,
        _scrollable,
        ...modalAttrs
      } = { ...attrs, ...props }

      return h(
        Modal,
        {
          ...modalAttrs,
          withCloseButton: false,
          opened: state.value.opened || !!props.forceOpened,
          padding: 0,
          onClose: () => spotlightActions.close(props.store!),
          class: rootStyles.class,
          style: rootStyles.style,
          classNames: mergeClassNames(
            {
              body: classes.body,
              content: classes.content,
            },
            props.classNames,
          ),
          styles: mergeStyles(props.styles),
          vars: mergeStyles(
            {
              root: {
                '--spotlight-max-height': props.scrollable ? rem(props.maxHeight) : undefined,
              },
            },
            props.vars,
          ),
          onExitTransitionEnd: () => {
            if (props.clearQueryOnClose) {
              setQuery('')
            }

            spotlightActions.clearSpotlightState(
              { clearQuery: props.clearQueryOnClose },
              props.store!,
            )
            props.transitionProps?.onExited?.()
            props.onExitTransitionEnd?.()
          },
          'data-scrollable': props.scrollable || undefined,
        },
        slots,
      )
    }
  },
})

Object.assign(SpotlightRoot, { classes })
