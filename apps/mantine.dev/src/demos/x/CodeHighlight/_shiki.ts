// Deprecated: no longer used. The shiki adapter is now provided once for the
// whole app via a single CodeHighlightAdapterProvider at the root (see
// src/code-highlight-adapter.ts and src/main.ts). This re-export is kept only
// so this file isn't a dangling orphan; nothing in this project imports from
// here anymore.
export { docsShikiAdapter as shikiAdapter } from '../../../code-highlight-adapter'
