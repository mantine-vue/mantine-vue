import { defineComponent, h } from 'vue'
import { Anchor } from '@mantine-vue/core'
import { RouterLink } from 'vue-router'

interface RouterLinkSlotProps {
  href: string
  navigate: (event?: MouseEvent) => void | Promise<void>
}

const SITE_ORIGIN = 'https://mantine-vue.dev'
const URI_SCHEME = /^[a-z][a-z\d+.-]*:/i
const STATIC_FILE = /\.[a-z\d]+$/i

export function getMdxAnchorTarget(href: string) {
  const isSiteUrl = href === SITE_ORIGIN || href.startsWith(`${SITE_ORIGIN}/`)
  const normalizedHref = isSiteUrl ? href.slice(SITE_ORIGIN.length) || '/' : href
  const isExternal = !isSiteUrl && (URI_SCHEME.test(href) || href.startsWith('//'))
  const pathname = normalizedHref.split(/[?#]/, 1)[0]

  return {
    href: normalizedHref,
    useRouter:
      !isExternal &&
      normalizedHref.trim().length > 0 &&
      !STATIC_FILE.test(pathname.split('/').at(-1) || ''),
  }
}

export const MdxAnchor = defineComponent({
  name: 'MdxAnchor',
  inheritAttrs: false,
  setup(_props, { slots, attrs }) {
    return () => {
      const href = String((attrs as Record<string, unknown>).href ?? '')
      const target = getMdxAnchorTarget(href)

      if (target.useRouter) {
        return h(
          RouterLink,
          { to: target.href, custom: true },
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

      return h(
        Anchor,
        { ...attrs, href: target.href, class: ['mdx-link', attrs.class] },
        slots.default,
      )
    }
  },
})
