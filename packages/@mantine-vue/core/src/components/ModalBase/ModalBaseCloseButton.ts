import { defineComponent, h } from 'vue'
import { CloseButton } from '../CloseButton'
import { useModalBaseContext } from './ModalBase.context'
import classes from './ModalBase.module.css'
export const ModalBaseCloseButton = defineComponent({
  name: 'ModalBaseCloseButton',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const ctx = useModalBaseContext()
    return () =>
      h(
        CloseButton,
        {
          ...attrs,
          class: [!ctx.unstyled && classes.close, attrs.class],
          unstyled: ctx.unstyled,
          onClick: (event: MouseEvent) => {
            ctx.onClose()
            ;(attrs.onClick as any)?.(event)
          },
        },
        slots,
      )
  },
})
export interface ModalBaseCloseButtonProps {
  [key: string]: any
}
