import type { Ref } from 'vue'
import { createSafeContext } from '../../core'

export interface ScrollAreaContextValue {
  type: 'auto' | 'always' | 'scroll' | 'hover' | 'never'
  scrollHideDelay: number
  scrollbars?: 'x' | 'y' | 'xy' | false
  viewport: Ref<HTMLDivElement | null>
  onViewportChange: (node: HTMLDivElement | null) => void
  content: Ref<HTMLDivElement | null>
  onContentChange: (node: HTMLDivElement | null) => void
  scrollbarX: Ref<HTMLDivElement | null>
  onScrollbarXChange: (node: HTMLDivElement | null) => void
  scrollbarY: Ref<HTMLDivElement | null>
  onScrollbarYChange: (node: HTMLDivElement | null) => void
  onCornerWidthChange: (width: number) => void
  onCornerHeightChange: (height: number) => void
  getStyles: (selector: string, options?: { className?: any; style?: any }) => any
}

export const [provideScrollAreaContext, useScrollAreaContext] =
  createSafeContext<ScrollAreaContextValue>('ScrollArea.Root component was not found in tree')
