import type { VNodeChild } from 'vue'

/** Props declared by `OptionalPortal` itself. See `OptionalPortalProps` for the full public type. */
export interface OptionalPortalOwnProps {
  /**
   * Determines whether children should be rendered inside Portal.
   * When false, children are rendered as regular React children.
   *
   * Note: In test environment, Portal is always disabled regardless of this value.
   *
   * @default true
   */
  withinPortal?: boolean

  /**
   * Target element where portal should be rendered. Accepts:
   * - HTMLElement: Renders portal inside this element
   * - string: CSS selector - renders inside first matching element
   * - undefined: Uses shared portal node or creates new one based on `reuseTargetNode`
   *
   * Note: If selector doesn't match any element, portal will not render
   */
  target?: string | HTMLElement

  /**
   * When true and target is not specified, all Portal instances share a single
   * container node appended to document.body. When false, each Portal creates
   * its own container node.
   *
   * Has no effect when target is specified.
   *
   * @default true
   */
  reuseTargetNode?: boolean
}

export type OptionalPortalProps = OptionalPortalOwnProps

export interface OptionalPortalSlots {
  /** Content rendered inline or in the portal. */
  default?: () => VNodeChild
}
