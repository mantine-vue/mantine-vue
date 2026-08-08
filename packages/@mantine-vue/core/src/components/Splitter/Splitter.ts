import { withBoxProps } from '../../core'
import SplitterComponent, { varsResolver } from './Splitter.vue'
import { SplitterPane } from './SplitterPane/SplitterPane'
import classes from './Splitter.module.css'

export const Splitter = withBoxProps(
  Object.assign(SplitterComponent, {
    classes,
    varsResolver,
    Pane: SplitterPane,
  }),
)

export type {
  SplitterCssVariables,
  SplitterEmits,
  SplitterOwnProps,
  SplitterProps,
  SplitterSlots,
  SplitterStylesNames,
} from './Splitter.types'
