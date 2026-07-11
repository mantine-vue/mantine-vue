import { defineComponent, h } from 'vue'
import { Anchor } from '@mantine-vue/core'
import { RouterLink } from 'vue-router'

interface RouterLinkSlotProps {
  href: string
  navigate: (event?: MouseEvent) => void | Promise<void>
}

export const MdxAnchor = defineComponent({
  name: 'MdxAnchor',
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    return () => {
      const href = String((attrs as Record<string, unknown>).href ?? '')
      const replaced = href.replace('https://mantine-vue.dev', '')

      if (replaced && !replaced.startsWith('http') && replaced.trim().length > 0) {
        return h(
          RouterLink,
          { to: replaced, custom: true },
          {
            default: ({ href: resolvedHref, navigate }: RouterLinkSlotProps) =>
              h(
                Anchor,
                {
                  ...attrs,
                  href: resolvedHref,
                  class: ['mdx-link', attrs.class],
                  onClick: navigate,
                },
                slots.default,
              ),
          },
        )
      }

      return h(Anchor, { ...attrs, href, class: ['mdx-link', attrs.class] }, slots.default)
    }
  },
})
