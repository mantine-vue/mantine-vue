import { defineComponent, h } from 'vue'
import { withBoxProps, Box } from '../../core'
import { useModalBaseContext } from './ModalBase.context'
import { useModalTitle } from './use-modal-title-id'
import classes from './ModalBase.module.css'
export const ModalBaseTitle = withBoxProps(
  defineComponent({
    name: 'ModalBaseTitle',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = useModalBaseContext()
      const id = useModalTitle()
      return () =>
        h(
          Box,
          {
            ...attrs,
            component: 'h2',
            id: id(),
            class: [!ctx.unstyled && classes.title, attrs.class],
          },
          () => slots.default?.(),
        )
    },
  }),
)
export interface ModalBaseTitleProps {
  [key: string]: any
}
