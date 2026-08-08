import InlineCodeHighlightComponent, { varsResolver } from './InlineCodeHighlight.vue'
import classes from '../CodeHighlight.module.css'
export const InlineCodeHighlight = Object.assign(InlineCodeHighlightComponent, {
  classes,
  varsResolver,
})
export type * from './InlineCodeHighlight.types'
