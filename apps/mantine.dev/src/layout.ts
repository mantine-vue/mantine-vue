import { defineComponent, h } from 'vue'
import MdxLayout from './components/MdxLayout/MdxLayout.vue'
import type { Frontmatter } from './types'

// Returns the component used as the `export default` of an .mdx page. MDX
// renders the compiled page body as the default slot of this component.
export function Layout(meta: Frontmatter) {
  return defineComponent({
    name: 'MdxPageLayout',
    // The compiled MDX page component spreads its own props (including
    // MDX's `components` prop, used to override element rendering) onto
    // whatever it renders as its layout - this component doesn't declare or
    // use any of those, and since MdxLayout renders a multi-root template
    // (PageHead + div), Vue can't auto-inherit attrs onto it anyway. Disable
    // inheritance so it doesn't warn trying.
    inheritAttrs: false,
    setup(_props, { slots }) {
      return () => h(MdxLayout, { meta }, { default: () => slots.default?.() })
    },
  })
}
