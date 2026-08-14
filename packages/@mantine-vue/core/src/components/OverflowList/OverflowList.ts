import { factory } from '../../core'
import OverflowListComponent, { varsResolver } from './OverflowList.vue'
import type { OverflowListFactory } from './OverflowList.types'
import classes from './OverflowList.module.css'

export const OverflowList = factory<OverflowListFactory>(OverflowListComponent, {
  classes,
  varsResolver,
})

export type {
  OverflowListCssVariables,
  OverflowListFactory,
  OverflowListOwnProps,
  OverflowListProps,
  OverflowListStylesNames,
} from './OverflowList.types'
