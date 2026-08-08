export { CodeHighlight } from './CodeHighlight/CodeHighlight'
export { InlineCodeHighlight } from './CodeHighlight/InlineCodeHighlight'
export { CodeHighlightTabs } from './CodeHighlightTabs/CodeHighlightTabs'
export { CodeHighlightControl } from './CodeHighlight/CodeHighlightControl/CodeHighlightControl'
export { useCodeHighlightContext } from './CodeHighlight/CodeHighlight.context'

export {
  CodeHighlightAdapterProvider,
  useHighlight,
} from './CodeHighlightProvider/CodeHighlightProvider'

export { createHighlightJsAdapter } from './CodeHighlightProvider/adapters/highlight-js-adapter'
export {
  createShikiAdapter,
  stripShikiCodeBlocks,
} from './CodeHighlightProvider/adapters/shiki-adapter'
export { plainTextAdapter } from './CodeHighlightProvider/adapters/plain-text-adapter'

export type {
  CodeHighlightAdapter,
  Highlighter,
  HighlighterInput,
} from './CodeHighlightProvider/CodeHighlightProvider'
export type {
  CodeHighlightCssVariables,
  CodeHighlightEmits,
  CodeHighlightExpandEmits,
  CodeHighlightFactory,
  CodeHighlightProps,
  CodeHighlightSettings,
  CodeHighlightSlots,
  CodeHighlightStylesNames,
} from './CodeHighlight/CodeHighlight'
export type { CodeHighlightContextValue } from './CodeHighlight/CodeHighlight.context'
export type {
  CodeHighlightControlEmits,
  CodeHighlightControlProps,
} from './CodeHighlight/CodeHighlightControl/CodeHighlightControl'
export type {
  InlineCodeHighlightCssVariables,
  InlineCodeHighlightFactory,
  InlineCodeHighlightProps,
  InlineCodeHighlightStylesNames,
} from './CodeHighlight/InlineCodeHighlight'
export type {
  CodeHighlightDefaultLanguage,
  CodeHighlightTabsCode,
  CodeHighlightTabsEmits,
  CodeHighlightTabsFactory,
  CodeHighlightTabsProps,
  CodeHighlightTabsSlots,
  CodeHighlightTabsStylesNames,
} from './CodeHighlightTabs/CodeHighlightTabs'
