export interface HighlighterInput {
  colorScheme: 'light' | 'dark' | (string & {})
  code: string
  language?: string
}
export type Highlighter = (input: HighlighterInput) => {
  /** Highlighted code (HTML markup). */
  highlightedCode: string
  /** `true` if the code is represented with an HTML string, `false` for a plain text string. */
  isHighlighted: boolean
  /** Props passed down to the `<code>` element. */
  codeElementProps?: Record<string, any>
}
export interface CodeHighlightAdapter {
  loadContext?: () => Promise<any>
  getHighlighter: (ctx: any) => Highlighter
}
export interface CodeHighlightProviderContext {
  adapter: CodeHighlightAdapter
  highlight: Highlighter
}
export interface CodeHighlightAdapterProviderProps {
  /** Highlighting adapter used by descendant components. */
  adapter: CodeHighlightAdapter
}
