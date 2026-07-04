import { createShikiAdapter, type CodeHighlightAdapter } from '@mantine-vue/code-highlight'

// Shiki highlighters are expensive and meant to be used as a singleton, so we
// cache the loading promise here and provide a single CodeHighlightAdapterProvider
// at the app root (see main.ts), used to highlight every code sample on the
// site, including the demo code panel (see demo/DemoCode.vue) and the
// dedicated x/code-highlight and x/tiptap demos.
let highlighterPromise: Promise<any> | undefined

function loadShiki() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({
        langs: ['vue', 'tsx', 'typescript', 'scss', 'html', 'bash', 'json'],
        themes: [],
      }),
    )
  }

  return highlighterPromise
}

export const docsShikiAdapter: CodeHighlightAdapter = createShikiAdapter(loadShiki)
