import { factory } from '../../core'
import SplitterComponent, { varsResolver } from './Splitter.vue'
import type { SplitterFactory } from './Splitter.types'
import { SplitterPane } from './SplitterPane/SplitterPane'
import classes from './Splitter.module.css'

export const Splitter = factory<SplitterFactory>(SplitterComponent, {
  classes,
  varsResolver,
  Pane: SplitterPane,
})

export type {
  SplitterCssVariables,
  SplitterEmits,
  SplitterOwnProps,
  SplitterProps,
  SplitterSlots,
  SplitterStylesNames,
  SplitterFactory,
} from './Splitter.types'
