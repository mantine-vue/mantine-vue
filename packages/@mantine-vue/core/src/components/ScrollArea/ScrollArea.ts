import { factory } from '../../core'
import ScrollAreaComponent, { varsResolver } from './ScrollArea.vue'
import type { ScrollAreaAutosizeFactory, ScrollAreaFactory } from './ScrollArea.props.types'
import ScrollAreaAutosizeComponent from './ScrollAreaAutosize.vue'
import classes from './ScrollArea.module.css'

/** `ScrollArea` that grows with its content instead of taking a fixed height. */
export const ScrollAreaAutosize = factory<ScrollAreaAutosizeFactory>(ScrollAreaAutosizeComponent, {
  classes,
  varsResolver,
})

export const ScrollArea = factory<ScrollAreaFactory>(ScrollAreaComponent, {
  Autosize: ScrollAreaAutosize,
  classes,
  varsResolver,
})

export type {
  ScrollAreaAutosizeFactory,
  ScrollAreaCssVariables,
  ScrollAreaEmits,
  ScrollAreaFactory,
  ScrollAreaOwnProps,
  ScrollAreaProps,
  ScrollAreaScrollbars,
  ScrollAreaSlots,
  ScrollAreaStylesNames,
  ScrollAreaType,
} from './ScrollArea.props.types'
