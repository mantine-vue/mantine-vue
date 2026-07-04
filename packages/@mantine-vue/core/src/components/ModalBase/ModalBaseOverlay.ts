import { defineComponent, h } from 'vue'
import { Overlay } from '../Overlay'
import { Transition } from '../Transition'
import { useModalBaseContext } from './ModalBase.context'
import { useModalTransition } from './use-modal-transition'
export const ModalBaseOverlay = defineComponent({
  name: 'ModalBaseOverlay',
  inheritAttrs: false,
  props: {
    visible: { type: Boolean, default: undefined },
    transitionProps: { type: Object, default: undefined },
  },
  setup(props, { attrs }) {
    const ctx = useModalBaseContext()
    const transition = useModalTransition(props.transitionProps)
    return () =>
      h(
        Transition,
        { mounted: props.visible ?? ctx.opened, ...transition, transition: 'fade' },
        {
          default: (styles: any) =>
            h(Overlay, {
              ...attrs,
              fixed: true,
              style: [attrs.style, styles],
              zIndex: ctx.zIndex,
              unstyled: ctx.unstyled,
              onClick: (event: MouseEvent) => {
                ;(attrs.onClick as any)?.(event)
                if (ctx.closeOnClickOutside) ctx.onClose()
              },
            }),
        },
      )
  },
})
export interface ModalBaseOverlayProps {
  visible?: boolean
  transitionProps?: Record<string, any>
  [key: string]: any
}
