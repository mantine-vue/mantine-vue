import { factory } from '../../core'
import CollapseComponent from './Collapse.vue'
import type { CollapseFactory } from './Collapse.types'

export const Collapse = factory<CollapseFactory>(CollapseComponent)

export type {
  CollapseOwnProps,
  CollapseProps,
  CollapseSlots,
  CollapseFactory,
} from './Collapse.types'
