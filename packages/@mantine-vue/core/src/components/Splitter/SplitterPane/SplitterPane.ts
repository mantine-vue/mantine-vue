import { withBoxProps } from '../../../core'
import SplitterPaneComponent from './SplitterPane.vue'
import classes from '../Splitter.module.css'

/** A single resizable pane of a `Splitter`. */
export const SplitterPane = withBoxProps(Object.assign(SplitterPaneComponent, { classes }))

export type {
  SplitterPaneOwnProps,
  SplitterPaneProps,
  SplitterPaneSlots,
  SplitterPaneStylesNames,
} from './SplitterPane.types'
