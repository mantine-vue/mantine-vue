import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

// Override for markdown links: internal links use the SPA router, external
// links open in a new tab.
export const MdxAnchor = defineComponent({
  name: 'MdxAnchor',
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    return () => {
      const href = String((attrs as Record<string, unknown>).href ?? '')
      const isInternal = href.startsWith('/')
      if (isInternal) {
        return h(RouterLink, { to: href, class: 'mdx-link' }, { default: () => slots.default?.() })
      }
      return h(
        'a',
        { ...attrs, class: 'mdx-link', target: '_blank', rel: 'noreferrer' },
        slots.default?.(),
      )
    }
  },
})
