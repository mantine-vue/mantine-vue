import type { VNodeChild } from 'vue'

/** Content accepted by Mantine Vue props that correspond to React.ReactNode props. */
export type MantineNode = VNodeChild | (() => VNodeChild)

export interface SectionSlots {
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
}

/**
 * Resolves content for props that accept both a scoped slot and a plain prop.
 * Precedence: slot > prop > undefined. A slot passed by the parent always wins,
 * even if a prop is also set, so consumers can override built-in defaults from
 * their template without fighting prop-driven content.
 */
export function resolveNode(prop: MantineNode | undefined, slot?: () => VNodeChild): VNodeChild {
  if (slot) {
    return slot()
  }

  return typeof prop === 'function' ? prop() : prop
}

export function hasNode(node: VNodeChild): boolean {
  return node !== null && node !== undefined && node !== false
}
