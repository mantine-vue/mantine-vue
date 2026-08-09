import CodeHighlightComponent, { varsResolver } from './CodeHighlight.vue'
import { CodeHighlightControl } from './CodeHighlightControl/CodeHighlightControl'
import classes from '../CodeHighlight.module.css'

export const CodeHighlight = Object.assign(CodeHighlightComponent, {
  classes,
  varsResolver,
  Control: CodeHighlightControl,
})
export type * from './CodeHighlight.types'
