import type { HTMLAttributes } from 'vue'

/** Native div attributes accepted by the scroll area corner. */
export interface ScrollAreaCornerProps extends HTMLAttributes {
  /** Unique identifier assigned to the corner element. */
  id?: string
}
