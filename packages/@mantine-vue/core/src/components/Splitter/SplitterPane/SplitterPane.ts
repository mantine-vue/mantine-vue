import { factory } from '../../../core'
import SplitterPaneComponent from './SplitterPane.vue'
import type { SplitterPaneFactory } from './SplitterPane.types'
import classes from '../Splitter.module.css'

export const SplitterPane = factory<SplitterPaneFactory>(SplitterPaneComponent, {
  classes,
})

export type {
  SplitterPaneFactory,
  SplitterPaneOwnProps,
  SplitterPaneProps,
  SplitterPaneSlots,
  SplitterPaneStylesNames,
} from './SplitterPane.types'
