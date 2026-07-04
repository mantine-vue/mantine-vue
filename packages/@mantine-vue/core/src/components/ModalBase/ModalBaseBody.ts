import { defineComponent, h } from 'vue'
import { withBoxProps, Box } from '../../core'
import { useModalBaseContext } from './ModalBase.context'
import { useModalBodyId } from './use-modal-body-id'
import classes from './ModalBase.module.css'
export const ModalBaseBody = withBoxProps(
  defineComponent({
    name: 'ModalBaseBody',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = useModalBaseContext()
      const id = useModalBodyId()
      return () =>
        h(Box, { ...attrs, id: id(), class: [!ctx.unstyled && classes.body, attrs.class] }, () =>
          slots.default?.(),
        )
    },
  }),
)
export interface ModalBaseBodyProps {
  [key: string]: any
}
