import type { VNodeChild } from 'vue'

/** Props declared by `CopyButton` itself. See `CopyButtonProps` for the full public type. */
export interface CopyButtonOwnProps {
  /** Value that is copied to the clipboard when the button is clicked */
  value: string

  /**
   * Copied status timeout in ms
   *
   * @default 1000
   */
  timeout?: number
}

export type CopyButtonProps = CopyButtonOwnProps

export interface CopyButtonSlotProps {
  /** Copies the configured value to the clipboard. */
  copy: () => void

  /** Whether the value was copied within the configured timeout. */
  copied: boolean

  /** Fallthrough attributes passed to `CopyButton`. */
  [key: string]: any
}

export interface CopyButtonSlots {
  /** Renderless component content. */
  default?: (props: CopyButtonSlotProps) => VNodeChild
}
