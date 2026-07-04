import { defineComponent, h, type VNode } from 'vue'
import { CodeHighlight, type CodeHighlightProps } from '@mantine-vue/code-highlight'

// Recursively extract plain text from a VNode tree.
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

function getLanguage(className: string | undefined): string {
  const matches = (className ?? '').match(/language-(?<lang>.*)/)
  const matchedLanguage =
    matches && matches.groups && matches.groups.lang ? matches.groups.lang : 'tsx'

  if (['js', 'jsx', 'ts', 'tsx'].includes(matchedLanguage)) {
    return 'tsx'
  }

  if (['css', 'scss'].includes(matchedLanguage)) {
    return 'scss'
  }

  if (['html', 'bash', 'json', 'vue'].includes(matchedLanguage)) {
    return matchedLanguage
  }

  throw new Error(`Unknown language: ${matchedLanguage}`)
}

export const MdxCodeHighlight = defineComponent({
  name: 'MdxCodeHighlight',
  inheritAttrs: false,
  props: {
    code: { type: String, required: true },
    language: { type: String, default: undefined },
  },
  setup(props, { attrs }) {
    return () => {
      const { class: className, ...others } = attrs

      return h(CodeHighlight, {
        ...others,
        ...(props as CodeHighlightProps),
        class: ['mdx-code-highlight', className],
      })
    }
  },
})

// Replaces the native <pre> element in MDX pages with CodeHighlight.
export const MdxPre = defineComponent({
  name: 'MdxPre',
  setup(_props, { slots }) {
    return () => {
      const children = slots.default?.() ?? []

      // The first (and only) child is the <code> element emitted by MDX.
      const codeVNode = children[0] as VNode | undefined

      const codeClassName = (codeVNode?.props?.className ?? codeVNode?.props?.class) as
        | string
        | undefined
      const lang = getLanguage(codeClassName)
      const code = extractText(codeVNode).replace(/\n$/, '')

      return h(MdxCodeHighlight, { code, language: lang })
    }
  },
})
