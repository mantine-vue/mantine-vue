import { defineComponent, h, type PropType } from 'vue'
import { Box } from '../../core'
import { useAppShellContext } from './AppShell.context'
import classes from './AppShell.module.css'

export function createAppShellComponent(
  name: string,
  selector: 'header' | 'footer' | 'navbar' | 'aside',
  component: string,
) {
  const result = defineComponent({
    name,
    inheritAttrs: false,
    props: {
      withBorder: { type: Boolean, default: undefined },
      zIndex: { type: [String, Number] as PropType<string | number>, default: undefined },
      mod: { type: [Object, Array] as PropType<any>, default: undefined },
      classNames: { type: [Object, Function], default: undefined },
      styles: { type: [Object, Function], default: undefined },
    },
    setup(props, { attrs, slots }) {
      const ctx = useAppShellContext()
      return () => {
        if (ctx.disabled) return null
        const styles = ctx.getStyles(selector, { className: attrs.class, style: attrs.style })
        return h(
          Box,
          {
            ...attrs,
            ...styles,
            component,
            mod: [{ withBorder: props.withBorder ?? ctx.withBorder }, props.mod],
            style: [
              styles.style,
              {
                [`--app-shell-${selector}-z-index`]:
                  selector === 'navbar' || selector === 'aside'
                    ? `calc(${props.zIndex ?? ctx.zIndex} + 1)`
                    : String(props.zIndex ?? ctx.zIndex),
              },
              attrs.style,
            ],
          },
          () => slots.default?.(),
        )
      }
    },
  })
  return Object.assign(result, { classes })
}
