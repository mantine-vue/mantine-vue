import { defineComponent, h } from 'vue'
import { withBoxProps, Box } from '../../core'
import { useModalBaseContext } from './ModalBase.context'
import classes from './ModalBase.module.css'
export const ModalBaseHeader = withBoxProps(
  defineComponent({
    name: 'ModalBaseHeader',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = useModalBaseContext()
      return () =>
        h(
          Box,
          { ...attrs, component: 'header', class: [!ctx.unstyled && classes.header, attrs.class] },
          () => slots.default?.(),
        )
    },
  }),
)
export interface ModalBaseHeaderProps {
  [key: string]: any
}
