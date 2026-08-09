import type { VNodeChild } from 'vue'
import type { BoxProps } from '../../../core'
export type PaginationLabelProps = BoxProps
export interface PaginationLabelSlots {
  /** Custom label content. */ default?: (scope: { active: number; total: number }) => VNodeChild
}
