import { defineComponent, h } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useAppShellContext } from '../AppShell.context'
import classes from '../AppShell.module.css'
export const AppShellMain = withBoxProps(
  Object.assign(
    defineComponent({
      name: 'AppShellMain',
      inheritAttrs: false,
      setup(_, { attrs, slots }) {
        const ctx = useAppShellContext()
        return () =>
          h(
            Box,
            {
              ...attrs,
              component: 'main',
              ...ctx.getStyles('main', { className: attrs.class, style: attrs.style }),
            },
            () => slots.default?.(),
          )
      },
    }),
    { classes },
  ),
)
