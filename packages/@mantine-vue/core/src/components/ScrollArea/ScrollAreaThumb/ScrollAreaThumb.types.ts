import type { HTMLAttributes } from 'vue'

/** Props declared by the scroll area thumb itself. */
export interface ScrollAreaThumbOwnProps {
  /** If set, the thumb remains mounted even when its calculated size is zero. */
  forceMount?: true
}

/** Props accepted by the scroll area thumb. Native div attributes are forwarded to the root. */
export interface ScrollAreaThumbProps extends HTMLAttributes, ScrollAreaThumbOwnProps {}
