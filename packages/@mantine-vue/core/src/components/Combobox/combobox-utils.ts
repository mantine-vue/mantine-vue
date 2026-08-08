import { Comment, Fragment, Text, type VNode, type VNodeChild } from 'vue'

/**
 * Unwraps the fragments and drops the comments and whitespace that `v-if`, `v-for` and
 * — importantly — a forwarded `<slot />` introduce.
 *
 * A wrapper component that renders `<slot />` inside the target hands down a fragment
 * rather than the element itself, so the child cannot simply be read off the slot.
 */
function flattenChildren(nodes: VNodeChild[]): VNode[] {
  const result: VNode[] = []

  for (const node of nodes) {
    if (node == null || typeof node === 'boolean') {
      continue
    }

    if (Array.isArray(node)) {
      result.push(...flattenChildren(node))
      continue
    }

    const vnode = node as VNode

    if (vnode.type === Fragment) {
      result.push(
        ...flattenChildren(Array.isArray(vnode.children) ? (vnode.children as VNodeChild[]) : []),
      )
      continue
    }

    if (vnode.type === Comment) {
      continue
    }

    if (vnode.type === Text && typeof vnode.children === 'string' && !vnode.children.trim()) {
      continue
    }

    result.push(vnode)
  }

  return result
}
import { createVarsResolver, getFontSize, getSize, getThemeColor, rem } from '../../core'

/**
 * The targets attach themselves to their child by cloning it, so there must be exactly
 * one real child.
 */
export function childrenOne(slots: any, name: string): VNode {
  const children = flattenChildren(slots.default?.() ?? [])

  if (children.length !== 1) {
    throw new Error(
      `${name} component children should be a single element or component that accepts ref`,
    )
  }

  return children[0]
}

/**
 * The option variables are emitted on both selectors: `options` for a dropdown rendered
 * inline, `dropdown` for the portalled one, which is not a descendant of `options`.
 */
export const varsResolver = createVarsResolver<any>((_, props) => ({
  options: {
    '--combobox-option-fz': getFontSize(props.size),
    '--combobox-option-padding': getSize(props.size, 'combobox-option-padding'),
  },
  dropdown: {
    '--combobox-padding':
      props.dropdownPadding === undefined ? undefined : rem(props.dropdownPadding),
    '--combobox-option-fz': getFontSize(props.size),
    '--combobox-option-padding': getSize(props.size, 'combobox-option-padding'),
  },
}))

export const chevronVarsResolver = createVarsResolver<any>((theme, props) => ({
  chevron: {
    '--combobox-chevron-size': getSize(props.size, 'combobox-chevron-size'),
    '--combobox-chevron-color': props.color ? getThemeColor(props.color, theme) : undefined,
  },
}))
