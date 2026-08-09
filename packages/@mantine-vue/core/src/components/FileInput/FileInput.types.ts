import type { VNodeChild } from 'vue'
import type { MantineNode, MantineSize, StylesApiProps } from '../../core'
import type { ClearSectionMode } from '../Input'
import type { InputBaseStylesNames } from '../InputBase'

export type FileInputStylesNames = InputBaseStylesNames

export interface FileInputSlots {
  /** Input label. */
  label?: () => VNodeChild

  /** Description rendered below the label. */
  description?: () => VNodeChild

  /** Error message rendered below the input. */
  error?: () => VNodeChild

  /** Content rendered while no file is selected. */
  placeholder?: () => VNodeChild

  /** Content rendered on the left side of the input. */
  leftSection?: () => VNodeChild

  /** Content rendered on the right side of the input. */
  rightSection?: () => VNodeChild

  /**
   * Renders the selected file or files. Preferred alternative to the `valueComponent`
   * prop, takes precedence over it when provided.
   */
  value?: (payload: { value: File | File[] | null }) => VNodeChild
}

/** Props declared by `FileInput` itself. */
export interface FileInputProps extends StylesApiProps<FileInputProps> {
  /**
   * Element or component rendered as the input.
   *
   * @default 'button'
   */
  component?: string

  /** Selected file, or files in `multiple` mode, bound with `v-model`. */
  modelValue?: File | File[] | null

  /** Uncontrolled initial file or files. */
  defaultValue?: File | File[] | null

  /**
   * If set, more than one file can be picked and the value is an array.
   *
   * @default false
   */
  multiple?: boolean

  /** `accept` attribute of the underlying file input, for example `image/png,image/jpeg`. */
  accept?: string

  /** `name` of the underlying file input, used when the input is part of a form. */
  name?: string

  /** `form` of the underlying file input. */
  form?: string

  /**
   * Renders the selected file or files. Lower-priority fallback kept for back-compat –
   * prefer the `value` slot, which takes precedence over this prop. Renders a comma
   * separated, truncated list of file names when neither is set.
   */
  valueComponent?: (value: File | File[] | null) => any

  /**
   * If set, a clear button is rendered while a file is selected.
   *
   * @default false
   */
  clearable?: boolean

  /**
   * How the clear button and the right section share the right side of the input.
   *
   * @default 'both'
   */
  clearSectionMode?: ClearSectionMode

  /** Props passed down to the clear button. */
  clearButtonProps?: Record<string, any>

  /**
   * If set, the file picker cannot be opened.
   *
   * @default false
   */
  readOnly?: boolean

  /** `capture` attribute of the underlying file input, used to request a camera on mobile. */
  capture?: boolean | 'user' | 'environment'

  /** Props passed down to the underlying file input. */
  fileInputProps?: Record<string, any>

  /**
   * Content rendered while no file is selected.
   * Can also be set with the `placeholder` slot – the slot takes precedence over the prop.
   */
  placeholder?: MantineNode

  /** Ref assigned a function that clears the underlying file input. */
  resetRef?: any

  /** Content rendered on the right side of the input. */
  rightSection?: MantineNode

  /**
   * Controls the size of the input.
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Input label.
   * Can also be set with the `label` slot.
   */
  label?: MantineNode

  /**
   * Description rendered below the label.
   * Can also be set with the `description` slot.
   */
  description?: MantineNode

  /**
   * Error message rendered below the input. `true` applies error styles without a message.
   * Can also be set with the `error` slot.
   */
  error?: MantineNode | boolean

  /**
   * If set, the input is marked required and the asterisk is shown.
   *
   * @default false
   */
  required?: boolean

  /** If set, the asterisk is shown without setting the `required` attribute. */
  withAsterisk?: boolean

  /** Props passed down to the root element. */
  wrapperProps?: Record<string, any>

  /**
   * If set, all Mantine classes are removed.
   *
   * @default false
   */
  unstyled?: boolean
}
