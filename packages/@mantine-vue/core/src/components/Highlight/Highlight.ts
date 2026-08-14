import { polymorphicFactory } from '../../core'
import { Text } from '../Text'
import HighlightComponent from './Highlight.vue'
import type { HighlightFactory } from './Highlight.types'

/**
 * `Highlight` has no CSS module of its own -- it renders `Text` and forwards the Styles API, so
 * Text's classes are the ones its style names refer to.
 */
export const Highlight = polymorphicFactory<HighlightFactory>(HighlightComponent, {
  classes: Text.classes,
})

export type {
  HighlightFactory,
  HighlightOwnProps,
  HighlightProps,
  HighlightSlots,
  HighlightTerm,
} from './Highlight.types'
