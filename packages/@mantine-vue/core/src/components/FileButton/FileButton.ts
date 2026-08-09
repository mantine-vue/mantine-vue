import FileButtonComponent from './FileButton.vue'

/**
 * Renders a hidden file input and hands the default slot an `onClick` that opens the
 * native file picker.
 */
export const FileButton = FileButtonComponent

export type { FileButtonProps, FileButtonSlotProps, FileButtonSlots } from './FileButton.types'
