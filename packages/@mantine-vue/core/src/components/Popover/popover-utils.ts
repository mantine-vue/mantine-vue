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

/**
 * The popover attaches itself to its child by cloning it, so there must be exactly one
 * real child.
 */
export function one(slots: any, name: string): VNode {
  const children = flattenChildren(slots.default?.() ?? [])

  if (children.length !== 1) {
    throw new Error(
      `${name} component children should be a single element or component that accepts ref`,
    )
  }

  return children[0]
}

/** A cloned child may already carry an array of handlers for the same event. */
export function call(handler: any, event: Event) {
  if (Array.isArray(handler)) {
    handler.forEach((fn) => fn?.(event))
  } else {
    handler?.(event)
  }
}

/**
 * Component refs resolve to instances, not elements. Floating UI also accepts a virtual
 * element, which is why anything with `getBoundingClientRect` is passed through.
 */
export function asElement(node: any): HTMLElement | null {
  const candidate = node?.$el ?? node

  if (typeof Element !== 'undefined' && candidate instanceof Element) {
    return candidate as HTMLElement
  }

  return typeof candidate?.getBoundingClientRect === 'function' ? candidate : null
}
