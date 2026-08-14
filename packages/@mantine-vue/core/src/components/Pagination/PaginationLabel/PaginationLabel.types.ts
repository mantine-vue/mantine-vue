import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '../../../core'
export type PaginationLabelProps = BoxProps
export interface PaginationLabelSlots {
  /** Custom label content. */ default?: (scope: { active: number; total: number }) => VNodeChild
}

export type PaginationLabelStylesNames = 'label'

export type PaginationLabelFactory = Factory<{
  props: PaginationLabelProps
  slots: PaginationLabelSlots
  element: 'span'
}>
