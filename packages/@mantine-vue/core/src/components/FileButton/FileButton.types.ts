import type { VNodeChild } from 'vue'

/** Payload passed to the default slot so the trigger can open the file dialog. */
export interface FileButtonSlotProps {
  /** Opens the native file picker. Ignored while `disabled` is set. */
  onClick: () => void

  /** Remaining fallthrough attributes, so the trigger can spread them. */
  [key: string]: any
}

export interface FileButtonSlots {
  /** Trigger element. Receives `onClick`, which opens the file dialog. */
  default?: (props: FileButtonSlotProps) => VNodeChild
}

/** Props declared by `FileButton` itself. */
export interface FileButtonProps {
  /** Selected file(s), bound with `v-model`. */
  modelValue?: File | File[] | null

  /**
   * If set, multiple files can be picked and the value is an array.
   *
   * @default false
   */
  multiple?: boolean

  /** File types the picker accepts, for example `'image/png,image/jpeg'`. */
  accept?: string

  /** `name` of the hidden file input. */
  name?: string

  /** `form` the hidden file input belongs to. */
  form?: string

  /** Ref assigned a function that clears the selected files. */
  resetRef?: any

  /**
   * If set, the file dialog cannot be opened.
   *
   * @default false
   */
  disabled?: boolean

  /** Value of the `capture` attribute, used to pick a camera on mobile. */
  capture?: boolean | 'user' | 'environment'

  /** Props passed down to the hidden file input. */
  inputProps?: Record<string, any>

  /** Ref assigned to the hidden file input. */
  inputRef?: any
}
