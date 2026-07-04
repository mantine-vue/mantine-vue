import { computed, defineComponent, h, type PropType } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { withBoxProps, Box, getDefaultZIndex, getShadow, getSpacing } from '../../core'
import { OptionalPortal } from '../Portal'
import { provideModalBaseContext } from './ModalBase.context'
import { useLockScroll } from './use-lock-scroll'
import { useModal } from './use-modal'

export interface ModalBaseProps {
  opened: boolean
  onClose: () => void
  id?: string
  keepMounted?: boolean
  lockScroll?: boolean
  trapFocus?: boolean
  withinPortal?: boolean
  portalProps?: Record<string, any>
  closeOnClickOutside?: boolean
  transitionProps?: Record<string, any>
  onExitTransitionEnd?: () => void
  onEnterTransitionEnd?: () => void
  closeOnEscape?: boolean
  returnFocus?: boolean
  zIndex?: string | number
  shadow?: string
  padding?: string | number
  unstyled?: boolean
}
export const ModalBase = withBoxProps(
  defineComponent({
    name: 'ModalBase',
    inheritAttrs: false,
    props: {
      opened: { type: Boolean, required: true },
      onClose: { type: Function as PropType<() => void>, required: true },
      id: String,
      keepMounted: { type: Boolean, default: false },
      lockScroll: { type: Boolean, default: true },
      trapFocus: { type: Boolean, default: true },
      withinPortal: { type: Boolean, default: true },
      portalProps: { type: Object, default: undefined },
      closeOnClickOutside: { type: Boolean, default: true },
      transitionProps: { type: Object, default: undefined },
      onExitTransitionEnd: { type: Function as PropType<() => void>, default: undefined },
      onEnterTransitionEnd: { type: Function as PropType<() => void>, default: undefined },
      closeOnEscape: { type: Boolean, default: true },
      returnFocus: { type: Boolean, default: true },
      zIndex: { type: [String, Number], default: undefined },
      shadow: { type: String, default: 'xl' },
      padding: { type: [String, Number], default: 'md' },
      unstyled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
      const fallbackId = useId(props.id)
      const modal = useModal({
        id: props.id,
        opened: () => props.opened,
        onClose: props.onClose,
        trapFocus: () => props.trapFocus,
        closeOnEscape: () => props.closeOnEscape,
        returnFocus: () => props.returnFocus,
      })
      useLockScroll(computed(() => props.opened && props.lockScroll))
      provideModalBaseContext({
        get unstyled() {
          return props.unstyled
        },
        get titleMounted() {
          return modal.titleMounted.value
        },
        get bodyMounted() {
          return modal.bodyMounted.value
        },
        setTitleMounted: (value) => {
          modal.titleMounted.value = value
        },
        setBodyMounted: (value) => {
          modal.bodyMounted.value = value
        },
        getTitleId: () => `${modal.id.value || fallbackId.value}-title`,
        getBodyId: () => `${modal.id.value || fallbackId.value}-body`,
        get transitionProps() {
          return { ...props.transitionProps, keepMounted: props.keepMounted }
        },
        get onExitTransitionEnd() {
          return props.onExitTransitionEnd
        },
        get onEnterTransitionEnd() {
          return props.onEnterTransitionEnd
        },
        get zIndex() {
          return props.zIndex
        },
        get opened() {
          return props.opened
        },
        onClose: props.onClose,
        get closeOnEscape() {
          return props.closeOnEscape
        },
        get trapFocus() {
          return props.trapFocus
        },
        get closeOnClickOutside() {
          return props.closeOnClickOutside
        },
      })
      return () =>
        h(OptionalPortal, { withinPortal: props.withinPortal, ...props.portalProps }, () =>
          h(
            Box,
            {
              ...attrs,
              id: modal.id.value || fallbackId.value,
              style: [
                {
                  '--mb-z-index': String(props.zIndex ?? getDefaultZIndex('modal')),
                  '--mb-shadow': getShadow(props.shadow),
                  '--mb-padding': getSpacing(props.padding),
                },
                attrs.style,
              ],
            },
            () => slots.default?.(),
          ),
        )
    },
  }),
)
