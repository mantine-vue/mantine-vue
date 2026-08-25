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
  /** Lazily loads grammar data for a language. */
  loadLanguage?: (ctx: any, language: string) => Promise<any> | undefined
}
export interface CodeHighlightProviderContext {
  adapter: CodeHighlightAdapter
  highlight: Highlighter
  loadLanguage: (language: string | undefined) => void
  isLanguageLoaded: (language: string | undefined) => boolean
}
export interface CodeHighlightAdapterProviderProps {
  /** Highlighting adapter used by descendant components. */
  adapter: CodeHighlightAdapter
}
