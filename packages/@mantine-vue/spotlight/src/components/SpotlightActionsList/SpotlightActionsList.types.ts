export type SpotlightActionsListStylesNames = 'actionsList' | 'actionsListInner'
/** Props accepted by `SpotlightActionsList`. */
export interface SpotlightActionsListProps {
  /** Actions-list id used by keyboard navigation. */
  id?: string
  /** CSS classes applied to component elements. */
  classNames?: Record<string, any>
  /** Inline styles applied to component elements. */
  styles?: Record<string, any>
  /** CSS variables applied to component elements. */
  vars?: Record<string, any>
  [key: string]: any
}
