import { defineComponent, h, type PropType, type VNode } from 'vue'
import { Title } from '@mantine-vue/core'
import classes from './MdxTitle.module.css'

// Recursively extract plain text from a VNode tree (same helper as MdxPre.ts).
function extractText(node: unknown): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  const vnode = node as VNode
  if (typeof vnode.children === 'string') return vnode.children
  if (Array.isArray(vnode.children)) {
    return (vnode.children as unknown[]).map(extractText).join('')
  }
  return ''
}

// Every h2-h6 in MDX content renders as an invisible `[data-heading]` marker
// div (offset upwards by --docs-header-height so scroll-spy activates right
// as the heading passes under the sticky header) immediately followed by the
// visible, anchor-linked Title - this is what TableOfContents.vue's
// `useScrollSpy({ selector: '#mdx [data-heading]' })` reads from. h1 renders
// as a plain, non-linked Title (there's no ToC entry for the page's own
// h1/title: `filteredHeadings = data.filter(h => h.depth > 1)`).
export function createMdxTitle(order: 1 | 2 | 3 | 4 | 5 | 6) {
  return defineComponent({
    name: `MdxTitle${order}`,
    inheritAttrs: false,
    props: {
      id: { type: String as PropType<string | undefined>, default: undefined },
    },
    setup(props, { attrs, slots }) {
      return () => {
        const children = slots.default?.() ?? []

        if (order === 1) {
          return h(Title, { class: classes.title, 'data-h1': true }, () => children)
        }

        const text = children.map(extractText).join('')

        return [
          h('div', {
            id: props.id,
            'data-heading': text,
            'data-order': order,
            class: classes.offset,
          }),
          h(Title, { ...attrs, order, class: classes.title }, () =>
            h('a', { class: classes.link, href: `#${props.id}` }, () => children),
          ),
        ]
      }
    },
  })
}
