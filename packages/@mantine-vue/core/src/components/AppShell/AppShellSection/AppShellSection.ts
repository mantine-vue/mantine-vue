import { defineComponent, h, type PropType } from 'vue'
import { withBoxProps, Box } from '../../../core'
import { useAppShellContext } from '../AppShell.context'
import classes from '../AppShell.module.css'
export const AppShellSection = withBoxProps(
  Object.assign(
    defineComponent({
      name: 'AppShellSection',
      inheritAttrs: false,
      props: {
        grow: { type: Boolean, default: false },
        component: { type: [String, Object, Function] as PropType<any>, default: 'div' },
        mod: { type: [Object, Array] as PropType<any>, default: undefined },
      },
      setup(props, { attrs, slots }) {
        const ctx = useAppShellContext()
        return () =>
          h(
            Box,
            {
              ...attrs,
              component: props.component,
              mod: [{ grow: props.grow }, props.mod],
              ...ctx.getStyles('section', { className: attrs.class, style: attrs.style }),
            },
            () => slots.default?.(),
          )
      },
    }),
    { classes },
  ),
)
