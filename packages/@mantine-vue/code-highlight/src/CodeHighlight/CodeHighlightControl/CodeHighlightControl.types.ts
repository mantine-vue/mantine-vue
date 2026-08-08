import type { VNodeChild } from 'vue'

export interface CodeHighlightControlProps {
  /** Tooltip label. If omitted, the tooltip is not rendered. */
  tooltipLabel?: string
  /** Root element or component. @default 'button' */
  component?: string
  classNames?: any
  styles?: any
  vars?: any
  [key: string]: any
}

/** Events emitted by `CodeHighlightControl`. */
export interface CodeHighlightControlEmits {
  /** Emitted when the control is clicked. */
  click: [event: MouseEvent]
}

export interface CodeHighlightControlSlots {
  default?: () => VNodeChild
}
