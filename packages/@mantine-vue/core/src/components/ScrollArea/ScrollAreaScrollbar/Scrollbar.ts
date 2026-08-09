import ScrollbarComponent from './Scrollbar.vue'

/**
 * Shared scrollbar shell: owns the resize observer, the pointer-drag handling and the
 * scrollbar context the thumb reads. Axis-specific behaviour lives in `ScrollbarX`
 * and `ScrollbarY`.
 */
export const Scrollbar = ScrollbarComponent

export type { ScrollbarPrivateProps, ScrollbarSlots } from './Scrollbar.types'
