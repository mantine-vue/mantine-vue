import { defineComponent, h } from 'vue'
import { useDrawerContext } from './Drawer.context'

/**
 * Builds one of the compound parts of `Drawer` – `Drawer.Body`, `Drawer.Header` and so
 * on.
 *
 * Deliberately a factory rather than six near-identical SFCs: every part does exactly
 * the same thing, differing only in the `ModalBase` component it wraps and the Styles
 * API selector it reads. The same reasoning applies to `create-app-shell-component` and
 * `create-modal-compound-component`.
 */
export function createDrawerCompoundComponent(
  name: string,
  Base: any,
  selector: string,
  extra?: (ctx: any) => Record<string, any>,
) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      visible: { type: Boolean, default: undefined },
      transitionProps: Object,
      __hidden: Boolean,
    },
    setup(props, { attrs, slots }) {
      const ctx = useDrawerContext()

      return () =>
        h(
          Base,
          {
            ...attrs,
            ...props,
            ...ctx.getStyles(selector, { className: attrs.class, style: attrs.style }),
            ...extra?.(ctx),
          },
          slots,
        )
    },
  })
}
