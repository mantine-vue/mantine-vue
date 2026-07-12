import type { VNodeChild } from 'vue'

/** Content accepted by Mantine Vue props that correspond to React.ReactNode props. */
export type MantineNode = VNodeChild | (() => VNodeChild)

export interface SectionSlots {
  leftSection?: () => VNodeChild
  rightSection?: () => VNodeChild
}

/** Prop content takes precedence over slot content. Explicit null is preserved. */
export function resolveNode(prop: MantineNode | undefined, slot?: () => VNodeChild): VNodeChild {
  if (prop !== undefined) {
    return typeof prop === 'function' ? prop() : prop
  }

  return slot?.()
}

export function hasNode(node: VNodeChild): boolean {
  return node !== null && node !== undefined && node !== false
}
