import { withBoxProps } from '../../core'
import CollapseComponent from './Collapse.vue'

export const Collapse = withBoxProps(CollapseComponent)

export type { CollapseOwnProps, CollapseProps, CollapseSlots } from './Collapse.types'
