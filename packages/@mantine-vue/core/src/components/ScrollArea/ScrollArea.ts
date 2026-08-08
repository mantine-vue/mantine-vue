import { withBoxProps } from '../../core'
import ScrollAreaComponent, { varsResolver } from './ScrollArea.vue'
import ScrollAreaAutosizeComponent from './ScrollAreaAutosize.vue'
import classes from './ScrollArea.module.css'

/** `ScrollArea` that grows with its content instead of taking a fixed height. */
export const ScrollAreaAutosize = withBoxProps(ScrollAreaAutosizeComponent)

export const ScrollArea = withBoxProps(
  Object.assign(ScrollAreaComponent, {
    Autosize: ScrollAreaAutosize,
    classes,
    varsResolver,
  }),
)

export type {
  ScrollAreaCssVariables,
  ScrollAreaOwnProps,
  ScrollAreaProps,
  ScrollAreaScrollbars,
  ScrollAreaSlots,
  ScrollAreaStylesNames,
  ScrollAreaType,
} from './ScrollArea.props.types'
