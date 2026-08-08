import type { HTMLAttributes, VNodeChild } from 'vue'

/** Props declared by `Portal` itself. See `PortalProps` for the full public type. */
export interface PortalOwnProps {
  /**
   * Target element where portal should be rendered. Accepts:
   * - HTMLElement: Renders portal inside this element
   * - string: CSS selector - renders inside first matching element
   * - undefined: Uses shared portal node or creates new one based on `reuseTargetNode`
   *
   * Note: If selector doesn't match any element, portal will not render
   */
  target?: HTMLElement | string

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

export interface PortalProps extends Omit<HTMLAttributes, keyof PortalOwnProps>, PortalOwnProps {}

export interface PortalSlots {
  /** Content rendered into the target element. */
  default?: () => VNodeChild
}
